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
      try {
        const session = await auth();

        if (!session?.user) {
          console.error("[Uploadthing] No session found");
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw new UploadThingError("Unauthorized");
        }

        // Check if user is provider or admin
        const user = await db.user.findUnique({
          where: { id: session.user.id },
          select: { role: true },
        });

        if (user?.role !== "PROVIDER" && user?.role !== "ADMIN") {
          console.error("[Uploadthing] User role not authorized:", user?.role);
          // eslint-disable-next-line @typescript-eslint/only-throw-error
          throw new UploadThingError("Only providers can upload payment QR codes");
        }

        return { userId: session.user.id };
      } catch (error) {
        console.error("[Uploadthing] Middleware error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update user's paymentQrCode field
      // Use ufsUrl for UFS storage or url for regular storage
      const fileUrl = file.ufsUrl ?? file.url;
      await db.user.update({
        where: { id: metadata.userId },
        data: { paymentQrCode: fileUrl },
      });

      return { uploadedBy: metadata.userId, url: fileUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
