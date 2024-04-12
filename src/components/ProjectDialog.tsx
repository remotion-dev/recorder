import type { ChangeEvent, SetStateAction } from "react";
import React, { useMemo, useState } from "react";
import { createProject } from "../create-project";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const ProjectDialog: React.FC<{
  setSelectedProject: React.Dispatch<SetStateAction<string | null>>;
  refreshProjectList: () => Promise<void>;
}> = ({ refreshProjectList, setSelectedProject }) => {
  const [newProject, setNewProject] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewProject(event.target.value);
  };

  const getRegex = () => /^([a-zA-Z0-9-\u4E00-\u9FFF])+$/g;

  const invalidInput = useMemo(() => {
    const match = newProject.match(getRegex());
    if (newProject.length === 0) {
      return null;
    }

    if (!match || match.length === 0) {
      return "Project names can't contain spaces or special symbols.";
    }

    return null;
  }, [newProject]);

  const disabled = useMemo(() => {
    return invalidInput !== null || newProject.length === 0;
  }, [invalidInput, newProject.length]);

  const handleSubmit = async () => {
    const res = await createProject(newProject);
    if (res.success) {
      setSelectedProject(newProject);
      setNewProject("");
      refreshProjectList();
      setOpen(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="secondary">New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Create a new video project. This will automatically create a new
            project folder in the Remotion Studio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Project Name
            </Label>

            <Input
              id="name"
              placeholder="Add your project name..."
              value={newProject}
              className="col-span-3"
              onChange={handleChange}
            />
            <Label className="col-start-2 col-end-5 text-red-600">
              {invalidInput ?? null}
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={disabled}>
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
