import { z } from "zod";

export const WorkspaceResourceSchema = z.object({
    type: z.string(),
    options: z.any()
})

export const WorkspaceSchema = z.object({
    resources: z.array(WorkspaceResourceSchema),
    menu: z.any()
});

export type WorkspaceData = z.infer<typeof WorkspaceSchema>;
export type WorkspaceResourceData = z.infer<typeof WorkspaceResourceSchema>;