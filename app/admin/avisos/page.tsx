import { prisma } from "@/lib/prisma";
import { crearAviso, eliminarAviso } from "@/app/actions";

const tipos = ["URGENTE", "ALERTA", "INFORMACION", "EVENTO", "ASAMBLEA"];

const tipoCfg: Record<string, { bg: string; color: string }> = {
  URGENTE:     { bg: "#fff0f2", color: "#c8102e" },
  ALERTA:      { bg: "#fff3f0", color: "#d14c00" },
  INFORMACION: { bg: "#f0f5ff", color: "#003876" },
  EVENTO:      { bg: "#f0faf5", color: "#1a6b3c" },
  ASAMBLEA:    { bg: "#f8f5ff", color: "#4b0082" },
};

export default async function AdminAvisos() {
  const avisos = await prisma.aviso.findMany({
    where: { activo: true },
    orderBy: { fecha: "desc" },
  });

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
          Gestionar avisos
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
          Publica y elimina avisos visibles en el sitio público.
        </p>
      </div>

      {/* Create form */}
      <div
        className="bg-white rounded-2xl overflow-hidden mb-8"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: "#003876" }}
          >
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Nuevo aviso</div>
        </div>

        <form action={crearAviso} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Título <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <input
                name="titulo"
                required
                placeholder="Ej. Corte de agua programado"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-shadow focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Tipo <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <select
                name="tipo"
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none appearance-none"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e", background: "#fff" }}
              >
                {tipos.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0) + t.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
              Descripción <span style={{ color: "#c8102e" }}>*</span>
            </label>
            <textarea
              name="descripcion"
              required
              rows={3}
              placeholder="Describe el aviso con detalle..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-y"
              style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-px hover:shadow-md"
              style={{ background: "#003876", boxShadow: "0 2px 8px rgba(0,56,118,0.25)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Publicar aviso
            </button>
          </div>
        </form>
      </div>

      {/* Avisos list */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>
            Avisos activos
          </div>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "#f0f5ff", color: "#003876" }}
          >
            {avisos.length}
          </span>
        </div>

        {avisos.map((a, i) => {
          const cfg = tipoCfg[a.tipo] ?? tipoCfg.INFORMACION;
          return (
            <div
              key={a.id}
              className="px-6 py-4 flex items-start gap-4"
              style={{ borderBottom: i < avisos.length - 1 ? "1px solid #f8f9fc" : undefined }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {a.tipo.charAt(0) + a.tipo.slice(1).toLowerCase()}
                  </span>
                  <span className="text-xs" style={{ color: "#8a95a3" }}>
                    {new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short", year: "numeric" }).format(a.fecha)}
                  </span>
                </div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: "#0e1b2e" }}>{a.titulo}</div>
                <div className="text-xs leading-relaxed line-clamp-2" style={{ color: "#8a95a3" }}>{a.descripcion}</div>
              </div>
              <form
                action={async () => {
                  "use server";
                  await eliminarAviso(a.id);
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-red-50 flex-shrink-0"
                  style={{ borderColor: "#fecdd3", color: "#c8102e" }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </form>
            </div>
          );
        })}

        {avisos.length === 0 && (
          <div className="py-14 text-center">
            <div className="text-sm font-medium mb-1" style={{ color: "#8a95a3" }}>
              No hay avisos activos
            </div>
            <div className="text-xs" style={{ color: "#b0bac5" }}>
              Usa el formulario de arriba para publicar uno
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
