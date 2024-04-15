import type { SetStateAction } from "react";
import React, { useCallback } from "react";
import { createNewFolderRef } from "./NewFolderDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const NEW_FOLDER_TOKEN = "__remotion_new_folder";

export const SelectedFolder: React.FC<{
  readonly folders: string[];
  readonly selectedProject: string | null;
  readonly setSelectedProject: React.Dispatch<SetStateAction<string | null>>;
}> = ({ folders, selectedProject, setSelectedProject }) => {
  const onValueChange = useCallback(
    (value: string) => {
      if (value === NEW_FOLDER_TOKEN) {
        createNewFolderRef.current?.openDialog();
      } else {
        setSelectedProject(value);
      }
    },
    [setSelectedProject],
  );

  const placeholder = (
    <span
      style={{
        opacity: 0.5,
      }}
    >
      None selected
    </span>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ whiteSpace: "nowrap" }}>Save to:</div>
      <Select
        value={selectedProject ?? undefined}
        onValueChange={onValueChange}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>
            <span
              style={{
                marginRight: 10,
                display: "inline-block",
              }}
            >
              {selectedProject ? (
                <span>public/{selectedProject}</span>
              ) : (
                placeholder
              )}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NEW_FOLDER_TOKEN}>New folder</SelectItem>
          {folders.length !== 0 && <SelectSeparator />}
          {folders.map((project, i) => {
            const key = i + project;
            return (
              <SelectItem key={key} value={project}>
                public/{project}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
