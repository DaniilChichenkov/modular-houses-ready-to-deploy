import imageCompression from "browser-image-compression";

const MAX_SIZE_MB = 0.5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export default async function compressFile(file: File): Promise<File> {
  //Check if file was not compressed before
  if (file.size <= MAX_SIZE_BYTES) {
    return file;
  }

  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1920,
    initialQuality: 0.7,
    useWebWorker: true,
  };
  return await imageCompression(file, options);
}
