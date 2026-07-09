import { prisma } from "@/lib/prisma";

function fmt(n: number) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 0,
  }).format(n);
}

export default async function Finanzas() {
  const resumen = await prisma.finanzaResumen.findFirst({
    orderBy: [{ anio: "desc" }, { createdAt: "desc" }],
    include: { gastoItems: { orderBy: { monto: "desc" } } },
  });

  if (!resumen) return null;

  const pct = Math.round((resumen.familiasPagadas / resumen.familiasTotales) * 100);
  const maxMonto = Math.max(...resumen.gastoItems.map((g) => g.monto));

  return (
    <section id="transparencia" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#1b5e20" }}>
            Actualizado mensualmente
          </p>
          <h2 className="text-3xl font-black mb-2" style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}>
            Transparencia financiera
          </h2>
          <p className="text-sm" style={{ color: "#5a6678" }}>
            El dinero del barrio es de todos. {resumen.mes} {resumen.anio}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Resumen card — dark */}
          <div
            className="rounded-2xl p-7 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d2e0d 0%, #1b5e20 100%)",
              boxShadow: "0 4px 24px rgba(27,94,32,0.25)",
            }}
          >
            {/* Background circles */}
            <div
              className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
            <div
              className="absolute top-10 -right-8 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: "rgba(255,255,255,0.03)" }}
            />

            <div className="relative">
              <div className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.4)" }}>
                Resumen — {resumen.mes} {resumen.anio}
              </div>

              {/* Saldo destacado */}
              <div className="mb-6">
                <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>Saldo en caja</div>
                <div
                  className="text-4xl font-black text-white"
                  style={{ letterSpacing: "-0.04em" }}
                >
                  {fmt(resumen.saldo)}
                </div>
                <div className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Al 1 de {resumen.mes}
                </div>
              </div>

              {/* Ingresos / Gastos */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { lbl: "Ingresos", val: resumen.ingresos, sub: "Cuotas + donaciones", positive: true },
                  { lbl: "Gastos", val: resumen.gastos, sub: "Operaciones y obras", positive: false },
                ].map((m) => (
                  <div
                    key={m.lbl}
                    className="rounded-xl px-4 py-3"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>{m.lbl}</div>
                    <div className="font-bold text-white text-sm">{fmt(m.val)}</div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              {/* Vecinos al día */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>Vecinos al día</span>
                  <span className="font-semibold text-white">{resumen.familiasPagadas} / {resumen.familiasTotales} ({pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: "#4ade80" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Desglose de gastos */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
            >
              <div>
                <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>
                  Desglose de gastos
                </div>
                <div className="text-xs" style={{ color: "#8a95a3" }}>
                  {resumen.mes} {resumen.anio}
                </div>
              </div>
              <div className="text-sm font-black" style={{ color: "#1b5e20" }}>
                {fmt(resumen.gastos)}
              </div>
            </div>

            <div className="p-6 space-y-5">
              {resumen.gastoItems.map((g) => {
                const barPct = Math.round((g.monto / maxMonto) * 100);
                return (
                  <div key={g.id}>
                    <div className="flex justify-between items-baseline mb-2">
                      <span className="text-sm font-medium" style={{ color: "#2d3748" }}>
                        {g.nombre}
                      </span>
                      <span className="text-sm font-bold" style={{ color: "#1b5e20" }}>
                        {fmt(g.monto)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "#edf0f5" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${barPct}%`, background: "#1b5e20" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className="px-6 py-4 text-xs"
              style={{ borderTop: "1px solid #f0f4f8", color: "#8a95a3", background: "#fafbfc" }}
            >
              Estado de caja completo disponible en la sección de{" "}
              <a href="#documentos" className="font-semibold" style={{ color: "#1b5e20" }}>
                Documentos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
