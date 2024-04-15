import type { SetStateAction } from "react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const SelectedProject: React.FC<{
  readonly projects: string[];
  readonly selectedProject: string | null;
  readonly setSelectedProject: React.Dispatch<SetStateAction<string | null>>;
}> = ({ projects, selectedProject, setSelectedProject }) => {
  if (!projects) {
    return null;
  }

  const placeholder = selectedProject ?? projects[0];
  return (
    <div
      style={{
        marginRight: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
      }}
    >
      Project:
      <Select
        onValueChange={(value) => {
          setSelectedProject(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder}>{selectedProject}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {projects.map((project, i) => {
            const key = i + project;
            return (
              <SelectItem key={key} value={project}>
                {project}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};
