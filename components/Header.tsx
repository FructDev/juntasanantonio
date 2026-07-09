"use client";

import Link from "next/link";
import { useState } from "react";
import Escudo from "@/components/Escudo";

const NAV = [
  { href: "#directiva", label: "Directiva" },
  { href: "#avisos", label: "Avisos" },
  { href: "#obras", label: "Obras" },
  { href: "#documentos", label: "Documentos" },
  { href: "#transparencia", label: "Finanzas" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Dominican flag stripe */}
      <div
        style={{
          height: 3,
          background: "linear-gradient(to right, #002d62 33.33%, #ffffff 33.33%, #ffffff 66.66%, #ce1126 66.66%)",
        }}
      />
      <header
        className="sticky top-0 z-50"
        style={{
          background: "rgba(13,46,13,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-15 py-3.5">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 no-underline group">
            <div className="transition-transform group-hover:scale-105">
              <Escudo size={34} />
            </div>
            <div>
              <div className="text-white font-bold text-sm leading-none">
                Junta de Vecinos Sector San Antonio
              </div>
              <div className="text-xs leading-none mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                Unión y Esfuerzo · San Gregorio de Nigua
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-medium px-3.5 py-2 rounded-lg transition-colors"
                style={{ color: "rgba(255,255,255,0.6)" }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(255,255,255,0.95)";
                  (e.target as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                  (e.target as HTMLElement).style.background = "transparent";
                }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#reportar"
              className="ml-2 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:shadow-md hover:-translate-y-px"
              style={{ background: "#c8102e", boxShadow: "0 2px 8px rgba(200,16,46,0.35)" }}
            >
              Reportar problema
            </a>
            <Link
              href="/admin"
              className="ml-1 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              Admin
            </Link>
          </nav>

          {/* Mobile button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg"
            style={{ color: "rgba(255,255,255,0.7)", background: "rgba(255,255,255,0.06)" }}
            aria-label="Menú"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="md:hidden px-5 pb-5 pt-2 space-y-0.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            {NAV.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center py-2.5 text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#reportar"
              onClick={() => setOpen(false)}
              className="flex items-center py-2.5 text-sm font-semibold"
              style={{ color: "#f87171" }}
            >
              Reportar problema →
            </a>
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="flex items-center py-2.5 text-sm"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Administración →
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
