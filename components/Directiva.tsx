import { prisma } from "@/lib/prisma";

const COLORS: Record<string, { avatar: string; accent: string }> = {
  azul:  { avatar: "#1b5e20", accent: "#1b5e20" },
  rojo:  { avatar: "#c8102e", accent: "#c8102e" },
  cielo: { avatar: "#0077b6", accent: "#43a047" },
};

export default async function Directiva() {
  const miembros = await prisma.directivaMiembro.findMany({
    orderBy: { orden: "asc" },
  });

  return (
    <section id="directiva" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1565c0" }}>
              Período 2026–2028
            </p>
            <h2
              className="text-3xl font-black"
              style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}
            >
              Directiva del barrio
            </h2>
            <p className="text-sm mt-2 max-w-md" style={{ color: "#5a6678" }}>
              Representantes elegidos por los vecinos del Sector San Antonio para gestionar
              los intereses comunitarios.
            </p>
          </div>
          <div
            className="text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0"
            style={{ background: "#e3f2fd", color: "#1565c0", border: "1px solid #90caf9" }}
          >
            {miembros.length} miembros activos
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {miembros.map((m, i) => {
            const col = COLORS[m.color] ?? COLORS.cielo;
            const isPresidente = m.cargo.toLowerCase().startsWith("presi");
            return (
              <div
                key={m.id}
                className="group relative rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg"
                style={{
                  background: isPresidente ? "#f5f8ff" : "#fafbfc",
                  border: `1px solid ${isPresidente ? "#a5d6a5" : "#edf0f5"}`,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                {/* Position badge for president */}
                {isPresidente && (
                  <div
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs font-bold px-2.5 py-0.5 rounded-full text-white whitespace-nowrap"
                    style={{ background: "#1b5e20", fontSize: "9px", letterSpacing: "0.06em" }}
                  >
                    PRESIDENTE
                  </div>
                )}

                {/* Avatar — foto real o iniciales */}
                {m.fotoUrl ? (
                  <img
                    src={m.fotoUrl}
                    alt={m.nombre}
                    className="w-14 h-14 rounded-full object-cover mx-auto mb-3 transition-transform group-hover:scale-105"
                    style={{ boxShadow: `0 4px 12px ${col.avatar}33` }}
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-black text-white mx-auto mb-3 text-lg transition-transform group-hover:scale-105"
                    style={{
                      background: col.avatar,
                      boxShadow: `0 4px 12px ${col.avatar}33`,
                    }}
                  >
                    {m.iniciales}
                  </div>
                )}

                {/* Cargo */}
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: "#8a95a3" }}
                >
                  {m.cargo}
                </div>

                {/* Nombre */}
                <div
                  className="text-sm font-bold leading-tight mb-3"
                  style={{ color: "#0e1b2e", letterSpacing: "-0.01em" }}
                >
                  {m.nombre}
                </div>

                {/* Phone */}
                <a
                  href={`tel:${m.telefono.replace(/\D/g, "")}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    color: col.accent,
                    background: `${col.avatar}10`,
                  }}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {m.telefono}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
