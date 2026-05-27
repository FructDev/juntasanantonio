"use client";
import Escudo from "@/components/Escudo";

const links = [
  { href: "#directiva", label: "Directiva" },
  { href: "#avisos", label: "Tablón de avisos" },
  { href: "#reportar", label: "Reportar problema" },
  { href: "#documentos", label: "Documentos" },
  { href: "#transparencia", label: "Transparencia financiera" },
  { href: "#contacto", label: "Contacto y emergencias" },
];

export default function Footer() {
  return (
    <footer>
      <div
        className="px-6 pt-14 pb-10"
        style={{
          background: "linear-gradient(180deg, #001433 0%, #001f4d 100%)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-[2fr_1fr_1fr] gap-10">
          {/* Brand block */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Escudo size={40} />
              <div>
                <div className="text-white font-bold text-sm leading-none">Junta de Vecinos</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Sector San Antonio · San Gregorio de Nigua</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              Organización comunitaria sin fines de lucro que representa a los residentes del
              Sector San Antonio, San Gregorio de Nigua, Provincia San Cristóbal, República Dominicana.
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.25)" }}>
              Norte: Calle Osvaldo Bazil · Sur: Carretera Palenque
              <br />
              Este: Río Yubazo · Oeste: Calle Bernardo Alíes
            </p>
          </div>

          {/* Quick links */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Accesos rápidos
            </div>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-xs transition-colors hover:opacity-100"
                    style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none", opacity: 1 }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Contacto
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: "rgba(255,255,255,0.3)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:8091234567" className="text-xs" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                  (809) 123-4567
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: "rgba(255,255,255,0.3)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:juntasanantonio@gmail.com" className="text-xs" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>
                  juntasanantonio@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: "rgba(255,255,255,0.3)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Lun–Sáb · 8:00am–6:00pm
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-6 py-4"
        style={{ background: "#000e26", borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
            © 2026 Junta de Vecinos Sector San Antonio · San Gregorio de Nigua, República Dominicana
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Sitio desarrollado para la comunidad
          </p>
        </div>
      </div>
    </footer>
  );
}
