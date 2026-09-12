export async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }
  if (file.size > 12 * 1024 * 1024) {
    throw new Error("That file is larger than 12 MB.");
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image.");
  ctx.drawImage(bitmap, 0, 0, w, h);
  let data = canvas.toDataURL("image/jpeg", quality);
  if (data.length > 900_000) data = canvas.toDataURL("image/jpeg", 0.7);
  if (data.length > 900_000) data = canvas.toDataURL("image/jpeg", 0.55);
  if (data.length > 1_050_000) {
    throw new Error("Image is still too large after compression. Try a smaller photo.");
  }
  return data;
}
