import { readFileSync, writeFileSync } from "node:fs";
import { EOL } from "node:os";
import path from "node:path";

type Subtitle = {
	text: string;
	startMs: number;
	endMs: number;
};

const formatSrtTimestamp = (ms: number) => {
	const hours = Math.floor(ms / 3600000);
	const minutes = Math.floor((ms % 3600000) / 60000);
	const seconds = Math.floor((ms % 60000) / 1000);
	const milliseconds = Math.floor(ms % 1000);

	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
		2,
		"0",
	)}:${String(seconds).padStart(2, "0")},${String(milliseconds).padStart(
		3,
		"0",
	)}`;
};

const countWords = (text: string): number => {
	return text.trim().split(/\s+/).length;
};

const groupSubtitles = (subtitles: Subtitle[]): Subtitle[] => {
	const MAX_WORDS = 8;
	const MIN_DURATION_MS = 2000; // 2 seconds minimum
	const grouped: Subtitle[] = [];
	let currentGroup: Subtitle | null = null;

	for (const sub of subtitles) {
		if (!currentGroup) {
			currentGroup = { ...sub };
			continue;
		}

		const potentialText = currentGroup.text + sub.text;
		const wordCount = countWords(potentialText);

		// Start a new group if:
		// 1. Adding this subtitle would exceed MAX_WORDS
		// 2. OR current group ends with punctuation and is long enough
		if (
			wordCount > MAX_WORDS ||
			(currentGroup.text.trim().match(/[.!?]$/) &&
				currentGroup.endMs - currentGroup.startMs >= MIN_DURATION_MS)
		) {
			grouped.push(currentGroup);
			currentGroup = { ...sub };
		} else {
			// Extend current group
			currentGroup.text += sub.text;
			currentGroup.endMs = sub.endMs;
		}
	}

	// Don't forget the last group
	if (currentGroup) {
		grouped.push(currentGroup);
	}

	return grouped;
};

const convertJsonToSrt = (jsonPath: string) => {
	// Read and parse JSON file
	const subtitles: Subtitle[] = JSON.parse(readFileSync(jsonPath, "utf-8"));

	// Group subtitles into segments
	const groupedSubtitles = groupSubtitles(subtitles);

	// Generate SRT content
	const srtContent = groupedSubtitles
		.map((subtitle, index) => {
			return [
				index + 1,
				`${formatSrtTimestamp(subtitle.startMs)} --> ${formatSrtTimestamp(
					subtitle.endMs,
				)}`,
				subtitle.text.trim(),
				"",
			].join(EOL);
		})
		.join(EOL);

	// Generate output path
	const outputPath = jsonPath.replace(".json", ".srt");

	// Write SRT file
	writeFileSync(outputPath, srtContent + EOL);
	console.log(`Converted ${path.basename(jsonPath)} to SRT format`);
};

// Usage
const jsonPath = process.argv[2];

if (!jsonPath) {
	console.error("Please provide a JSON subtitles file path");
	process.exit(1);
}

convertJsonToSrt(jsonPath);
