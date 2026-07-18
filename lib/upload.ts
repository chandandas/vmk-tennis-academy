import { mkdir, writeFile } from "fs/promises";
import path from "path";

/**
 * Media upload abstraction.
 * Local: writes under /public/uploads. Swap to S3/Cloudinary later.
 */

export type UploadResult = {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
};

export type UploadInput = {
  file: File | Buffer;
  filename: string;
  mimeType: string;
  folder?: string;
};

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
}

export async function uploadFile(input: UploadInput): Promise<UploadResult> {
  const provider = process.env.UPLOAD_PROVIDER ?? "local";

  if (provider === "s3" || provider === "cloudinary") {
    throw new Error(
      `Upload provider "${provider}" is not configured yet. Use local for now.`
    );
  }

  const folder = input.folder ?? "general";
  const safeName = `${Date.now()}-${sanitizeFilename(input.filename)}`;
  const relativeDir = path.join("uploads", folder);
  const publicDir = path.join(process.cwd(), "public", relativeDir);

  await mkdir(publicDir, { recursive: true });

  const buffer = Buffer.isBuffer(input.file)
    ? input.file
    : Buffer.from(await (input.file as File).arrayBuffer());

  await writeFile(path.join(publicDir, safeName), buffer);

  return {
    url: `/${relativeDir}/${safeName}`.replace(/\\/g, "/"),
    filename: safeName,
    size: buffer.length,
    mimeType: input.mimeType,
  };
}
