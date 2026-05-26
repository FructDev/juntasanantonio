const ITEMS = [
  {
    href: "#reportar",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    iconBg: "#fff0f2",
    iconColor: "#c8102e",
    lbl: "Reportar problema",
    sub: "Baches, luz, agua, cañadas",
  },
  {
    href: "#avisos",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    ),
    iconBg: "#f0f5ff",
    iconColor: "#003876",
    lbl: "Avisos del barrio",
    sub: "Cortes, asambleas, noticias",
  },
  {
    href: "#documentos",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    iconBg: "#f0faf5",
    iconColor: "#1a6b3c",
    lbl: "Documentos",
    sub: "Actas, cartas, estado de caja",
  },
  {
    href: "#contacto",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    iconBg: "#fffbf0",
    iconColor: "#92600a",
    lbl: "Emergencias",
    sub: "Policía, INAPA, EDES-SUR",
  },
];

export default function QuickAccess() {
  return (
    <div className="bg-white" style={{ borderBottom: "1px solid #edf0f5" }}>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 overflow-hidden">
        {ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 transition-colors hover:bg-slate-50 group"
            style={{
              borderRight: "1px solid #edf0f5",
              textDecoration: "none",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{ background: item.iconBg, color: item.iconColor }}
            >
              {item.icon}
            </div>
            <div>
              <div className="text-sm font-semibold leading-tight" style={{ color: "#0e1b2e" }}>
                {item.lbl}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#8a95a3" }}>
                {item.sub}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
