import { SERVER_PORT } from "../config/server";
import { CREATE_PROJECTS } from "../scripts/server/constants";

type CreateProjectResBodyType = {
  success: boolean;
  message: string;
};

export const createProject = async (projectName: string) => {
  const payload = { projectName };
  const res = await fetch(`http://localhost:${SERVER_PORT}${CREATE_PROJECTS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const jsn = (await res.json()) as CreateProjectResBodyType;

  if (res.status === 201) {
    return jsn;
  }

  throw new Error(jsn.message);
};
