import { createUploadthing, type FileRouter } from "uploadthing/next";
import { verifyToken } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
  eventGallery: f({
    image: { maxFileSize: "8MB", maxFileCount: 20 },
    video: { maxFileSize: "512MB", maxFileCount: 4 },
  })
    .middleware(async ({ req }) => {
      const cookieHeader = req.headers.get("cookie") ?? "";
      const match = cookieHeader.match(/admin_session=([^;]+)/);
      const token = match?.[1] ?? "";
      if (!verifyToken(token)) throw new Error("Unauthorized");
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
