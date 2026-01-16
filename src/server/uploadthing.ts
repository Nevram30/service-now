import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

const f = createUploadthing();

export const ourFileRouter = {
  // Upload route for payment QR codes - only providers and admins can upload
  paymentQrUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Unauthorized");
      }

      // Check if user is provider or admin
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });

      if (user?.role !== "PROVIDER" && user?.role !== "ADMIN") {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw new UploadThingError("Only providers can upload payment QR codes");
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update user's paymentQrCode field
      await db.user.update({
        where: { id: metadata.userId },
        data: { paymentQrCode: file.ufsUrl },
      });

      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
