"use client";

import { useState } from "react";

type Doc = {
  id: number;
  nombre: string;
  categoria: string;
  nombreArchivo: string;
  tamano: string;
  fecha: Date;
};

const catConfig: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
  ACTA: {
    bg: "#f0faf5",
    color: "#1a6b3c",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  CARTA: {
    bg: "#f0f5ff",
    color: "#003876",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  FINANZA: {
    bg: "#fffbf0",
    color: "#92600a",
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
};

const catLabel: Record<string, string> = {
  ACTA: "Acta",
  CARTA: "Carta",
  FINANZA: "Finanzas",
};

const filtros = [
  { key: "todos",   label: "Todos" },
  { key: "ACTA",    label: "Actas" },
  { key: "CARTA",   label: "Cartas" },
  { key: "FINANZA", label: "Estado de caja" },
];

function formatFecha(d: Date, short = false) {
  if (short) {
    return new Intl.DateTimeFormat("es-DO", { month: "short", year: "numeric" }).format(d);
  }
  return new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "short", year: "numeric" }).format(d);
}

const DownloadIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export default function DocumentosFiltro({ docs }: { docs: Doc[] }) {
  const [cat, setCat] = useState("todos");

  const visible = cat === "todos" ? docs : docs.filter((d) => d.categoria === cat);

  return (
    <>
      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap items-center mb-7">
        {filtros.map((f) => (
          <button
            key={f.key}
            onClick={() => setCat(f.key)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={
              cat === f.key
                ? { background: "#003876", color: "#fff", borderColor: "#003876", boxShadow: "0 2px 8px rgba(0,56,118,0.25)" }
                : { background: "#fff", color: "#5a6678", borderColor: "#e2e8f0" }
            }
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs" style={{ color: "#8a95a3" }}>
          {visible.length} {visible.length === 1 ? "documento" : "documentos"}
        </span>
      </div>

      {/* Document list */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        {visible.map((doc, i) => {
          const cfg = catConfig[doc.categoria] ?? catConfig.ACTA;
          const hasFile = !!doc.nombreArchivo;

          return (
            <div
              key={doc.id}
              className="bg-white transition-colors hover:bg-slate-50"
              style={{ borderBottom: i < visible.length - 1 ? "1px solid #f0f4f8" : undefined }}
            >
              {/* Desktop layout (sm+): single row */}
              <div className="hidden sm:flex items-center gap-4 px-5 py-4">
                {/* Icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold leading-tight truncate" style={{ color: "#0e1b2e" }}>
                    {doc.nombre}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="text-xs font-medium px-1.5 py-0.5 rounded"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {catLabel[doc.categoria] ?? doc.categoria}
                    </span>
                    <span className="text-xs" style={{ color: "#8a95a3" }}>
                      {formatFecha(doc.fecha)}{doc.tamano ? ` · ${doc.tamano}` : ""}
                    </span>
                  </div>
                </div>

                {/* Download */}
                {hasFile ? (
                  <a
                    href={`/api/documentos/${doc.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all hover:-translate-y-px flex-shrink-0"
                    style={{ color: "#003876", background: "#f0f5ff", border: "1px solid #c7d9f5" }}
                  >
                    <DownloadIcon />
                    Descargar
                  </a>
                ) : (
                  <span
                    className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg flex-shrink-0 cursor-default select-none"
                    style={{ color: "#b0bac5", background: "#f5f7fa", border: "1px solid #edf0f5" }}
                  >
                    <LockIcon />
                    No disponible
                  </span>
                )}
              </div>

              {/* Mobile layout: stacked */}
              <div className="sm:hidden px-4 py-3.5">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: cfg.bg, color: cfg.color }}
                  >
                    {cfg.icon}
                  </div>

                  {/* Name + meta + button */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold leading-snug mb-1" style={{ color: "#0e1b2e" }}>
                      {doc.nombre}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className="text-xs font-medium px-1.5 py-0.5 rounded flex-shrink-0"
                          style={{ background: cfg.bg, color: cfg.color }}
                        >
                          {catLabel[doc.categoria] ?? doc.categoria}
                        </span>
                        <span className="text-xs truncate" style={{ color: "#8a95a3" }}>
                          {formatFecha(doc.fecha, true)}{doc.tamano ? ` · ${doc.tamano}` : ""}
                        </span>
                      </div>

                      {hasFile ? (
                        <a
                          href={`/api/documentos/${doc.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all flex-shrink-0"
                          style={{ color: "#003876", background: "#f0f5ff", border: "1px solid #c7d9f5" }}
                        >
                          <DownloadIcon />
                          <span>Ver</span>
                        </a>
                      ) : (
                        <span
                          className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg flex-shrink-0 cursor-default select-none"
                          style={{ color: "#b0bac5", background: "#f5f7fa", border: "1px solid #edf0f5" }}
                        >
                          <LockIcon />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="py-14 text-center">
            <div className="text-sm font-medium mb-1" style={{ color: "#8a95a3" }}>
              No hay documentos en esta categoría
            </div>
            <div className="text-xs" style={{ color: "#b0bac5" }}>
              Intenta con otro filtro
            </div>
          </div>
        )}
      </div>
    </>
  );
}
