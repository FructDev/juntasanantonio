import { prisma } from "@/lib/prisma";
import {
  crearFinanza, actualizarFinanza, eliminarFinanza,
  agregarGastoItem, eliminarGastoItem,
} from "@/app/actions";

const MESES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: "#374151" }}>{label}</label>
      {help && <p className="text-xs mb-1.5" style={{ color: "#8a95a3" }}>{help}</p>}
      {children}
    </div>
  );
}

const inp = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100";
const inpStyle = { border: "1.5px solid #e2e8f0", color: "#0e1b2e" };

export default async function AdminFinanzas() {
  const finanzas = await prisma.finanzaResumen.findMany({
    orderBy: [{ anio: "desc" }, { mes: "asc" }],
    include: { gastoItems: { orderBy: { monto: "desc" } } },
  });

  const anioActual = new Date().getFullYear();
  const mesActual  = MESES[new Date().getMonth()];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
          Finanzas
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
          Registro mensual de ingresos, gastos y transparencia financiera.
        </p>
      </div>

      {/* Guía para el tesorero */}
      <div
        className="rounded-2xl p-5 mb-8"
        style={{ background: "#f0faf5", border: "1px solid #b7e4cc" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-bold" style={{ color: "#1a6b3c" }}>Guía para el tesorero</span>
        </div>
        <ol className="text-xs space-y-1.5 list-decimal list-inside" style={{ color: "#2d6a4f" }}>
          <li>Al <strong>cierre de cada mes</strong>, haz clic en <em>"Agregar período"</em> y llena el resumen del mes.</li>
          <li>Después de crear el período, <strong>agrega los gastos</strong> uno por uno (ej: "Pintura calle 5 — RD$3,000").</li>
          <li>Esto aparece en la sección de <strong>Transparencia Financiera</strong> del sitio público.</li>
        </ol>
      </div>

      {/* New period form */}
      <div
        className="bg-white rounded-2xl overflow-hidden mb-8"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "#1b5e20" }}>
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Agregar período mensual</div>
        </div>
        <form action={crearFinanza} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Field label="Mes *">
              <select name="mes" required className={inp} style={inpStyle}>
                {MESES.map((m) => (
                  <option key={m} value={m} selected={m === mesActual}>{m}</option>
                ))}
              </select>
            </Field>
            <Field label="Año *">
              <input name="anio" type="number" required defaultValue={anioActual}
                className={inp} style={inpStyle} />
            </Field>
            <Field
              label="Saldo en caja (RD$) *"
              help="Dinero disponible al cerrar el mes"
            >
              <input name="saldo" type="number" required placeholder="42 800"
                className={inp} style={inpStyle} />
            </Field>
            <Field
              label="Ingresos del mes (RD$) *"
              help="Cuotas + donaciones + otros"
            >
              <input name="ingresos" type="number" required placeholder="18 500"
                className={inp} style={inpStyle} />
            </Field>
            <Field
              label="Total de gastos (RD$) *"
              help="Todo lo que se gastó ese mes"
            >
              <input name="gastos" type="number" required placeholder="12 300"
                className={inp} style={inpStyle} />
            </Field>
            <Field
              label="Familias en el barrio"
              help="Número total de familias"
            >
              <input name="familiasTotales" type="number" defaultValue={0}
                className={inp} style={inpStyle} />
            </Field>
            <Field
              label="Familias al día con cuota"
              help="Cuántas pagaron ese mes"
            >
              <input name="familiasPagadas" type="number" defaultValue={0}
                className={inp} style={inpStyle} />
            </Field>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-md transition-all hover:-translate-y-px"
              style={{ background: "#1b5e20", boxShadow: "0 2px 8px rgba(27,94,32,0.25)" }}
            >
              Crear período
            </button>
          </div>
        </form>
      </div>

      {/* Existing periods */}
      <div className="space-y-6">
        {finanzas.length === 0 && (
          <div className="bg-white rounded-2xl py-14 text-center" style={{ border: "1px solid #edf0f5" }}>
            <div className="text-sm font-medium mb-1" style={{ color: "#8a95a3" }}>No hay períodos registrados</div>
            <div className="text-xs" style={{ color: "#b0bac5" }}>Usa el formulario de arriba para agregar el primer mes</div>
          </div>
        )}
        {finanzas.map((f) => (
          <div
            key={f.id}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            {/* Period header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
            >
              <div className="flex items-center gap-3">
                <div className="font-bold text-sm" style={{ color: "#0e1b2e" }}>
                  {f.mes} {f.anio}
                </div>
                <div className="flex items-center gap-3 text-xs" style={{ color: "#5a6678" }}>
                  <span>Saldo: <strong style={{ color: "#1a6b3c" }}>RD$ {f.saldo.toLocaleString("es-DO")}</strong></span>
                  <span>·</span>
                  <span>Ingresos: RD$ {f.ingresos.toLocaleString("es-DO")}</span>
                  <span>·</span>
                  <span>Gastos: RD$ {f.gastos.toLocaleString("es-DO")}</span>
                </div>
              </div>
              <form
                action={async () => {
                  "use server";
                  await eliminarFinanza(f.id);
                }}
              >
                <button
                  type="submit"
                  className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors hover:bg-red-50"
                  style={{ color: "#c8102e" }}
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </form>
            </div>

            <div className="p-6">
              {/* Edit figures */}
              <form action={actualizarFinanza} className="mb-6">
                <input type="hidden" name="id" value={f.id} />
                <input type="hidden" name="mes" value={f.mes} />
                <input type="hidden" name="anio" value={f.anio} />
                <p className="text-xs font-semibold mb-3 uppercase tracking-widest" style={{ color: "#8a95a3" }}>
                  Corregir cifras del período
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <Field label="Saldo en caja">
                    <input name="saldo" type="number" defaultValue={f.saldo}
                      className={inp} style={inpStyle} />
                  </Field>
                  <Field label="Ingresos">
                    <input name="ingresos" type="number" defaultValue={f.ingresos}
                      className={inp} style={inpStyle} />
                  </Field>
                  <Field label="Total gastos">
                    <input name="gastos" type="number" defaultValue={f.gastos}
                      className={inp} style={inpStyle} />
                  </Field>
                  <Field label="Familias en el barrio">
                    <input name="familiasTotales" type="number" defaultValue={f.familiasTotales}
                      className={inp} style={inpStyle} />
                  </Field>
                  <Field label="Familias al día">
                    <input name="familiasPagadas" type="number" defaultValue={f.familiasPagadas}
                      className={inp} style={inpStyle} />
                  </Field>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                    style={{ background: "#f1f8f1", color: "#1b5e20" }}
                  >
                    Guardar cifras
                  </button>
                </div>
              </form>

              {/* Gasto items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold" style={{ color: "#374151" }}>
                    Desglose de gastos
                  </div>
                  <div className="text-xs" style={{ color: "#8a95a3" }}>
                    {f.gastoItems.length === 0
                      ? "Sin desglose aún"
                      : `${f.gastoItems.length} concepto${f.gastoItems.length > 1 ? "s" : ""} · RD$ ${f.gastoItems.reduce((s, g) => s + g.monto, 0).toLocaleString("es-DO")}`
                    }
                  </div>
                </div>

                {f.gastoItems.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {f.gastoItems.map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: "#fafbfc", border: "1px solid #f0f4f8" }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: "#0e1b2e" }}>{g.nombre}</div>
                        </div>
                        <span className="text-sm font-semibold flex-shrink-0" style={{ color: "#1b5e20" }}>
                          RD$ {g.monto.toLocaleString("es-DO")}
                        </span>
                        <span className="text-xs flex-shrink-0 px-1.5 py-0.5 rounded-full" style={{ background: "#f1f8f1", color: "#1b5e20" }}>
                          {g.porcentaje}%
                        </span>
                        <form
                          action={async () => {
                            "use server";
                            await eliminarGastoItem(g.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 flex-shrink-0"
                            style={{ color: "#c8102e" }}
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add gasto item */}
                <form action={agregarGastoItem}>
                  <input type="hidden" name="finanzaId" value={f.id} />
                  <p className="text-xs mb-2" style={{ color: "#8a95a3" }}>
                    Agrega cada concepto de gasto. El porcentaje se calcula automáticamente.
                  </p>
                  <div className="flex gap-3 items-end flex-wrap sm:flex-nowrap">
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
                        Concepto <span style={{ color: "#c8102e" }}>*</span>
                      </label>
                      <input
                        name="nombre"
                        required
                        placeholder="Ej: Reparación de luminaria"
                        className={inp}
                        style={inpStyle}
                      />
                    </div>
                    <div className="w-36 flex-shrink-0">
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
                        Monto (RD$) <span style={{ color: "#c8102e" }}>*</span>
                      </label>
                      <input
                        name="monto"
                        type="number"
                        required
                        placeholder="4 500"
                        className={inp}
                        style={inpStyle}
                      />
                    </div>
                    <button
                      type="submit"
                      className="flex-shrink-0 text-xs font-semibold px-4 py-2.5 rounded-xl text-white whitespace-nowrap"
                      style={{ background: "#1a6b3c" }}
                    >
                      + Agregar gasto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
