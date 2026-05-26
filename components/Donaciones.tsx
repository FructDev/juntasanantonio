import { prisma } from "@/lib/prisma";

export default async function Donaciones() {
  const cfg = await prisma.donacionConfig.findFirst();

  // Si no hay config o está todo vacío, no mostrar la sección aún
  const tieneAlgo =
    cfg && (cfg.tieneCuenta || cfg.itemsNecesarios || cfg.lugarEntrega);
  if (!tieneAlgo) return null;

  const items = cfg.itemsNecesarios
    ? cfg.itemsNecesarios.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <section className="py-20 px-6" style={{ background: "#fff" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4"
            style={{ background: "#fff0f2" }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#c8102e" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#003876" }}>
            Apoya tu barrio
          </p>
          <h2 className="text-3xl font-black mb-3" style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}>
            Donaciones
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: "#5a6678" }}>
            Cada aporte ayuda a mantener y mejorar nuestro barrio. Puedes colaborar con dinero o con artículos útiles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* ── Monetaria ── */}
          <div
            className="rounded-2xl p-7"
            style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            {/* Card header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#f0f5ff" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#003876" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: "#0e1b2e" }}>Donación monetaria</div>
                <div className="text-xs" style={{ color: "#8a95a3" }}>Transferencia bancaria</div>
              </div>
            </div>

            {cfg.tieneCuenta && cfg.numeroCuenta ? (
              <>
                <div className="space-y-3 mb-5">
                  {[
                    { label: "Banco",          value: cfg.banco },
                    { label: "Tipo de cuenta", value: cfg.tipoCuenta },
                    { label: "No. de cuenta",  value: cfg.numeroCuenta },
                    { label: "Titular",        value: cfg.titular },
                  ].filter(r => r.value).map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2"
                      style={{ borderBottom: "1px solid #f0f4f8" }}>
                      <span className="text-xs font-medium" style={{ color: "#8a95a3" }}>{row.label}</span>
                      <span className="text-sm font-semibold" style={{ color: "#0e1b2e" }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                {cfg.whatsappConfirm && (
                  <a
                    href={`https://wa.me/${cfg.whatsappConfirm.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, acabo de realizar una donación a la Junta de Vecinos Barrio San Antonio.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-px"
                    style={{ background: "#25d366", color: "#fff", boxShadow: "0 2px 8px rgba(37,211,102,0.3)" }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.571l5.87-1.541A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 01-5.031-1.375l-.36-.214-3.733.979.999-3.648-.235-.374A9.868 9.868 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                    </svg>
                    Confirmar por WhatsApp
                  </a>
                )}
              </>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-8 rounded-xl text-center"
                style={{ background: "#f8f9fc" }}
              >
                <svg className="w-8 h-8 mb-3" viewBox="0 0 24 24" fill="none" stroke="#d1d9e6" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold mb-1" style={{ color: "#8a95a3" }}>Próximamente</p>
                <p className="text-xs" style={{ color: "#b0bac5" }}>
                  Los datos bancarios estarán disponibles en breve.
                </p>
              </div>
            )}
          </div>

          {/* ── En especie ── */}
          <div
            className="rounded-2xl p-7"
            style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#f0faf5" }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: "#0e1b2e" }}>Donación en especie</div>
                <div className="text-xs" style={{ color: "#8a95a3" }}>Artículos y materiales útiles</div>
              </div>
            </div>

            {items.length > 0 && (
              <>
                <p className="text-xs font-semibold mb-3" style={{ color: "#5a6678" }}>
                  Artículos que necesitamos ahora:
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{ background: "#f0faf5", color: "#1a6b3c" }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}

            <div className="space-y-3 mb-5">
              {cfg.lugarEntrega && (
                <div className="flex gap-3 items-start">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="#8a95a3" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    <span className="text-xs font-semibold block" style={{ color: "#5a6678" }}>Lugar de entrega</span>
                    <span className="text-sm" style={{ color: "#0e1b2e" }}>{cfg.lugarEntrega}</span>
                  </div>
                </div>
              )}
              {cfg.horarioEntrega && (
                <div className="flex gap-3 items-start">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="#8a95a3" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <span className="text-xs font-semibold block" style={{ color: "#5a6678" }}>Horario</span>
                    <span className="text-sm" style={{ color: "#0e1b2e" }}>{cfg.horarioEntrega}</span>
                  </div>
                </div>
              )}
            </div>

            {cfg.contactoEspecie && (
              <a
                href={`https://wa.me/${cfg.contactoEspecie.replace(/\D/g, "")}?text=${encodeURIComponent("Hola, quiero coordinar una donación en especie para el Barrio San Antonio.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:-translate-y-px"
                style={{ background: "#25d366", color: "#fff", boxShadow: "0 2px 8px rgba(37,211,102,0.3)" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.528 5.845L.057 23.571l5.87-1.541A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.878 9.878 0 01-5.031-1.375l-.36-.214-3.733.979.999-3.648-.235-.374A9.868 9.868 0 012.106 12C2.106 6.58 6.58 2.106 12 2.106S21.894 6.58 21.894 12 17.42 21.894 12 21.894z"/>
                </svg>
                Coordinar por WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
