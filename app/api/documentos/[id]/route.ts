import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const doc = await prisma.documento.findUnique({
    where: { id: Number(id) },
    select: { contenido: true, mimeType: true, nombreArchivo: true, activo: true },
  });

  if (!doc || !doc.activo || !doc.contenido) {
    return new NextResponse("Archivo no encontrado", { status: 404 });
  }

  const filename = doc.nombreArchivo || `documento-${id}`;
  return new NextResponse(doc.contenido, {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
