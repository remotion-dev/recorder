import { z } from "zod";

export const theme = z.enum(["light", "dark"]);
export type Theme = z.infer<typeof theme>;
