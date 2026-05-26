import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Sube un File a Cloudinary y devuelve la URL segura.
 * Aplica recorte cuadrado centrado en la cara (ideal para avatares).
 */
export async function subirFoto(file: File, folder = "junta-vecinos/directiva"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          transformation: [
            { width: 300, height: 300, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload failed"));
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

/**
 * Elimina una imagen de Cloudinary a partir de su URL.
 */
export async function eliminarFoto(url: string): Promise<void> {
  try {
    // Extrae el public_id desde la URL: .../upload/v123/folder/filename.ext
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    if (match) await cloudinary.uploader.destroy(match[1]);
  } catch {
    // Falla silenciosamente — la foto puede ya no existir
  }
}
