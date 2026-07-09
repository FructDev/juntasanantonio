"use client";

import { useState, useTransition } from "react";
import { enviarSugerencia } from "@/app/actions";

export default function Sugerencias() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chars, setChars] = useState(0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;

    startTransition(async () => {
      const res = await enviarSugerencia(fd);
      if (res.ok) {
        setDone(true);
        form.reset();
        setChars(0);
      } else {
        setError(res.error ?? "No se pudo enviar. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <section id="sugerencias" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_420px] gap-12 items-center">
          {/* Left — info */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#1b5e20" }}>
              Tu opinión cuenta
            </p>
            <h2 className="text-3xl font-black mb-4" style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}>
              Libro de sugerencias
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "#5a6678" }}>
              ¿Tienes una idea para mejorar el barrio? ¿Algo que la directiva debería
              considerar? Escríbenos. Todas las sugerencias llegan directamente a los
              miembros de la junta y se revisan en la próxima asamblea.
            </p>

            <div className="space-y-4">
              {[
                { ico: "💡", t: "Ideas de mejora", d: "Parques, iluminación, áreas comunes" },
                { ico: "🏗️", t: "Proyectos comunitarios", d: "Obras que el barrio necesita" },
                { ico: "📋", t: "Temas para la asamblea", d: "Puntos a tratar en la próxima reunión" },
              ].map((item) => (
                <div key={item.t} className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ background: "#f1f8f1" }}
                  >
                    {item.ico}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: "#0e1b2e" }}>{item.t}</div>
                    <div className="text-xs" style={{ color: "#8a95a3" }}>{item.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: "1px solid #edf0f5", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}
            >
              {done ? (
                /* Success */
                <div className="p-10 text-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ background: "#f0faf5" }}
                  >
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#0e1b2e" }}>¡Gracias por tu sugerencia!</h3>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: "#5a6678" }}>
                    La directiva la recibirá y la considerará en la próxima asamblea.
                  </p>
                  <button
                    onClick={() => setDone(false)}
                    className="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    style={{ color: "#1b5e20", background: "#f1f8f1" }}
                  >
                    Enviar otra sugerencia
                  </button>
                </div>
              ) : (
                <>
                  <div
                    className="px-6 py-4"
                    style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
                  >
                    <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Nueva sugerencia</div>
                    <div className="text-xs" style={{ color: "#8a95a3" }}>Anónima o con tu nombre</div>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: "#374151" }}>
                        Tu nombre <span className="text-xs font-normal" style={{ color: "#8a95a3" }}>(opcional)</span>
                      </label>
                      <input
                        name="nombre"
                        type="text"
                        placeholder="Residente del barrio"
                        className="sfield"
                      />
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between mb-1.5">
                        <label className="text-sm font-medium" style={{ color: "#374151" }}>
                          Tu sugerencia <span style={{ color: "#c8102e" }}>*</span>
                        </label>
                        <span className="text-xs" style={{ color: "#a0aab4" }}>{chars}/500</span>
                      </div>
                      <textarea
                        name="mensaje"
                        required
                        rows={5}
                        maxLength={500}
                        placeholder="Describe tu idea o sugerencia con el mayor detalle posible..."
                        className="sfield resize-none"
                        onChange={(e) => setChars(e.target.value.length)}
                      />
                    </div>

                    {error && (
                      <div className="text-sm px-4 py-3 rounded-xl" style={{ background: "#fff0f2", color: "#c8102e", border: "1px solid #ffd0d8" }}>
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-60"
                      style={{
                        background: isPending ? "#5b7fa6" : "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
                        boxShadow: isPending ? "none" : "0 4px 14px rgba(27,94,32,0.28)",
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
                      ) : (
                        <>
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Enviar sugerencia
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sfield {
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
        .sfield:focus {
          border-color: #1b5e20;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(27,94,32,0.08);
        }
        .sfield::placeholder { color: #b0bac5; }
      `}</style>
    </section>
  );
}
