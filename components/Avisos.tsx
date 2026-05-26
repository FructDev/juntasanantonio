import { prisma } from "@/lib/prisma";

const TIPO_CFG: Record<string, {
  label: string;
  bg: string;
  color: string;
  dot: string;
  leftBorder: string;
}> = {
  URGENTE:     { label: "Urgente",      bg: "#fff0f2", color: "#c8102e", dot: "#c8102e",  leftBorder: "#c8102e" },
  ALERTA:      { label: "Alerta",       bg: "#fff3f0", color: "#d14c00", dot: "#e06030",  leftBorder: "#e06030" },
  INFORMACION: { label: "Información",  bg: "#f0f5ff", color: "#003876", dot: "#003876",  leftBorder: "#003876" },
  EVENTO:      { label: "Evento",       bg: "#f0faf5", color: "#1a6b3c", dot: "#2e7d52",  leftBorder: "#2e7d52" },
  ASAMBLEA:    { label: "Asamblea",     bg: "#f8f5ff", color: "#4b0082", dot: "#7c3aed",  leftBorder: "#7c3aed" },
};

function formatFecha(d: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  if (days < 7) return `Hace ${days} días`;
  return new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short" }).format(d);
}

export default async function Avisos() {
  const avisos = await prisma.aviso.findMany({
    where: { activo: true },
    orderBy: { fecha: "desc" },
    take: 6,
  });

  const urgentes = avisos.filter((a) => a.tipo === "URGENTE" || a.tipo === "ALERTA");
  const resto = avisos.filter((a) => a.tipo !== "URGENTE" && a.tipo !== "ALERTA");

  return (
    <section id="avisos" className="py-20 px-6" style={{ background: "#f5f7fa" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#003876" }}>
              Tablón de avisos
            </p>
            <h2
              className="text-3xl font-black"
              style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}
            >
              Avisos del barrio
            </h2>
            <p className="text-sm mt-2" style={{ color: "#5a6678" }}>
              Información relevante y actualizada para todos los residentes.
            </p>
          </div>
          {urgentes.length > 0 && (
            <div
              className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0"
              style={{ background: "#fff0f2", color: "#c8102e", border: "1px solid #ffd0d8" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#c8102e" }}
              />
              {urgentes.length} {urgentes.length === 1 ? "aviso urgente" : "avisos urgentes"}
            </div>
          )}
        </div>

        {/* Urgentes (si los hay) — full width */}
        {urgentes.length > 0 && (
          <div className="mb-5 space-y-3">
            {urgentes.map((a) => {
              const cfg = TIPO_CFG[a.tipo] ?? TIPO_CFG.INFORMACION;
              return (
                <div
                  key={a.id}
                  className="flex gap-4 p-5 rounded-2xl"
                  style={{
                    background: cfg.bg,
                    border: `1px solid ${cfg.leftBorder}30`,
                    borderLeft: `3px solid ${cfg.leftBorder}`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <span
                        className="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                        style={{ background: cfg.color + "18", color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-xs" style={{ color: "#8a95a3" }}>{formatFecha(a.fecha)}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: "#0e1b2e" }}>{a.titulo}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "#5a6678" }}>{a.descripcion}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resto — grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resto.map((a) => {
            const cfg = TIPO_CFG[a.tipo] ?? TIPO_CFG.INFORMACION;
            return (
              <div
                key={a.id}
                className="bg-white rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
                style={{
                  border: "1px solid #edf0f5",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                {/* Top accent */}
                <div className="h-1" style={{ background: cfg.leftBorder }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-xs" style={{ color: "#b0bac5" }}>
                      {formatFecha(a.fecha)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-1.5 leading-tight" style={{ color: "#0e1b2e" }}>
                    {a.titulo}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#6b7a8d" }}>
                    {a.descripcion}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {avisos.length === 0 && (
          <div className="text-center py-16 text-sm" style={{ color: "#8a95a3" }}>
            No hay avisos en este momento.
          </div>
        )}
      </div>
    </section>
  );
}
