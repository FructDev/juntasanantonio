import { prisma } from "@/lib/prisma";
import { crearVecino, toggleCuota, eliminarVecino } from "@/app/actions";

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default async function AdminVecinos() {
  const anio = new Date().getFullYear();
  const mesActual = MESES[new Date().getMonth()];

  const vecinos = await prisma.vecino.findMany({
    where: { activo: true },
    orderBy: { nombre: "asc" },
    include: {
      cuotas: {
        where: { anio },
        orderBy: { mes: "asc" },
      },
    },
  });

  const totalPagados = vecinos.filter((v) =>
    v.cuotas.some((c) => c.mes === mesActual && c.pagado)
  ).length;

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
            Vecinos y cuotas
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
            Padrón de residentes y seguimiento de cuotas mensuales — {anio}
          </p>
        </div>
        <div
          className="text-sm font-semibold px-4 py-2 rounded-xl"
          style={{ background: "#f0faf5", color: "#1a6b3c", border: "1px solid #bbf0d4" }}
        >
          {totalPagados} / {vecinos.length} al día en {mesActual}
        </div>
      </div>

      {/* Register form */}
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
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Registrar vecino</div>
        </div>
        <form action={crearVecino} className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Nombre completo <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <input
                name="nombre"
                required
                placeholder="Juan Pérez"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Cédula</label>
              <input
                name="cedula"
                placeholder="000-0000000-0"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Teléfono</label>
              <input
                name="telefono"
                placeholder="(809) 000-0000"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Calle / Sector <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <input
                name="calle"
                required
                placeholder="Calle 3, Sector Lava Pie"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Número</label>
              <input
                name="numero"
                placeholder="#12"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-md transition-all hover:-translate-y-px"
              style={{ background: "#003876", boxShadow: "0 2px 8px rgba(0,56,118,0.25)" }}
            >
              Registrar vecino
            </button>
          </div>
        </form>
      </div>

      {/* Vecinos table */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>
            Padrón de vecinos
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "#f0f5ff", color: "#003876" }}>
            {vecinos.length} registrados
          </span>
        </div>

        {/* Month header row */}
        {vecinos.length > 0 && (
          <div
            className="px-6 py-2.5 grid text-xs font-semibold"
            style={{
              gridTemplateColumns: "1fr repeat(6, 60px) 40px",
              borderBottom: "1px solid #f0f4f8",
              background: "#fafbfc",
              color: "#8a95a3",
            }}
          >
            <span>Vecino</span>
            {MESES.slice(0, 6).map((m) => (
              <span key={m} className="text-center">{m.slice(0, 3)}</span>
            ))}
            <span />
          </div>
        )}

        {vecinos.map((v, i) => {
          const pagadosMes = (mes: string) => v.cuotas.some((c) => c.mes === mes && c.pagado);
          return (
            <div
              key={v.id}
              className="px-6 py-3 grid items-center gap-1"
              style={{
                gridTemplateColumns: "1fr repeat(6, 60px) 40px",
                borderBottom: i < vecinos.length - 1 ? "1px solid #f8f9fc" : undefined,
              }}
            >
              {/* Name */}
              <div>
                <div className="text-sm font-medium" style={{ color: "#0e1b2e" }}>{v.nombre}</div>
                <div className="text-xs" style={{ color: "#8a95a3" }}>
                  {v.calle}{v.numero ? ` #${v.numero}` : ""}
                </div>
              </div>

              {/* First 6 months cuotas */}
              {MESES.slice(0, 6).map((mes) => {
                const paid = pagadosMes(mes);
                return (
                  <form
                    key={mes}
                    action={async () => {
                      "use server";
                      await toggleCuota(v.id, mes, anio);
                    }}
                    className="flex justify-center"
                  >
                    <button
                      type="submit"
                      title={paid ? `${mes}: Pagado — clic para marcar como no pagado` : `${mes}: No pagado — clic para marcar como pagado`}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{
                        background: paid ? "#f0faf5" : "#f8f9fc",
                        border: `1.5px solid ${paid ? "#bbf0d4" : "#e2e8f0"}`,
                      }}
                    >
                      {paid ? (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#d1d9e6" }} />
                      )}
                    </button>
                  </form>
                );
              })}

              {/* Delete */}
              <form
                action={async () => {
                  "use server";
                  await eliminarVecino(v.id);
                }}
                className="flex justify-center"
              >
                <button
                  type="submit"
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                  style={{ color: "#c8102e" }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </form>
            </div>
          );
        })}

        {vecinos.length === 0 && (
          <div className="py-14 text-center">
            <div className="text-sm font-medium mb-1" style={{ color: "#8a95a3" }}>No hay vecinos registrados</div>
            <div className="text-xs" style={{ color: "#b0bac5" }}>Usa el formulario de arriba para agregar el primero</div>
          </div>
        )}
      </div>
    </div>
  );
}
