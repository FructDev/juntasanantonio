import { prisma } from "@/lib/prisma";

function fmt(n: number) {
  return new Intl.NumberFormat("es-DO", { style: "currency", currency: "DOP", minimumFractionDigits: 0 }).format(n);
}

function formatFecha(d: Date | null) {
  if (!d) return null;
  return new Intl.DateTimeFormat("es-DO", { month: "short", year: "numeric" }).format(d);
}

const estadoCfg: Record<string, { label: string; bg: string; color: string; dot: string }> = {
  PLANIFICADA: { label: "Planificada",  bg: "#f1f8f1", color: "#1b5e20", dot: "#5b8dd9" },
  EN_CURSO:    { label: "En curso",     bg: "#fffbf0", color: "#92600a", dot: "#f0a500" },
  COMPLETADA:  { label: "Completada",   bg: "#f0faf5", color: "#1a6b3c", dot: "#2e7d52" },
};

export default async function Obras() {
  const obras = await prisma.obra.findMany({
    where: { activo: true },
    orderBy: { createdAt: "desc" },
  });

  if (obras.length === 0) return null;

  const completadas = obras.filter((o) => o.estado === "COMPLETADA").length;
  const enCurso = obras.filter((o) => o.estado === "EN_CURSO").length;

  return (
    <section id="obras" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1b5e20" }}>
              Gestión activa
            </p>
            <h2 className="text-3xl font-black mb-2" style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}>
              Obras y proyectos
            </h2>
            <p className="text-sm" style={{ color: "#5a6678" }}>
              Registro de obras realizadas y en planificación en el barrio.
            </p>
          </div>
          <div className="flex gap-3">
            {enCurso > 0 && (
              <div
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "#fffbf0", color: "#92600a", border: "1px solid #fde8a0" }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#f0a500" }} />
                {enCurso} en curso
              </div>
            )}
            {completadas > 0 && (
              <div
                className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "#f0faf5", color: "#1a6b3c", border: "1px solid #bbf0d4" }}
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {completadas} completadas
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {obras.map((obra) => {
            const cfg = estadoCfg[obra.estado] ?? estadoCfg.PLANIFICADA;
            return (
              <div
                key={obra.id}
                className="bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
                style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
              >
                {/* Top accent bar */}
                <div className="h-1" style={{ background: cfg.dot }} />

                <div className="p-5">
                  {/* Status badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          background: cfg.dot,
                          animation: obra.estado === "EN_CURSO" ? "pulse 2s infinite" : undefined,
                        }}
                      />
                      {cfg.label}
                    </span>
                    {obra.costo != null && (
                      <span className="text-xs font-bold" style={{ color: "#1b5e20" }}>
                        {fmt(obra.costo)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold mb-2 leading-snug" style={{ color: "#0e1b2e" }}>
                    {obra.titulo}
                  </h3>

                  {/* Description */}
                  <p className="text-xs leading-relaxed mb-4" style={{ color: "#6b7a8d" }}>
                    {obra.descripcion}
                  </p>

                  {/* Dates */}
                  {(obra.inicio || obra.fin) && (
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "#8a95a3" }}>
                      <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {obra.inicio && formatFecha(obra.inicio)}
                      {obra.inicio && obra.fin && " → "}
                      {obra.fin && formatFecha(obra.fin)}
                      {obra.inicio && !obra.fin && obra.estado === "EN_CURSO" && " → en progreso"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
