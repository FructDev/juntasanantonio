import { prisma } from "@/lib/prisma";
import Link from "next/link";

const estadoStyle: Record<string, { bg: string; color: string; label: string }> = {
  PENDIENTE:  { bg: "#fff0f2", color: "#c8102e", label: "Pendiente" },
  EN_PROCESO: { bg: "#fff8e8", color: "#92600a", label: "En proceso" },
  RESUELTO:   { bg: "#f0faf5", color: "#1a6b3c", label: "Resuelto" },
};

export default async function AdminDashboard() {
  const [reportesPendientes, avisosActivos, totalReportes, sugerenciasNoLeidas, obrasEnCurso, vecinosActivos] = await Promise.all([
    prisma.reporte.count({ where: { estado: "PENDIENTE" } }),
    prisma.aviso.count({ where: { activo: true } }),
    prisma.reporte.count(),
    prisma.sugerencia.count({ where: { leido: false } }),
    prisma.obra.count({ where: { estado: "EN_CURSO", activo: true } }),
    prisma.vecino.count({ where: { activo: true } }),
  ]);

  const recenteReportes = await prisma.reporte.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const metrics = [
    {
      label: "Reportes pendientes",
      value: reportesPendientes,
      href: "/admin/reportes",
      accent: "#c8102e",
      lightBg: "#fff0f2",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      label: "Sugerencias sin leer",
      value: sugerenciasNoLeidas,
      href: "/admin/sugerencias",
      accent: "#92600a",
      lightBg: "#fffbf0",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      label: "Avisos activos",
      value: avisosActivos,
      href: "/admin/avisos",
      accent: "#003876",
      lightBg: "#f0f5ff",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
    },
    {
      label: "Obras en curso",
      value: obrasEnCurso,
      href: "/admin/obras",
      accent: "#1a6b3c",
      lightBg: "#f0faf5",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: "Vecinos registrados",
      value: vecinosActivos,
      href: "/admin/vecinos",
      accent: "#5b21b6",
      lightBg: "#f5f0ff",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Total reportes",
      value: totalReportes,
      href: "/admin/reportes",
      accent: "#5a6678",
      lightBg: "#f8f9fc",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
          Resumen de actividad del barrio
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {metrics.map((m) => (
          <Link
            key={m.label}
            href={m.href}
            className="bg-white rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-md no-underline"
            style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: m.lightBg, color: m.accent }}
              >
                {m.icon}
              </div>
              <svg className="w-4 h-4 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: "#b0bac5" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-3xl font-black mb-1" style={{ color: m.accent, letterSpacing: "-0.03em" }}>
              {m.value}
            </div>
            <div className="text-xs font-medium" style={{ color: "#8a95a3" }}>{m.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent reports */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f0f4f8" }}
        >
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Últimos reportes</div>
          <Link
            href="/admin/reportes"
            className="text-xs font-medium no-underline"
            style={{ color: "#003876" }}
          >
            Ver todos →
          </Link>
        </div>

        {recenteReportes.length === 0 ? (
          <div className="py-12 text-center text-sm" style={{ color: "#8a95a3" }}>
            No hay reportes todavía.
          </div>
        ) : (
          recenteReportes.map((r, i) => {
            const st = estadoStyle[r.estado] ?? estadoStyle.PENDIENTE;
            return (
              <div
                key={r.id}
                className="px-6 py-4 flex items-center gap-4"
                style={{ borderBottom: i < recenteReportes.length - 1 ? "1px solid #f8f9fc" : undefined }}
              >
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: st.bg, color: st.color }}
                >
                  {st.label}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "#0e1b2e" }}>{r.tipo}</div>
                  <div className="text-xs truncate" style={{ color: "#8a95a3" }}>{r.ubicacion}</div>
                </div>
                <div className="text-xs flex-shrink-0" style={{ color: "#b0bac5" }}>
                  {new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short" }).format(r.createdAt)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
