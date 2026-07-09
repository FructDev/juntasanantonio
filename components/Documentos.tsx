import { prisma } from "@/lib/prisma";
import DocumentosFiltro from "./DocumentosFiltro";

export default async function Documentos() {
  const docs = await prisma.documento.findMany({
    where: { activo: true },
    orderBy: { fecha: "desc" },
    select: { id: true, nombre: true, categoria: true, nombreArchivo: true, tamano: true, fecha: true },
  });

  return (
    <section id="documentos" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1b5e20" }}>
            Acceso público
          </p>
          <h2 className="text-3xl font-black mb-2" style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}>
            Documentos oficiales
          </h2>
          <p className="text-sm" style={{ color: "#5a6678" }}>
            Actas, cartas al ayuntamiento y estados de caja disponibles para todos los residentes.
          </p>
        </div>
        <DocumentosFiltro docs={docs} />
      </div>
    </section>
  );
}
