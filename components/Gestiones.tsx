import { prisma } from "@/lib/prisma";

const estadoCfg = {
  PENDIENTE:  { label: "Pendiente",   bg: "#fff0f2", color: "#c8102e", dot: "#c8102e" },
  EN_PROCESO: { label: "En proceso",  bg: "#fffbf0", color: "#92600a", dot: "#f0a500" },
  RESUELTO:   { label: "Resuelto",    bg: "#f0faf5", color: "#1a6b3c", dot: "#2e7d52" },
} as const;

const tipoCfg: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  "Bache o daño en calle": {
    color: "#92600a", bg: "#fffbf0",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>,
  },
  "Alumbrado público apagado": {
    color: "#92600a", bg: "#fffbf0",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  },
  "Problema con el agua": {
    color: "#004e9e", bg: "#f0f5ff",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/></svg>,
  },
  "Cañada o drenaje tapado": {
    color: "#1a6b3c", bg: "#f0faf5",
    icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"/></svg>,
  },
};
const defaultTipo = {
  color: "#5a6678", bg: "#f8f9fc",
  icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
};

export default async function Gestiones() {
  const reportes = await prisma.reporte.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
    select: {
      id: true,
      tipo: true,
      ubicacion: true,
      descripcion: true,
      estado: true,
      createdAt: true,
    },
  });

  if (reportes.length === 0) return null;

  const pendientes  = reportes.filter((r) => r.estado === "PENDIENTE").length;
  const enProceso   = reportes.filter((r) => r.estado === "EN_PROCESO").length;
  const resueltos   = reportes.filter((r) => r.estado === "RESUELTO").length;

  return (
    <section className="py-20 px-6" style={{ background: "#f5f7fa" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#003876" }}>
              Transparencia
            </p>
            <h2 className="text-3xl font-black mb-2" style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}>
              Reportes del barrio
            </h2>
            <p className="text-sm max-w-xl" style={{ color: "#5a6678" }}>
              Problemas reportados por residentes. La directiva los gestiona con las instituciones correspondientes.
            </p>
          </div>

          {/* Status summary */}
          <div className="flex gap-3 flex-wrap">
            {[
              { titulo: "Pendientes",  value: pendientes,  ...estadoCfg.PENDIENTE  },
              { titulo: "En proceso",  value: enProceso,   ...estadoCfg.EN_PROCESO },
              { titulo: "Resueltos",   value: resueltos,   ...estadoCfg.RESUELTO   },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: s.bg, color: s.color, border: `1px solid ${s.bg}` }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: s.dot }} />
                {s.value} {s.titulo}
              </div>
            ))}
          </div>
        </div>

        {/* Reports grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportes.map((r) => {
            const tipo = tipoCfg[r.tipo] ?? defaultTipo;
            const est  = estadoCfg[r.estado as keyof typeof estadoCfg] ?? estadoCfg.PENDIENTE;
            return (
              <div
                key={r.id}
                className="bg-white rounded-2xl p-5"
                style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: tipo.bg, color: tipo.color }}
                  >
                    {tipo.icon}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: est.bg, color: est.color }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: est.dot }} />
                    {est.label}
                  </div>
                </div>

                {/* Type */}
                <div className="text-sm font-semibold mb-1" style={{ color: "#0e1b2e" }}>{r.tipo}</div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: "#8a95a3" }}>
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span className="truncate">{r.ubicacion}</span>
                </div>

                {r.descripcion && (
                  <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "#5a6678" }}>
                    {r.descripcion}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#b0bac5" }}>
                    {new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short", year: "numeric" }).format(r.createdAt)}
                  </span>
                  <span className="text-xs font-mono" style={{ color: "#d1d9e6" }}>#{r.id}</span>
                </div>
              </div>
            );
          })}
        </div>

        {reportes.length === 12 && (
          <p className="text-center text-xs mt-6" style={{ color: "#b0bac5" }}>
            Mostrando los 12 reportes más recientes
          </p>
        )}
      </div>
    </section>
  );
}
