const emergencias = [
  {
    nom: "Emergencias",
    tel: "911",
    sub: "Disponible 24/7",
    color: "#c8102e",
    bg: "#fff0f2",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    nom: "INAPA San Cristóbal",
    tel: "(809) 528-1234",
    sub: "Problemas de agua potable",
    color: "#004e9e",
    bg: "#f0f5ff",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    nom: "EDES-SUR",
    tel: "(809) 621-3456",
    sub: "Alumbrado y cortes de luz",
    color: "#92600a",
    bg: "#fffbf0",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    nom: "Ayuntamiento",
    tel: "(809) 528-3040",
    sub: "Obras y gestiones municipales",
    color: "#1a6b3c",
    bg: "#f0faf5",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function Contacto() {
  return (
    <section id="contacto" className="py-20 px-6" style={{ background: "#f5f7fa" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#003876" }}>
            Siempre disponibles
          </p>
          <h2 className="text-3xl font-black mb-2" style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}>
            Contacto y emergencias
          </h2>
          <p className="text-sm" style={{ color: "#5a6678" }}>
            Números importantes para los residentes del Sector San Antonio.
          </p>
        </div>

        {/* Emergency cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {emergencias.map((e) => (
            <a
              key={e.nom}
              href={`tel:${e.tel.replace(/\D/g, "")}`}
              className="group bg-white rounded-2xl p-4 sm:p-5 transition-all hover:-translate-y-1 hover:shadow-md no-underline"
              style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                style={{ background: e.bg, color: e.color }}
              >
                {e.icon}
              </div>
              {/* Accent line */}
              <div className="h-0.5 w-8 rounded-full mb-3" style={{ background: e.color }} />
              <div className="text-xs font-semibold mb-1 leading-tight" style={{ color: "#5a6678" }}>
                {e.nom}
              </div>
              <div className="text-lg font-black leading-none mb-1" style={{ color: e.color, letterSpacing: "-0.02em" }}>
                {e.tel}
              </div>
              <div className="text-xs" style={{ color: "#8a95a3" }}>{e.sub}</div>
            </a>
          ))}
        </div>

        {/* Contact directiva — dark card */}
        <div
          className="rounded-2xl p-7 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #001f4d 0%, #003876 100%)",
            boxShadow: "0 4px 24px rgba(0,56,118,0.2)",
          }}
        >
          {/* Background circles */}
          <div
            className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.03)" }}
          />
          <div
            className="absolute bottom-0 right-20 w-28 h-28 rounded-full pointer-events-none"
            style={{ background: "rgba(255,255,255,0.02)" }}
          />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                Directiva del barrio
              </div>
              <h3 className="text-xl font-black text-white mb-2" style={{ letterSpacing: "-0.02em" }}>
                Contáctenos directamente
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                Para consultas, sugerencias o gestiones. Respondemos de lunes a sábado, 8:00am–6:00pm.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <a
                href="https://wa.me/18091234567?text=Hola,%20soy%20residente%20del%20Barrio%20San%20Antonio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-px hover:shadow-lg"
                style={{ background: "#25d366", boxShadow: "0 2px 10px rgba(37,211,102,0.35)" }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a
                href="mailto:juntasanantonio@gmail.com"
                className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-px"
                style={{
                  background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Correo electrónico
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
