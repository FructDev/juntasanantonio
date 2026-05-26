import { prisma } from "@/lib/prisma";
import { guardarSiteConfig } from "@/app/actions";

export default async function SiteConfigPage() {
  const config = await prisma.siteConfig.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.03em" }}>
          Configuración del sitio
        </h1>
        <p className="text-sm mt-1" style={{ color: "#5a6678" }}>
          Estadísticas visibles en la portada y período de gestión.
        </p>
      </div>

      <form
        action={guardarSiteConfig}
        className="rounded-2xl bg-white p-6 space-y-5"
        style={{ border: "1px solid #e5eaf0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        {/* Gestión */}
        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
            Período de gestión
          </label>
          <input
            name="gestion"
            defaultValue={config.gestion}
            placeholder="2026–2028"
            className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
            style={{ borderColor: "#d1d9e6", background: "#fafbfc" }}
          />
          <p className="text-xs mt-1" style={{ color: "#8a95a3" }}>
            Ejemplo: 2026–2028
          </p>
        </div>

        <div className="h-px" style={{ background: "#f0f4f8" }} />

        {/* Stats */}
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#8a95a3" }}>
          Estadísticas (portada)
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              Familias
            </label>
            <input
              type="number"
              name="familias"
              defaultValue={config.familias}
              min={0}
              className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
              style={{ borderColor: "#d1d9e6", background: "#fafbfc" }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              Años activos
            </label>
            <input
              type="number"
              name="anosActivos"
              defaultValue={config.anosActivos}
              min={0}
              className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
              style={{ borderColor: "#d1d9e6", background: "#fafbfc" }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: "#374151" }}>
              Proyectos
            </label>
            <input
              type="number"
              name="proyectos"
              defaultValue={config.proyectos}
              min={0}
              className="w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
              style={{ borderColor: "#d1d9e6", background: "#fafbfc" }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-md"
          style={{ background: "#003876" }}
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
