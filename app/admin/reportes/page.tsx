import { prisma } from "@/lib/prisma";
import { actualizarEstadoReporte } from "@/app/actions";

const estados = ["PENDIENTE", "EN_PROCESO", "RESUELTO"];

const estadoStyle: Record<string, { bg: string; color: string; label: string }> = {
  PENDIENTE:  { bg: "#fff0f2", color: "#c8102e", label: "Pendiente" },
  EN_PROCESO: { bg: "#fff8e8", color: "#92600a", label: "En proceso" },
  RESUELTO:   { bg: "#f0faf5", color: "#1a6b3c", label: "Resuelto" },
};

export default async function AdminReportes() {
  const reportes = await prisma.reporte.findMany({
    orderBy: { createdAt: "desc" },
  });

  const pendientes = reportes.filter((r) => r.estado === "PENDIENTE").length;

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
            Reportes de vecinos
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
            {reportes.length} {reportes.length === 1 ? "reporte" : "reportes"} en total
            {pendientes > 0 && (
              <span className="ml-2 font-semibold" style={{ color: "#c8102e" }}>
                · {pendientes} pendiente{pendientes > 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 grid grid-cols-[1fr_auto] items-center"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>
            Todos los reportes
          </div>
          <div className="flex items-center gap-3">
            {Object.entries(estadoStyle).map(([key, st]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs" style={{ color: "#8a95a3" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: st.color }} />
                {st.label}
              </span>
            ))}
          </div>
        </div>

        {reportes.length === 0 ? (
          <div className="py-14 text-center">
            <div className="text-sm font-medium mb-1" style={{ color: "#8a95a3" }}>
              No hay reportes todavía
            </div>
            <div className="text-xs" style={{ color: "#b0bac5" }}>
              Los reportes de vecinos aparecerán aquí
            </div>
          </div>
        ) : (
          reportes.map((r, i) => {
            const st = estadoStyle[r.estado] ?? estadoStyle.PENDIENTE;
            return (
              <div
                key={r.id}
                className="px-6 py-5"
                style={{ borderBottom: i < reportes.length - 1 ? "1px solid #f8f9fc" : undefined }}
              >
                <div className="flex items-start gap-4">
                  {/* Status indicator */}
                  <div
                    className="w-1.5 h-full min-h-[60px] rounded-full flex-shrink-0 mt-1"
                    style={{ background: st.color, opacity: 0.6 }}
                  />

                  <div className="flex-1 min-w-0">
                    {/* Meta row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: "#f0f5ff", color: "#003876" }}
                      >
                        {r.tipo}
                      </span>
                      <span className="text-xs" style={{ color: "#b0bac5" }}>
                        {new Intl.DateTimeFormat("es-DO", { dateStyle: "medium", timeStyle: "short" }).format(r.createdAt)}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: "#8a95a3" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm font-semibold" style={{ color: "#0e1b2e" }}>{r.ubicacion}</span>
                    </div>

                    {/* Reporter */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: "#8a95a3" }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs" style={{ color: "#5a6678" }}>
                        <strong>{r.nombre}</strong>
                        {r.telefono && (
                          <>
                            {" · "}
                            <a href={`tel:${r.telefono.replace(/\D/g, "")}`} style={{ color: "#003876" }}>
                              {r.telefono}
                            </a>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs leading-relaxed" style={{ color: "#8a95a3" }}>{r.descripcion}</p>
                  </div>

                  {/* Status form */}
                  <div className="flex-shrink-0">
                    <form
                      action={async (fd: FormData) => {
                        "use server";
                        const estado = String(fd.get("estado"));
                        await actualizarEstadoReporte(r.id, estado);
                      }}
                      className="flex items-center gap-2"
                    >
                      <select
                        name="estado"
                        defaultValue={r.estado}
                        className="text-xs rounded-lg px-3 py-1.5 outline-none appearance-none"
                        style={{
                          border: "1.5px solid #e2e8f0",
                          color: "#0e1b2e",
                          background: "#fff",
                        }}
                      >
                        {estados.map((e) => (
                          <option key={e} value={e}>
                            {estadoStyle[e]?.label ?? e}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-all hover:-translate-y-px hover:shadow-sm"
                        style={{ background: "#003876" }}
                      >
                        Guardar
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
