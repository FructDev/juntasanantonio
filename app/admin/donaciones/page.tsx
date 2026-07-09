import { prisma } from "@/lib/prisma";
import { guardarDonacionConfig } from "@/app/actions";

export default async function AdminDonaciones() {
  const cfg = await prisma.donacionConfig.findFirst();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
          Donaciones
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
          Configura cómo los vecinos pueden apoyar al barrio con dinero o artículos.
          La sección solo aparece en el sitio público cuando hay información publicada.
        </p>
      </div>

      <form action={guardarDonacionConfig}>
        <div className="space-y-6">

          {/* ── Donación monetaria ── */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div className="px-6 py-4 flex items-center gap-3"
              style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#1b5e20" }}>
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Donación monetaria</div>
            </div>

            <div className="p-6 space-y-5">
              {/* Toggle cuenta disponible */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="tieneCuenta"
                    defaultChecked={cfg?.tieneCuenta ?? false}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 rounded-full peer-checked:bg-blue-600 transition-colors"
                    style={{ background: cfg?.tieneCuenta ? "#1b5e20" : "#e2e8f0" }}>
                  </div>
                  <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold" style={{ color: "#0e1b2e" }}>
                    Cuenta bancaria disponible
                  </span>
                  <p className="text-xs" style={{ color: "#8a95a3" }}>
                    Activa cuando tengan la cuenta abierta. Si está desactivado, el sitio muestra "Próximamente".
                  </p>
                </div>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "banco",           label: "Banco",          placeholder: "BanReservas, Popular, BHD León…", value: cfg?.banco },
                  { name: "tipoCuenta",      label: "Tipo de cuenta", placeholder: "Ahorro / Corriente",              value: cfg?.tipoCuenta },
                  { name: "numeroCuenta",    label: "Número de cuenta", placeholder: "000-000000-0",                  value: cfg?.numeroCuenta },
                  { name: "titular",         label: "Titular",        placeholder: "Junta de Vecinos Sector San Antonio", value: cfg?.titular },
                  { name: "whatsappConfirm", label: "WhatsApp para confirmar transferencias",
                    placeholder: "8091234567", value: cfg?.whatsappConfirm },
                ].map((f) => (
                  <div key={f.name} className={f.name === "whatsappConfirm" ? "md:col-span-2" : ""}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                      {f.label}
                    </label>
                    <input
                      name={f.name}
                      defaultValue={f.value ?? ""}
                      placeholder={f.placeholder}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                      style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Donación en especie ── */}
          <div className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div className="px-6 py-4 flex items-center gap-3"
              style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "#1a6b3c" }}>
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Donación en especie</div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                  Artículos que se necesitan
                </label>
                <input
                  name="itemsNecesarios"
                  defaultValue={cfg?.itemsNecesarios ?? ""}
                  placeholder="Escobas, bolsas de basura, pintura, cloro, lámparas…"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
                />
                <p className="text-xs mt-1.5" style={{ color: "#b0bac5" }}>
                  Separa los artículos con coma. Ej: Escobas, pintura, lámparas
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                    Lugar de entrega
                  </label>
                  <input
                    name="lugarEntrega"
                    defaultValue={cfg?.lugarEntrega ?? ""}
                    placeholder="Casa comunal, calle Las Flores #12"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                    Horario de entrega
                  </label>
                  <input
                    name="horarioEntrega"
                    defaultValue={cfg?.horarioEntrega ?? ""}
                    placeholder="Lunes a viernes, 4pm – 7pm"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                    style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                  WhatsApp para coordinar entrega
                </label>
                <input
                  name="contactoEspecie"
                  defaultValue={cfg?.contactoEspecie ?? ""}
                  placeholder="8091234567"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                  style={{ border: "1.5px solid #e2e8f0", color: "#0e1b2e" }}
                />
              </div>
            </div>
          </div>

          {/* Guardar */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:shadow-md transition-all hover:-translate-y-px"
              style={{ background: "#1b5e20", boxShadow: "0 2px 8px rgba(27,94,32,0.25)" }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M5 13l4 4L19 7" />
              </svg>
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
