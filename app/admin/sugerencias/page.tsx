import { prisma } from "@/lib/prisma";
import { marcarSugerenciaLeida, eliminarSugerencia } from "@/app/actions";

export default async function AdminSugerencias() {
  const sugerencias = await prisma.sugerencia.findMany({
    orderBy: { createdAt: "desc" },
  });

  const noLeidas = sugerencias.filter((s) => !s.leido).length;

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
            Sugerencias
          </h1>
          <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
            {sugerencias.length} {sugerencias.length === 1 ? "sugerencia" : "sugerencias"} recibidas
            {noLeidas > 0 && (
              <span className="ml-2 font-semibold" style={{ color: "#003876" }}>
                · {noLeidas} sin leer
              </span>
            )}
          </p>
        </div>
      </div>

      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Todas las sugerencias</div>
          {noLeidas > 0 && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "#f0f5ff", color: "#003876" }}
            >
              {noLeidas} nuevas
            </span>
          )}
        </div>

        {sugerencias.length === 0 ? (
          <div className="py-14 text-center">
            <div className="text-sm font-medium mb-1" style={{ color: "#8a95a3" }}>No hay sugerencias todavía</div>
            <div className="text-xs" style={{ color: "#b0bac5" }}>Las sugerencias de vecinos aparecerán aquí</div>
          </div>
        ) : (
          sugerencias.map((s, i) => (
            <div
              key={s.id}
              className="px-6 py-5 flex items-start gap-4"
              style={{
                borderBottom: i < sugerencias.length - 1 ? "1px solid #f8f9fc" : undefined,
                background: s.leido ? "#fff" : "#fafcff",
              }}
            >
              {/* Unread indicator */}
              <div className="mt-1.5 flex-shrink-0">
                {!s.leido ? (
                  <div className="w-2 h-2 rounded-full" style={{ background: "#003876" }} />
                ) : (
                  <div className="w-2 h-2 rounded-full" style={{ background: "#e2e8f0" }} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                {/* Meta */}
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: "#0e1b2e" }}>
                    {s.nombre || "Vecino anónimo"}
                  </span>
                  <span className="text-xs" style={{ color: "#b0bac5" }}>
                    {new Intl.DateTimeFormat("es-DO", { dateStyle: "medium", timeStyle: "short" }).format(s.createdAt)}
                  </span>
                  {!s.leido && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "#f0f5ff", color: "#003876" }}
                    >
                      Nueva
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  {s.mensaje}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {!s.leido && (
                  <form action={async () => { "use server"; await marcarSugerenciaLeida(s.id); }}>
                    <button
                      type="submit"
                      className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-blue-50"
                      style={{ borderColor: "#c7d9f5", color: "#003876" }}
                    >
                      Marcar leída
                    </button>
                  </form>
                )}
                <form action={async () => { "use server"; await eliminarSugerencia(s.id); }}>
                  <button
                    type="submit"
                    className="text-xs px-2.5 py-1.5 rounded-lg border transition-colors hover:bg-red-50"
                    style={{ borderColor: "#fecdd3", color: "#c8102e" }}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
