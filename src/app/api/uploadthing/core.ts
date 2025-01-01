import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  // Define multiple file routes
  mediaUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 }, video: { maxFileSize: "16MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { };  // Add auth check here later if needed
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: "admin", url: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;