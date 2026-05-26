import { prisma } from "@/lib/prisma";
import { crearObra, actualizarEstadoObra, eliminarObra } from "@/app/actions";

const estadosObra = ["PLANIFICADA", "EN_CURSO", "COMPLETADA"];

const estadoCfg: Record<string, { bg: string; color: string; label: string }> = {
  PLANIFICADA: { bg: "#f0f5ff", color: "#003876", label: "Planificada" },
  EN_CURSO:    { bg: "#fffbf0", color: "#92600a", label: "En curso" },
  COMPLETADA:  { bg: "#f0faf5", color: "#1a6b3c", label: "Completada" },
};

function fmt(n: number) {
  return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", minimumFractionDigits: 0 }).format(n);
}

export default async function AdminObras() {
  const obras = await prisma.obra.findMany({
    where: { activo: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
          Obras y proyectos
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
          Gestiona el historial de obras del barrio visibles en el portal.
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
          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "#003876" }}>
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Nueva obra o proyecto</div>
        </div>

        <form action={crearObra} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Título <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <input
                name="titulo"
                required
                placeholder="Ej: Pavimentación calle 7"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Descripción <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <textarea
                name="descripcion"
                required
                rows={2}
                placeholder="Describe el alcance de la obra..."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Estado</label>
              <select
                name="estado"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none appearance-none"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e", background: "#fff" }}
              >
                {estadosObra.map((e) => (
                  <option key={e} value={e}>{estadoCfg[e]?.label ?? e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Costo estimado (DOP)</label>
              <input
                name="costo"
                type="number"
                placeholder="Ej: 85000"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Fecha de inicio</label>
              <input
                name="inicio"
                type="date"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Fecha de término</label>
              <input
                name="fin"
                type="date"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-px hover:shadow-md"
              style={{ background: "#003876", boxShadow: "0 2px 8px rgba(0,56,118,0.25)" }}
            >
              Publicar obra
            </button>
          </div>
        </form>
      </div>

      {/* Obras list */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Obras activas</div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#f0f5ff", color: "#003876" }}>
            {obras.length}
          </span>
        </div>

        {obras.map((obra, i) => {
          const cfg = estadoCfg[obra.estado] ?? estadoCfg.PLANIFICADA;
          return (
            <div
              key={obra.id}
              className="px-6 py-4 flex items-start gap-4"
              style={{ borderBottom: i < obras.length - 1 ? "1px solid #f8f9fc" : undefined }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                    {cfg.label}
                  </span>
                  {obra.costo != null && (
                    <span className="text-xs font-semibold" style={{ color: "#003876" }}>{fmt(obra.costo)}</span>
                  )}
                </div>
                <div className="text-sm font-semibold mb-0.5" style={{ color: "#0e1b2e" }}>{obra.titulo}</div>
                <div className="text-xs leading-relaxed line-clamp-2" style={{ color: "#8a95a3" }}>{obra.descripcion}</div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <form action={async (fd: FormData) => {
                  "use server";
                  await actualizarEstadoObra(obra.id, String(fd.get("estado")));
                }} className="flex items-center gap-2">
                  <select
                    name="estado"
                    defaultValue={obra.estado}
                    className="text-xs rounded-lg px-2.5 py-1.5 outline-none appearance-none"
                    style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e", background: "#fff" }}
                  >
                    {estadosObra.map((e) => (
                      <option key={e} value={e}>{estadoCfg[e]?.label ?? e}</option>
                    ))}
                  </select>
                  <button type="submit" className="text-xs px-3 py-1.5 rounded-lg text-white font-medium" style={{ background: "#003876" }}>
                    Guardar
                  </button>
                </form>
                <form action={async () => { "use server"; await eliminarObra(obra.id); }}>
                  <button
                    type="submit"
                    className="text-xs px-2.5 py-1.5 rounded-lg border transition-colors hover:bg-red-50"
                    style={{ borderColor: "#fecdd3", color: "#c8102e" }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          );
        })}

        {obras.length === 0 && (
          <div className="py-14 text-center">
            <div className="text-sm font-medium mb-1" style={{ color: "#8a95a3" }}>No hay obras registradas</div>
            <div className="text-xs" style={{ color: "#b0bac5" }}>Usa el formulario de arriba para agregar una</div>
          </div>
        )}
      </div>
    </div>
  );
}
