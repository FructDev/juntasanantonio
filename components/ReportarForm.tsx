"use client";

import { useState, useTransition } from "react";
import { enviarReporte } from "@/app/actions";

const CATEGORIAS = [
  { value: "Bache o daño en calle", label: "Bache o daño en calle" },
  { value: "Alumbrado público apagado", label: "Alumbrado público apagado" },
  { value: "Problema con el agua", label: "Problema con el agua" },
  { value: "Cañada o drenaje tapado", label: "Cañada o drenaje tapado" },
  { value: "Basura acumulada", label: "Basura acumulada" },
  { value: "Situación de seguridad", label: "Situación de seguridad" },
  { value: "Daño a infraestructura", label: "Daño a infraestructura" },
  { value: "Otro", label: "Otro" },
];

type Step = "form" | "success";

export default function ReportarForm() {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("form");
  const [fotoName, setFotoName] = useState<string | null>(null);
  const [chars, setChars] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;

    startTransition(async () => {
      const res = await enviarReporte(fd);
      if (res.ok) {
        setStep("success");
        form.reset();
        setFotoName(null);
        setChars(0);
      } else {
        setError("No se pudo enviar el reporte. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <section id="reportar" className="py-20 px-4" style={{ background: "#f8f6f1" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#c8102e" }}>
            Tu voz importa
          </p>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}>
            Reportar un problema
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "#5a6678" }}>
            Cada reporte que envías llega directamente a la directiva. Lo gestionamos con la
            institución correspondiente y publicamos la resolución en el tablón de avisos.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-start">
          {/* Form card */}
          <div>
            {step === "success" ? (
              <SuccessCard onBack={() => setStep("form")} />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div
                  className="bg-white rounded-2xl overflow-hidden"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)" }}
                >
                  {/* Form header bar */}
                  <div
                    className="px-8 py-5"
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: "#003876" }}
                      >
                        R
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "#0e1b2e" }}>
                          Formulario de reporte
                        </div>
                        <div className="text-xs" style={{ color: "#8a95a3" }}>
                          Junta de Vecinos · Barrio San Antonio
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 py-7 space-y-6">
                    {/* Nombre + teléfono */}
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field label="Tu nombre" required>
                        <input
                          name="nombre"
                          type="text"
                          required
                          placeholder="Nombre completo"
                          className="field-input"
                        />
                      </Field>
                      <Field label="Teléfono (opcional)">
                        <input
                          name="telefono"
                          type="tel"
                          placeholder="(809) 000-0000"
                          className="field-input"
                        />
                      </Field>
                    </div>

                    {/* Tipo */}
                    <Field label="¿Qué tipo de problema es?" required>
                      <select name="tipo" required className="field-input field-select">
                        <option value="">Selecciona una categoría...</option>
                        {CATEGORIAS.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </Field>

                    {/* Ubicación */}
                    <Field label="¿Dónde ocurre?" required hint="Calle, número, referencia">
                      <input
                        name="ubicacion"
                        type="text"
                        required
                        placeholder="Ej: Calle 3 frente al colmado El Nuevo"
                        className="field-input"
                      />
                    </Field>

                    {/* Descripción */}
                    <Field
                      label="Describe el problema"
                      required
                      hint={`${chars}/400 caracteres`}
                    >
                      <textarea
                        name="descripcion"
                        required
                        rows={4}
                        maxLength={400}
                        placeholder="Cuéntanos qué está pasando con el mayor detalle posible. Entre más información, más rápido podemos gestionarlo."
                        className="field-input resize-none"
                        onChange={(e) => setChars(e.target.value.length)}
                      />
                    </Field>

                    {/* Foto */}
                    <div>
                      <div className="text-sm font-medium mb-2" style={{ color: "#374151" }}>
                        Foto del problema{" "}
                        <span className="text-xs font-normal" style={{ color: "#8a95a3" }}>
                          — opcional pero ayuda mucho
                        </span>
                      </div>
                      <label
                        className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-colors"
                        style={{ borderColor: fotoName ? "#003876" : "#dde3ec", background: fotoName ? "#f0f5ff" : "transparent" }}
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
                          style={{ background: fotoName ? "#e8f0fb" : "#f4f6f9" }}
                        >
                          {fotoName ? "📎" : "📷"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium" style={{ color: fotoName ? "#003876" : "#374151" }}>
                            {fotoName ? fotoName : "Adjuntar foto"}
                          </div>
                          <div className="text-xs" style={{ color: "#8a95a3" }}>
                            {fotoName ? "Haz clic para cambiar" : "JPG o PNG · máximo 10MB"}
                          </div>
                        </div>
                        {fotoName && (
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setFotoName(null); }}
                            className="text-xs px-2 py-1 rounded flex-shrink-0"
                            style={{ color: "#8a95a3", background: "#f4f6f9" }}
                          >
                            Quitar
                          </button>
                        )}
                        <input
                          name="foto"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => setFotoName(e.target.files?.[0]?.name ?? null)}
                        />
                      </label>
                    </div>

                    {/* Error */}
                    {error && (
                      <div
                        className="text-sm px-4 py-3 rounded-lg"
                        style={{ background: "#fff0f2", color: "#c8102e", border: "1px solid #ffd0d8" }}
                      >
                        {error}
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full text-white font-semibold py-3.5 rounded-xl text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: isPending ? "#5b7fa6" : "linear-gradient(135deg, #003876 0%, #004e9e 100%)",
                        boxShadow: isPending ? "none" : "0 4px 14px rgba(0,56,118,0.35)",
                      }}
                    >
                      {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Enviando...
                        </span>
                      ) : (
                        "Enviar reporte a la directiva"
                      )}
                    </button>

                    <p className="text-xs text-center" style={{ color: "#a0aab4" }}>
                      Para emergencias inmediatas llama al{" "}
                      <a href="tel:911" className="font-semibold" style={{ color: "#c8102e" }}>911</a>
                      {" "}o al presidente al{" "}
                      <a href="tel:+18091234567" className="font-semibold" style={{ color: "#003876" }}>
                        (809) 123-4567
                      </a>
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Info sidebar */}
          <div className="space-y-4 lg:sticky lg:top-20">
            {/* Process card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "#0e1b2e", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
            >
              <div className="px-6 py-5">
                <h3 className="font-bold text-white mb-1">¿Cómo funciona?</h3>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Del reporte a la solución
                </p>
              </div>
              <div className="px-6 pb-6 space-y-5">
                {[
                  { n: "01", t: "Rellena el formulario", d: "Describe el problema con la mayor precisión posible." },
                  { n: "02", t: "La directiva lo recibe", d: "Tu reporte llega inmediatamente a los miembros de la junta." },
                  { n: "03", t: "Se gestiona oficialmente", d: "Contactamos INAPA, EDES-SUR o el Ayuntamiento según corresponda." },
                  { n: "04", t: "Publicamos el resultado", d: "Cuando se resuelve, aparece en el tablón de avisos del barrio." },
                ].map((s) => (
                  <div key={s.n} className="flex gap-3.5 items-start">
                    <div
                      className="text-xs font-black flex-shrink-0 mt-0.5"
                      style={{ color: "rgba(255,255,255,0.2)", fontVariantNumeric: "tabular-nums" }}
                    >
                      {s.n}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white leading-tight mb-0.5">{s.t}</div>
                      <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{s.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact card */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "#fff8f0", border: "1px solid #ffe4c8" }}
            >
              <div className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "#c8102e" }}>
                Emergencia inmediata
              </div>
              <p className="text-sm leading-relaxed mb-3" style={{ color: "#5a4030" }}>
                Para situaciones urgentes que no pueden esperar, llama directamente:
              </p>
              <div className="space-y-2">
                <a
                  href="tel:911"
                  className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-bold transition-opacity hover:opacity-80"
                  style={{ background: "#c8102e", color: "#fff" }}
                >
                  <span>🚨</span> Emergencias — 911
                </a>
                <a
                  href="tel:+18091234567"
                  className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
                  style={{ background: "#fff", color: "#003876", border: "1px solid #dde3ec" }}
                >
                  <span>📞</span> Presidente — (809) 123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .field-input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #0e1b2e;
          background: #fafbfc;
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
          font-family: inherit;
        }
        .field-input:focus {
          border-color: #003876;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,56,118,0.08);
        }
        .field-input::placeholder { color: #b0bac5; }
        .field-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238a95a3' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
      `}</style>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-sm font-medium" style={{ color: "#374151" }}>
          {label}
          {required && <span className="ml-0.5" style={{ color: "#c8102e" }}>*</span>}
        </label>
        {hint && (
          <span className="text-xs" style={{ color: "#a0aab4" }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function SuccessCard({ onBack }: { onBack: () => void }) {
  return (
    <div
      className="bg-white rounded-2xl p-10 text-center"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 32px rgba(0,0,0,0.06)" }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-2xl"
        style={{ background: "#eaf5ea" }}
      >
        ✓
      </div>
      <h3 className="text-xl font-bold mb-2" style={{ color: "#0e1b2e" }}>
        Reporte enviado
      </h3>
      <p className="text-sm leading-relaxed mb-6 max-w-xs mx-auto" style={{ color: "#5a6678" }}>
        La directiva del Barrio San Antonio ha recibido tu reporte y lo gestionará a la brevedad.
      </p>
      <div
        className="text-xs p-3 rounded-xl mb-6"
        style={{ background: "#f0f5ff", color: "#003876" }}
      >
        Los avances se publican en el tablón de avisos del barrio.
      </div>
      <button
        onClick={onBack}
        className="text-sm font-medium transition-opacity hover:opacity-70"
        style={{ color: "#003876" }}
      >
        ← Reportar otro problema
      </button>
    </div>
  );
}
