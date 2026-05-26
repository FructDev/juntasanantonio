import { prisma } from "@/lib/prisma";
import { crearMiembro, actualizarMiembro, eliminarMiembro } from "@/app/actions";

const COLORES = [
  { value: "azul",   label: "Azul",       hex: "#003876" },
  { value: "rojo",   label: "Rojo",        hex: "#c8102e" },
  { value: "cielo",  label: "Celeste",     hex: "#009bde" },
  { value: "verde",  label: "Verde",       hex: "#1a6b3c" },
  { value: "dorado", label: "Dorado",      hex: "#92600a" },
];

const colorHex: Record<string, string> = Object.fromEntries(COLORES.map((c) => [c.value, c.hex]));

const inp = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100";
const inpStyle = { border: "1.5px solid #e2e8f0", color: "#0e1b2e" };

export default async function AdminDirectiva() {
  const miembros = await prisma.directivaMiembro.findMany({
    orderBy: { orden: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
          Directiva
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
          Gestiona los miembros de la directiva que aparecen en el sitio público.
        </p>
      </div>

      {/* Add member form */}
      <div
        className="bg-white rounded-2xl overflow-hidden mb-8"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4 flex items-center gap-2"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: "#003876" }}>
            <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Agregar miembro</div>
        </div>
        <form action={crearMiembro} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Nombre completo <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <input name="nombre" required placeholder="Juan Pérez Martínez"
                className={inp} style={inpStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Cargo <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <input name="cargo" required placeholder="Presidente"
                className={inp} style={inpStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                Iniciales <span style={{ color: "#c8102e" }}>*</span>
              </label>
              <input name="iniciales" required placeholder="JP" maxLength={3}
                className={inp} style={inpStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Teléfono</label>
              <input name="telefono" placeholder="(809) 000-0000"
                className={inp} style={inpStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Color avatar</label>
              <select name="color" className={inp} style={inpStyle}>
                {COLORES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
              Foto (opcional)
            </label>
            <input
              name="foto"
              type="file"
              accept="image/*"
              className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              style={{ color: "#5a6678" }}
            />
            <p className="text-xs mt-1" style={{ color: "#b0bac5" }}>
              Se recortará automáticamente en cuadrado centrado en la cara · Máx. 5 MB
            </p>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-md transition-all hover:-translate-y-px"
              style={{ background: "#003876", boxShadow: "0 2px 8px rgba(0,56,118,0.25)" }}
            >
              Agregar miembro
            </button>
          </div>
        </form>
      </div>

      {/* Members list */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
      >
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
        >
          <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>
            Miembros actuales — {miembros.length} personas
          </div>
        </div>

        {miembros.length === 0 ? (
          <div className="py-14 text-center">
            <div className="text-sm font-medium" style={{ color: "#8a95a3" }}>No hay miembros registrados</div>
          </div>
        ) : (
          miembros.map((m, i) => {
            const hex = colorHex[m.color] ?? "#003876";
            return (
              <div
                key={m.id}
                style={{ borderBottom: i < miembros.length - 1 ? "1px solid #f8f9fc" : undefined }}
              >
                {/* Compact view */}
                <details className="group">
                  <summary
                    className="px-6 py-4 flex items-center gap-4 cursor-pointer list-none hover:bg-slate-50 transition-colors"
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm font-black"
                      style={{ background: hex }}
                    >
                      {m.iniciales}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: "#0e1b2e" }}>{m.nombre}</div>
                      <div className="text-xs" style={{ color: "#8a95a3" }}>
                        {m.cargo}{m.telefono ? ` · ${m.telefono}` : ""}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Delete */}
                      <form
                        action={async () => {
                          "use server";
                          await eliminarMiembro(m.id);
                        }}
                      >
                        <button
                          type="submit"
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
                          style={{ color: "#c8102e" }}
                          title="Eliminar"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </form>
                      <svg
                        className="w-4 h-4 transition-transform group-open:rotate-180"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                        style={{ color: "#b0bac5" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </summary>

                  {/* Edit form (expanded) */}
                  <form
                    action={actualizarMiembro}
                    className="px-6 pb-5 pt-1"
                    style={{ background: "#fafbfc", borderTop: "1px solid #f0f4f8" }}
                  >
                    <input type="hidden" name="id" value={m.id} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 mt-4">
                      <div className="sm:col-span-2 lg:col-span-2">
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Nombre completo</label>
                        <input name="nombre" defaultValue={m.nombre} required
                          className={inp} style={inpStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Cargo</label>
                        <input name="cargo" defaultValue={m.cargo} required
                          className={inp} style={inpStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Iniciales</label>
                        <input name="iniciales" defaultValue={m.iniciales} required maxLength={3}
                          className={inp} style={inpStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Teléfono</label>
                        <input name="telefono" defaultValue={m.telefono}
                          className={inp} style={inpStyle} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>Color avatar</label>
                        <select name="color" defaultValue={m.color} className={inp} style={inpStyle}>
                          {COLORES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {/* Foto actual + nuevo upload */}
                    <div className="mb-4">
                      {m.fotoUrl && (
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={m.fotoUrl}
                            alt={m.nombre}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                            style={{ border: "2px solid #edf0f5" }}
                          />
                          <span className="text-xs" style={{ color: "#8a95a3" }}>Foto actual</span>
                        </div>
                      )}
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
                        {m.fotoUrl ? "Cambiar foto" : "Agregar foto (opcional)"}
                      </label>
                      <input
                        name="foto"
                        type="file"
                        accept="image/*"
                        className="w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        style={{ color: "#5a6678" }}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                        style={{ background: "#f0f5ff", color: "#003876" }}
                      >
                        Guardar cambios
                      </button>
                    </div>
                  </form>
                </details>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
