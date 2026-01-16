import { config } from "@/config";
import { STYLES } from "@/services";
import z from "zod";

export const headshotPhotoSchema = z
  .object({
    styles: z
      .string()
      .default("[]")
      .transform((val) => JSON.parse(val))
      .pipe(
        z
          .array(z.string())
          .max(
            config.upload.maxFilesCount,
            `Maximum ${config.upload.maxFilesCount} styles allowed`
          )
          .refine(
            (arr) => arr.length === 0 || arr.every((s) => s in STYLES),
            "Invalid style selected"
          )
      ),

    prompt: z
      .string()
      .max(300, "Prompt can't exceed 300 characters")
      .optional(),
  })
  .refine(
      (data) => data.styles.length > 0 || (data.prompt && data.prompt.trim()),
    'Either select at least one style or provide a custom prompt'
  );


  export type HeadshotPhotoParams = z.infer<typeof headshotPhotoSchema>;