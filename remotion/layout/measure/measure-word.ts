const wordCache = new Map<string, number>();

export const measureWordWidth = ({
  text,
  fontFamily,
  fontWeight,
  fontSize,
}: {
  text: string;
  fontFamily: string;
  fontWeight: number | string;
  fontSize: number;
}) => {
  const key = `${text}-${fontFamily}-${fontWeight}-${fontSize}`;

  if (wordCache.has(key)) {
    return wordCache.get(key) as number;
  }

  const node = document.createElement("span");

  node.style.fontFamily = fontFamily;
  node.style.display = "inline-block";
  node.style.position = "absolute";
  node.style.top = `-10000px`;
  node.style.whiteSpace = "pre";
  node.style.fontWeight = fontWeight.toString();
  node.style.fontSize = `${fontSize}px`;
  node.innerText = text;

  document.body.appendChild(node);

  const boundingBox = node.getBoundingClientRect();

  document.body.removeChild(node);
  const result = boundingBox.width;
  wordCache.set(key, result);
  return result;
};
