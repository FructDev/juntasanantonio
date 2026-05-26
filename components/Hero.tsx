export default function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #001f4d 0%, #003876 60%, #004e9e 100%)",
        paddingTop: "72px",
        paddingBottom: 0,
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_380px] gap-16 items-end">
          {/* Left column */}
          <div className="pb-14">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
              <span>República Dominicana</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
              <span>San Cristóbal</span>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>Barrio San Antonio</span>
            </div>

            {/* Title */}
            <h1
              className="font-black text-white leading-none mb-5"
              style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)", letterSpacing: "-0.04em" }}
            >
              Junta de Vecinos
              <br />
              <span style={{ color: "#7fb3ff" }}>Barrio San Antonio</span>
            </h1>

            <p
              className="text-base leading-relaxed mb-8 max-w-lg"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Portal comunitario oficial del Barrio San Antonio, sector Lava Pie,
              municipio San Cristóbal. Reporta problemas, consulta documentos y mantente
              al día con los avisos de la directiva.
            </p>

            {/* Tags row */}
            <div className="flex flex-wrap gap-2 mb-10">
              {[
                { dot: "#5db8ff", label: "Sector Lava Pie" },
                { dot: "#5db8ff", label: "San Cristóbal" },
                { dot: "#ffd066", label: "Gestión 2023–2025" },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tag.dot }} />
                  {tag.label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-12">
              <a
                href="#reportar"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg"
                style={{
                  background: "#c8102e",
                  boxShadow: "0 4px 14px rgba(200,16,46,0.4)",
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Reportar problema
              </a>
              <a
                href="#avisos"
                className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-xl transition-colors"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Ver avisos
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-10 pb-2">
              {[
                { n: "180+", l: "Familias" },
                { n: "38", l: "Años activos" },
                { n: "12", l: "Proyectos 2025" },
              ].map(({ n, l }) => (
                <div key={l}>
                  <div className="text-3xl font-black text-white leading-none" style={{ letterSpacing: "-0.04em" }}>
                    {n}
                  </div>
                  <div className="text-xs mt-1 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map column — OpenStreetMap showing Barrio San Antonio */}
          <div className="hidden lg:block pb-0">
            <div
              className="overflow-hidden"
              style={{
                borderRadius: "16px 16px 0 0",
                border: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "none",
                height: 300,
              }}
            >
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=-70.122%2C18.395%2C-70.097%2C18.416&layer=mapnik&marker=18.4055%2C-70.1095"
                loading="lazy"
                title="Mapa Barrio San Antonio — San Cristóbal, RD"
                className="w-full h-full border-0"
                style={{ filter: "saturate(0.6) brightness(0.9)" }}
              />
            </div>
            <div
              className="py-3 px-5 flex items-center justify-between text-xs"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderTop: "none",
                borderRadius: "0 0 12px 12px",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#4ade80" }} />
                Barrio San Antonio · Sector Lava Pie
              </div>
              <a
                href="https://www.openstreetmap.org/?mlat=18.4055&mlon=-70.1095#map=16/18.4055/-70.1095"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Ver mapa completo →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
