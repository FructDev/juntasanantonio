"use client";

import { useState, useEffect, useTransition } from "react";
import { enviarReporte } from "@/app/actions";

const CATEGORIAS = [
  "Bache o daño en calle",
  "Alumbrado público apagado",
  "Problema con el agua",
  "Cañada o drenaje tapado",
  "Basura acumulada",
  "Situación de seguridad",
  "Daño a infraestructura",
  "Otro",
];

function Field({
  label, required, hint, children,
}: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <label className="text-sm font-medium" style={{ color: "#374151" }}>
          {label}
          {required && <span className="ml-0.5" style={{ color: "#c8102e" }}>*</span>}
        </label>
        {hint && <span className="text-xs" style={{ color: "#a0aab4" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function ReportarModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [fotoName, setFotoName] = useState<string | null>(null);
  const [chars, setChars] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Open when hash becomes #reportar
  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#reportar") setOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function close() {
    setOpen(false);
    setDone(false);
    setError(null);
    // Remove hash without triggering scroll
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;
    startTransition(async () => {
      const res = await enviarReporte(fd);
      if (res.ok) {
        setDone(true);
        form.reset();
        setFotoName(null);
        setChars(0);
      } else {
        setError("No se pudo enviar el reporte. Inténtalo de nuevo.");
      }
    });
  }

  if (!open) {
    // Invisible anchor so href="#reportar" has a target
    return <span id="reportar" className="sr-only" aria-hidden />;
  }

  return (
    <>
      <span id="reportar" className="sr-only" aria-hidden />
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
        style={{ background: "rgba(5,15,35,0.78)", backdropFilter: "blur(6px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      >
        <div
          className="relative bg-white rounded-2xl w-full shadow-2xl my-auto"
          style={{ maxWidth: 540 }}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: "1px solid #f0f0f0" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#c8102e" }}
              >
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Reportar un problema</div>
                <div className="text-xs" style={{ color: "#8a95a3" }}>Junta de Vecinos · Sector San Antonio</div>
              </div>
            </div>
            <button
              onClick={close}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100"
              style={{ color: "#8a95a3" }}
              aria-label="Cerrar"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-5 py-5">
            {done ? (
              /* Success state */
              <div className="text-center py-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "#f0faf5" }}
                >
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: "#0e1b2e" }}>
                  Reporte enviado
                </h3>
                <p className="text-sm leading-relaxed mb-5 max-w-xs mx-auto" style={{ color: "#5a6678" }}>
                  La directiva ha recibido tu reporte y lo gestionará a la brevedad.
                  Los avances se publican en el tablón de avisos.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setDone(false)}
                    className="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    style={{ color: "#003876", background: "#f0f5ff" }}
                  >
                    Reportar otro
                  </button>
                  <button
                    onClick={close}
                    className="text-sm font-semibold px-4 py-2 rounded-xl text-white"
                    style={{ background: "#003876" }}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tu nombre" required>
                    <input name="nombre" type="text" required placeholder="Nombre completo" className="rfield" />
                  </Field>
                  <Field label="Teléfono" hint="opcional">
                    <input name="telefono" type="tel" placeholder="(809) 000-0000" className="rfield" />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tipo de problema" required>
                    <select name="tipo" required className="rfield rfield-select">
                      <option value="">Categoría...</option>
                      {CATEGORIAS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="¿Dónde ocurre?" required>
                    <input
                      name="ubicacion"
                      type="text"
                      required
                      placeholder="Calle 3, frente al colmado..."
                      className="rfield"
                    />
                  </Field>
                </div>

                <Field label="Descripción" required hint={`${chars}/300`}>
                  <textarea
                    name="descripcion"
                    required
                    rows={3}
                    maxLength={300}
                    placeholder="Describe el problema..."
                    className="rfield resize-none"
                    onChange={(e) => setChars(e.target.value.length)}
                  />
                </Field>

                {/* Photo upload */}
                <label
                  className="flex items-center gap-3 p-3 rounded-xl border-2 border-dashed cursor-pointer transition-all"
                  style={{
                    borderColor: fotoName ? "#003876" : "#dde3ec",
                    background: fotoName ? "#f0f5ff" : "transparent",
                  }}
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ color: fotoName ? "#003876" : "#8a95a3" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm flex-1" style={{ color: fotoName ? "#003876" : "#8a95a3" }}>
                    {fotoName ?? "Adjuntar foto (opcional)"}
                  </span>
                  {fotoName && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setFotoName(null); }}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ color: "#8a95a3", background: "#f4f6f9" }}
                    >
                      Quitar
                    </button>
                  )}
                  <input
                    name="foto" type="file" accept="image/*" className="hidden"
                    onChange={(e) => setFotoName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>

                {error && (
                  <div className="text-sm px-4 py-3 rounded-xl" style={{ background: "#fff0f2", color: "#c8102e", border: "1px solid #ffd0d8" }}>
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-1">
                  <p className="text-xs" style={{ color: "#a0aab4" }}>
                    Emergencias:{" "}
                    <a href="tel:911" className="font-semibold" style={{ color: "#c8102e" }}>911</a>
                    {" · Presidente: "}
                    <a href="tel:+18091234567" className="font-semibold" style={{ color: "#003876" }}>(809) 123-4567</a>
                  </p>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-shrink-0 flex items-center gap-2 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all disabled:opacity-60"
                    style={{
                      background: isPending ? "#5b7fa6" : "linear-gradient(135deg, #003876 0%, #004e9e 100%)",
                      boxShadow: isPending ? "none" : "0 4px 14px rgba(0,56,118,0.3)",
                    }}
                  >
                    {isPending ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Enviando...
                      </>
                    ) : "Enviar reporte"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .rfield {
          width: 100%;
          padding: 9px 13px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #0e1b2e;
          background: #fafbfc;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
          font-family: inherit;
        }
        .rfield:focus {
          border-color: #003876;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,56,118,0.08);
        }
        .rfield::placeholder { color: #b0bac5; }
        .rfield-select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a95a3' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 13px center;
          padding-right: 34px;
        }
      `}</style>
    </>
  );
}
