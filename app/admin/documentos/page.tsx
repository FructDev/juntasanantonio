import { prisma } from "@/lib/prisma";
import { subirDocumento, eliminarDocumento } from "@/app/actions";

const CATEGORIAS = ["ACTA", "CARTA", "FINANZA", "REGLAMENTO", "OTRO"];
const catLabel: Record<string, string> = {
  ACTA: "Acta", CARTA: "Carta", FINANZA: "Finanza", REGLAMENTO: "Reglamento", OTRO: "Otro",
};
const catColor: Record<string, { bg: string; color: string }> = {
  ACTA:       { bg: "#f0f5ff", color: "#003876" },
  CARTA:      { bg: "#f0faf5", color: "#1a6b3c" },
  FINANZA:    { bg: "#fffbf0", color: "#92600a" },
  REGLAMENTO: { bg: "#f5f0ff", color: "#6b21a8" },
  OTRO:       { bg: "#f8f9fc", color: "#5a6678" },
};

export default async function AdminDocumentos() {
  const documentos = await prisma.documento.findMany({
    where: { activo: true },
    orderBy: { fecha: "desc" },
    select: {
      id: true, nombre: true, categoria: true,
      nombreArchivo: true, tamano: true, fecha: true,
      // contenido excluido — no necesitamos los bytes para listar
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
          Documentos
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
          Sube actas, cartas y estados de cuenta para que los vecinos puedan descargarlos.
        </p>
      </div>

      {/* Upload form */}
      <div
        className="bg-white rounded-2xl overflow-hidden mb-8"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "#003876" }}>
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Subir documento</div>
        </div>
        <form action={subirDocumento} className="p-6" encType="multipart/form-data">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Nombre del documento <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <input
                name="nombre"
                required
                placeholder="Ej: Acta asamblea ordinaria — Mayo 2025"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Categoría <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <select
                name="categoria"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              >
                <option value="">Seleccionar...</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{catLabel[c]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
              Archivo (PDF, DOCX, etc.)
            </label>
            <input
              name="archivo"
              type="file"
              accept=".pdf,.doc,.docx,.xlsx,.xls,.jpg,.png"
              className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              style={{ color: "#5a6678" }}
            />
            <p className="text-xs mt-1.5" style={{ color: "#b0bac5" }}>
              Máx. 20 MB · Si no subes archivo, el documento aparecerá como "No disponible" en la lista pública.
            </p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-md transition-all hover:-translate-y-px"
              style={{ background: "#003876", boxShadow: "0 2px 8px rgba(0,56,118,0.25)" }}
            >
              Subir documento
            </button>
          </div>
        </form>
      </div>

      {/* Documents list */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Documentos publicados</div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#f0f5ff", color: "#003876" }}>
            {documentos.length} documentos
          </span>
        </div>

        {documentos.length === 0 ? (
          <div className="py-14 text-center">
            <div className="text-sm font-medium mb-1" style={{ color: "#8a95a3" }}>No hay documentos publicados</div>
            <div className="text-xs" style={{ color: "#b0bac5" }}>Usa el formulario de arriba para subir el primero</div>
          </div>
        ) : (
          documentos.map((doc, i) => {
            const cat = catColor[doc.categoria] ?? catColor.OTRO;
            const hasFile = !!doc.nombreArchivo;
            return (
              <div
                key={doc.id}
                className="px-6 py-4 flex items-center gap-4"
                style={{ borderBottom: i < documentos.length - 1 ? "1px solid #f8f9fc" : undefined }}
              >
                {/* File icon */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: cat.bg }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: cat.color }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate" style={{ color: "#0e1b2e" }}>{doc.nombre}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: cat.bg, color: cat.color }}
                    >
                      {catLabel[doc.categoria] ?? doc.categoria}
                    </span>
                    {doc.tamano && (
                      <span className="text-xs" style={{ color: "#b0bac5" }}>{doc.tamano}</span>
                    )}
                    <span className="text-xs" style={{ color: "#b0bac5" }}>
                      {new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short", year: "numeric" }).format(doc.fecha)}
                    </span>
                  </div>
                </div>

                {/* Download link */}
                {hasFile ? (
                  <a
                    href={`/api/documentos/${doc.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 flex-shrink-0"
                    style={{ background: "#f0f5ff", color: "#003876" }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Descargar
                  </a>
                ) : (
                  <span className="text-xs px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: "#f8f9fc", color: "#b0bac5" }}>
                    Sin archivo
                  </span>
                )}

                {/* Delete */}
                <form
                  action={async () => {
                    "use server";
                    await eliminarDocumento(doc.id);
                  }}
                >
                  <button
                    type="submit"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 flex-shrink-0"
                    style={{ color: "#c8102e" }}
                    title="Eliminar"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </form>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
