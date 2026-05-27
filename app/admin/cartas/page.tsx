"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────

type Plantilla = "institucion" | "circular" | "acta";

interface FieldDef {
  name: string;
  label: string;
  placeholder?: string;
  type?: "text" | "textarea" | "select" | "date";
  options?: { value: string; label: string }[];
  defaultValue?: string;
  required?: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────

function hoy() {
  const d = new Date();
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}

const FIRMANTES = [
  "Juan Pérez Martínez — Presidente",
  "María García López — Vicepresidenta",
  "Carlos Rodríguez — Secretario",
  "Ana Marte Sánchez — Tesorera",
  "Rafael Díaz Núñez — Vocal",
];

// ── Field definitions per template ───────────────────────────────────────

const FIELDS: Record<Plantilla, FieldDef[]> = {
  institucion: [
    { name: "fecha",         label: "Fecha",                   defaultValue: hoy(),                 type: "text"     },
    { name: "destinatario",  label: "Nombre del destinatario", placeholder: "Ing. Pedro López",     required: true   },
    { name: "cargo",         label: "Cargo del destinatario",  placeholder: "Director Regional",    required: true   },
    { name: "institucion",   label: "Institución",             placeholder: "INAPA San Cristóbal",  required: true   },
    { name: "direccion",     label: "Dirección",               placeholder: "Av. Constitución #12"                   },
    { name: "asunto",        label: "Asunto",                  placeholder: "Solicitud de reparación de tubería",     required: true },
    { name: "objeto",        label: "Objeto de la carta",      placeholder: "solicitar la reparación urgente de...", type: "textarea", required: true },
    { name: "antecedentes",  label: "Antecedentes",            placeholder: "Describa la situación que motiva esta carta...", type: "textarea" },
    { name: "solicitud",     label: "Lo que se solicita",      placeholder: "la reparación inmediata de la tubería en la calle 3...", type: "textarea", required: true },
    { name: "firmante",      label: "Firmante",                type: "select", options: FIRMANTES.map(f => ({ value: f, label: f })) },
  ],
  circular: [
    { name: "numero",        label: "Número de circular",      placeholder: "001",                  required: true   },
    { name: "fecha",         label: "Fecha",                   defaultValue: hoy(),                 type: "text"     },
    { name: "asunto",        label: "Asunto / Tema",           placeholder: "Jornada de limpieza comunitaria", required: true },
    { name: "punto1",        label: "Punto 1",                 placeholder: "Descripción del primer punto...", type: "textarea", required: true },
    { name: "punto2",        label: "Punto 2",                 placeholder: "Descripción del segundo punto...", type: "textarea" },
    { name: "punto3",        label: "Punto 3 (opcional)",      placeholder: "Descripción del tercer punto...", type: "textarea" },
    { name: "accion",        label: "Acción requerida",        placeholder: "Presentarse el sábado 10 de mayo a las 7am...", type: "textarea" },
    { name: "fechaLimite",   label: "Fecha límite",            placeholder: "Sábado 10 de mayo de 2025"                          },
  ],
  acta: [
    { name: "numero",        label: "Número de acta",          placeholder: "005",                  required: true   },
    { name: "tipo",          label: "Tipo de asamblea",        type: "select", options: [{ value: "Ordinaria", label: "Ordinaria" }, { value: "Extraordinaria", label: "Extraordinaria" }] },
    { name: "fecha",         label: "Fecha",                   defaultValue: hoy(),                 type: "text"     },
    { name: "horaInicio",    label: "Hora de inicio",          placeholder: "7:00 pm"               },
    { name: "horaCierre",    label: "Hora de cierre",          placeholder: "8:30 pm"               },
    { name: "quorum",        label: "Quórum presente",         placeholder: "34 vecinos de 180 registrados" },
    { name: "punto3",        label: "Punto 3 del orden del día", placeholder: "Presentación del presupuesto 2025..." },
    { name: "punto4",        label: "Punto 4 del orden del día", placeholder: "Elección de nuevo vocal..." },
    { name: "acuerdos",      label: "Acuerdos tomados",        placeholder: "1. Aprobar el presupuesto...\n2. Convocar a INAPA...", type: "textarea" },
  ],
};

// ── Letter preview renderers ──────────────────────────────────────────────

const ESCUDO_SVG = `<svg viewBox="0 0 120 152" width="72" height="91" xmlns="http://www.w3.org/2000/svg" style="display:block;flex-shrink:0;">
  <defs>
    <clipPath id="esc-clip">
      <path d="M60,9 Q34,9 19,22 L19,87 Q19,129 60,143 Q101,129 101,87 L101,22 Q86,9 60,9 Z"/>
    </clipPath>
    <linearGradient id="esc-gld" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f4d96a"/>
      <stop offset="50%" stop-color="#d4a020"/>
      <stop offset="100%" stop-color="#a87010"/>
    </linearGradient>
  </defs>
  <path d="M60,4 Q30,4 13,18 L13,87 Q13,133 60,149 Q107,133 107,87 L107,18 Q90,4 60,4 Z" fill="url(#esc-gld)"/>
  <g clip-path="url(#esc-clip)">
    <rect x="19" y="9"  width="41" height="66" fill="#003580"/>
    <rect x="60" y="9"  width="41" height="66" fill="#bf0d27"/>
    <rect x="19" y="75" width="41" height="68" fill="#bf0d27"/>
    <rect x="60" y="75" width="41" height="68" fill="#003580"/>
    <rect x="19" y="69" width="82" height="12" fill="white"/>
    <rect x="54" y="9"  width="12" height="134" fill="white"/>
    <polygon transform="translate(36,38)"  opacity="0.7"  fill="white" points="0,-4.5 1.06,-1.46 4.28,-1.39 1.71,0.56 2.65,3.64 0,1.7 -2.65,3.64 -1.71,0.56 -4.28,-1.39 -1.06,-1.46"/>
    <polygon transform="translate(84,38)"  opacity="0.55" fill="white" points="0,-4.5 1.06,-1.46 4.28,-1.39 1.71,0.56 2.65,3.64 0,1.7 -2.65,3.64 -1.71,0.56 -4.28,-1.39 -1.06,-1.46"/>
    <polygon transform="translate(36,105)" opacity="0.55" fill="white" points="0,-4.5 1.06,-1.46 4.28,-1.39 1.71,0.56 2.65,3.64 0,1.7 -2.65,3.64 -1.71,0.56 -4.28,-1.39 -1.06,-1.46"/>
    <polygon transform="translate(84,105)" opacity="0.7"  fill="white" points="0,-4.5 1.06,-1.46 4.28,-1.39 1.71,0.56 2.65,3.64 0,1.7 -2.65,3.64 -1.71,0.56 -4.28,-1.39 -1.06,-1.46"/>
    <circle cx="60" cy="75" r="17" fill="white"/>
    <circle cx="60" cy="75" r="17" fill="none" stroke="#d4a020" stroke-width="0.8"/>
    <polygon points="60,62 49,73 71,73" fill="#003580"/>
    <rect x="51" y="73" width="18" height="12" fill="#003580"/>
    <rect x="57" y="77" width="6"  height="8" rx="1" fill="white"/>
    <rect x="65" y="63" width="3"  height="7" fill="#003580"/>
    <rect x="53" y="74" width="4"  height="4" rx="0.5" fill="white"/>
    <rect x="63" y="74" width="4"  height="4" rx="0.5" fill="white"/>
  </g>
  <path d="M60,4 Q30,4 13,18 L13,87 Q13,133 60,149 Q107,133 107,87 L107,18 Q90,4 60,4 Z" fill="none" stroke="#8a6808" stroke-width="1.5"/>
  <path d="M60,11 Q35,11 21,24 L21,87 Q21,127 60,140 Q99,127 99,87 L99,24 Q85,11 60,11 Z" fill="none" stroke="rgba(255,255,255,0.38)" stroke-width="1"/>
</svg>`;

const HEADER_HTML = `
  <div style="display:flex;align-items:center;gap:18px;margin-bottom:8px;">
    ${ESCUDO_SVG}
    <div>
      <div style="font-size:17px;font-weight:bold;color:#003876;font-family:Calibri,sans-serif;letter-spacing:0.02em;">JUNTA DE VECINOS</div>
      <div style="font-size:12px;color:#003876;font-family:Calibri,sans-serif;">Sector San Antonio · Sector Lava Pie</div>
      <div style="font-size:11px;color:#666;font-family:Calibri,sans-serif;">San Cristóbal, República Dominicana</div>
    </div>
  </div>
  <div style="border-bottom:3px solid #003876;margin-bottom:20px;padding-bottom:4px;"></div>
`;

const FOOTER_HTML = `
  <div style="border-top:1px solid #003876;padding-top:6px;margin-top:20px;display:flex;justify-content:space-between;font-size:10px;color:#666;font-family:Calibri,sans-serif;">
    <span>(809) ___-____</span>
    <span>juntasanantonio@gmail.com</span>
    <span>San Cristóbal, RD</span>
  </div>
`;

function buildLetterHtml(plantilla: Plantilla, data: Record<string, string>): string {
  const s = (key: string, fallback = "") => data[key] || fallback;

  let body = "";

  if (plantilla === "institucion") {
    const firmanteParts = s("firmante", "Juan Pérez Martínez — Presidente").split(" — ");
    body = `
      <p style="text-align:right;margin-bottom:20px;">${s("fecha", hoy())}</p>
      <p style="margin-bottom:4px;"><strong>${s("destinatario","[Destinatario]")}</strong></p>
      <p style="margin-bottom:4px;">${s("cargo","[Cargo]")}</p>
      <p style="margin-bottom:4px;">${s("institucion","[Institución]")}</p>
      ${s("direccion") ? `<p style="margin-bottom:4px;">${s("direccion")}</p>` : ""}
      <p style="margin-bottom:20px;">Su despacho.-</p>
      <p style="margin-bottom:20px;"><strong>Asunto: <u>${s("asunto","[Asunto]")}</u></strong></p>
      <p style="margin-bottom:20px;">Estimado/a ${s("cargo","[Cargo]")}:</p>
      <p style="margin-bottom:16px;">En nombre de la Junta de Vecinos del Sector San Antonio, Sector Lava Pie, municipio San Cristóbal, me dirijo respetuosamente a usted para <strong>${s("objeto","[objeto de la carta]")}</strong>.</p>
      ${s("antecedentes") ? `
      <p style="margin-bottom:4px;"><strong style="color:#003876;">ANTECEDENTES:</strong></p>
      <p style="margin-bottom:16px;white-space:pre-line;">${s("antecedentes")}</p>
      ` : ""}
      <p style="margin-bottom:4px;"><strong style="color:#003876;">SOLICITUD:</strong></p>
      <p style="margin-bottom:16px;">En tal virtud, solicitamos respetuosamente a su institución <strong>${s("solicitud","[lo que se solicita]")}</strong>, lo cual redundaría en beneficio directo de los aproximadamente 180 núcleos familiares que residen en el sector.</p>
      <p style="margin-bottom:20px;">En la espera de una pronta y favorable respuesta, le agradecemos de antemano su gestión.</p>
      <p style="margin-bottom:8px;">Atentamente,</p>
      <br/><br/>
      <div style="border-top:1px solid #999;padding-top:4px;display:inline-block;min-width:200px;">
        <p style="margin:0;font-weight:bold;">${firmanteParts[0] || "[Firmante]"}</p>
        <p style="margin:0;">${firmanteParts[1] || "Junta de Vecinos"}</p>
        <p style="margin:0;">Sector San Antonio, San Cristóbal</p>
      </div>
    `;
  }

  if (plantilla === "circular") {
    const puntos = [s("punto1"), s("punto2"), s("punto3")].filter(Boolean);
    body = `
      <p style="text-align:center;font-size:16px;font-weight:bold;color:#003876;margin-bottom:16px;">CIRCULAR No. ${s("numero","[___]")} / ${new Date().getFullYear()}</p>
      <p style="margin-bottom:4px;">${s("fecha", hoy())}</p>
      <p style="margin-bottom:4px;"><strong>A: TODOS LOS VECINOS Y RESIDENTES DEL BARRIO SAN ANTONIO</strong></p>
      <p style="margin-bottom:4px;"><strong>De:</strong> La Directiva de la Junta de Vecinos</p>
      <p style="margin-bottom:12px;"><strong>Asunto:</strong> ${s("asunto","[Tema]")}</p>
      <hr style="border:none;border-top:1px solid #003876;margin-bottom:16px;"/>
      <p style="margin-bottom:12px;">Por medio de la presente, la Directiva de la Junta de Vecinos del Sector San Antonio se complace en comunicarles que:</p>
      <ol style="margin-bottom:16px;padding-left:24px;">
        ${puntos.map(pt => `<li style="margin-bottom:6px;">${pt}</li>`).join("")}
      </ol>
      ${s("accion") ? `<p style="margin-bottom:4px;"><strong style="color:#003876;">ACCIÓN REQUERIDA:</strong></p><p style="margin-bottom:12px;white-space:pre-line;">${s("accion")}</p>` : ""}
      ${s("fechaLimite") ? `<p style="margin-bottom:20px;"><strong>FECHA LÍMITE: ${s("fechaLimite")}</strong></p>` : ""}
      <p style="margin-bottom:20px;">Agradecemos su colaboración y participación activa en el bienestar de nuestro barrio.</p>
      <br/>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
        ${[["Juan Pérez Martínez","Presidente"],["María García López","Vicepresidenta"],["Carlos Rodríguez","Secretario"],["Ana Marte Sánchez","Tesorera"],["Rafael Díaz Núñez","Vocal"]].map(([n,c]) => `
          <div>
            <p style="margin:0;font-weight:bold;font-size:12px;">${n}</p>
            <p style="margin:0;font-size:11px;color:#666;">${c}</p>
          </div>
        `).join("")}
      </div>
    `;
  }

  if (plantilla === "acta") {
    const acuerdosLines = s("acuerdos","").split("\n").filter(Boolean);
    body = `
      <p style="text-align:center;font-size:15px;font-weight:bold;color:#003876;margin-bottom:4px;">ACTA DE ASAMBLEA ${s("tipo","ORDINARIA").toUpperCase()}</p>
      <p style="text-align:center;font-size:13px;color:#666;margin-bottom:12px;">No. ${s("numero","[___]")} · ${s("fecha", hoy())}</p>
      <hr style="border:none;border-top:2px solid #003876;margin-bottom:16px;"/>

      <p style="font-weight:bold;color:#003876;margin-bottom:8px;">I. DATOS GENERALES</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px;">
        ${[
          ["Fecha", s("fecha", hoy())],
          ["Hora de inicio", s("horaInicio","—")],
          ["Hora de cierre", s("horaCierre","—")],
          ["Lugar", "Salón comunitario, Sector San Antonio"],
          ["Tipo de asamblea", s("tipo","Ordinaria")],
          ["Quórum", s("quorum","—")],
        ].map(([k,v],i) => `
          <tr style="background:${i%2===0?"#f0f4ff":"#fff"};">
            <td style="padding:5px 10px;border:1px solid #ddd;font-weight:bold;width:35%;">${k}</td>
            <td style="padding:5px 10px;border:1px solid #ddd;">${v}</td>
          </tr>
        `).join("")}
      </table>

      <p style="font-weight:bold;color:#003876;margin-bottom:8px;">II. ORDEN DEL DÍA</p>
      <ol style="margin-bottom:16px;padding-left:24px;font-size:12px;">
        <li style="margin-bottom:4px;">Verificación del quórum</li>
        <li style="margin-bottom:4px;">Lectura y aprobación del acta anterior</li>
        ${s("punto3") ? `<li style="margin-bottom:4px;">${s("punto3")}</li>` : ""}
        ${s("punto4") ? `<li style="margin-bottom:4px;">${s("punto4")}</li>` : ""}
        <li style="margin-bottom:4px;">Varios y cierre</li>
      </ol>

      ${acuerdosLines.length ? `
      <p style="font-weight:bold;color:#003876;margin-bottom:8px;">III. ACUERDOS</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:12px;">
        <tr style="background:#003876;color:#fff;">
          <td style="padding:5px 10px;border:1px solid #003876;width:8%;">No.</td>
          <td style="padding:5px 10px;border:1px solid #003876;">Acuerdo</td>
        </tr>
        ${acuerdosLines.map((a,i) => `<tr><td style="padding:5px 10px;border:1px solid #ddd;text-align:center;">${i+1}</td><td style="padding:5px 10px;border:1px solid #ddd;">${a.replace(/^\d+[\.\-]\s*/,"")}</td></tr>`).join("")}
      </table>
      ` : ""}

      <p style="font-weight:bold;color:#003876;margin-bottom:8px;">IV. CIERRE</p>
      <p style="margin-bottom:20px;font-size:12px;">No habiendo más asuntos que tratar, se da por clausurada la asamblea a las <strong>${s("horaCierre","[hora]")}</strong> del día <strong>${s("fecha",hoy())}</strong>.</p>
      <br/>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;">
        ${[["Presidente/a","Juan Pérez Martínez"],["Secretario/a","Carlos Rodríguez"],["Delegado/a de Vecinos","___________________"]].map(([c,n]) => `
          <div>
            <div style="border-top:1px solid #999;padding-top:4px;">
              <p style="margin:0;font-weight:bold;font-size:11px;">${n}</p>
              <p style="margin:0;font-size:10px;color:#666;">${c}</p>
            </div>
          </div>
        `).join("")}
      </div>
    `;
  }

  return `
    <html><head><meta charset="utf-8">
    <style>
      * { box-sizing: border-box; }
      body { font-family: Calibri, Arial, sans-serif; font-size: 12px; color: #111; margin: 0; padding: 0; }
      @media print {
        body { margin: 0; }
        .no-print { display: none !important; }
      }
    </style>
    </head><body style="padding:40px 50px;max-width:800px;margin:0 auto;">
      ${HEADER_HTML}
      ${body}
      ${FOOTER_HTML}
    </body></html>
  `;
}

// ── Field input component ─────────────────────────────────────────────────

function Field({ def, value, onChange }: { def: FieldDef; value: string; onChange: (v: string) => void }) {
  const inp = "w-full px-3.5 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100";
  const inpStyle = { border: "1.5px solid #e2e8f0", color: "#0e1b2e", background: "#fafbfc" };

  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "#5a6678" }}>
        {def.label}
        {def.required && <span className="ml-0.5" style={{ color: "#c8102e" }}>*</span>}
      </label>
      {def.type === "textarea" ? (
        <textarea
          rows={3}
          placeholder={def.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inp} resize-none`}
          style={inpStyle}
        />
      ) : def.type === "select" ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className={inp} style={inpStyle}>
          {def.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input
          type="text"
          placeholder={def.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inp}
          style={inpStyle}
        />
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

const TEMPLATES: { id: Plantilla; label: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: "institucion",
    label: "Carta a institución",
    desc: "Para INAPA, EDES-SUR, Ayuntamiento u otras entidades",
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>,
  },
  {
    id: "circular",
    label: "Circular a vecinos",
    desc: "Comunicado para todos los residentes del barrio",
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  },
  {
    id: "acta",
    label: "Acta de asamblea",
    desc: "Registro de asamblea ordinaria o extraordinaria",
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  },
];

export default function AdminCartas() {
  const [plantilla, setPlantilla] = useState<Plantilla | null>(null);
  const [data, setData]           = useState<Record<string, string>>({});
  const [previewing, setPreviewing] = useState(false);

  function initData(p: Plantilla) {
    const init: Record<string, string> = {};
    FIELDS[p].forEach((f) => {
      init[f.name] = f.defaultValue ?? (f.type === "select" ? (f.options?.[0]?.value ?? "") : "");
    });
    setData(init);
    setPlantilla(p);
    setPreviewing(false);
  }

  function handlePrint() {
    if (!plantilla) return;
    const html = buildLetterHtml(plantilla, data);
    const win = window.open("", "_blank", "width=850,height=1100");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "#0e1b2e", letterSpacing: "-0.02em" }}>
          Generar carta
        </h1>
        <p className="text-sm mt-1" style={{ color: "#8a95a3" }}>
          Selecciona una plantilla, rellena los campos y genera la carta lista para imprimir.
        </p>
      </div>

      {/* Template selector */}
      {!plantilla && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => initData(t.id)}
              className="bg-white rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-md"
              style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "#f0f5ff", color: "#003876" }}>
                {t.icon}
              </div>
              <div className="font-bold text-sm mb-1" style={{ color: "#0e1b2e" }}>{t.label}</div>
              <div className="text-xs" style={{ color: "#8a95a3" }}>{t.desc}</div>
            </button>
          ))}
        </div>
      )}

      {/* Form + preview */}
      {plantilla && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: form */}
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            {/* Card header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
            >
              <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>
                {TEMPLATES.find((t) => t.id === plantilla)?.label}
              </div>
              <button
                onClick={() => setPlantilla(null)}
                className="text-xs px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-100"
                style={{ color: "#8a95a3" }}
              >
                ← Cambiar plantilla
              </button>
            </div>

            {/* Fields */}
            <div className="p-6 space-y-4">
              {FIELDS[plantilla].map((f) => (
                <Field
                  key={f.name}
                  def={f}
                  value={data[f.name] ?? ""}
                  onChange={(v) => setData((prev) => ({ ...prev, [f.name]: v }))}
                />
              ))}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPreviewing(true)}
                  className="flex-1 text-sm font-semibold py-2.5 rounded-xl transition-all"
                  style={{ background: "#f0f5ff", color: "#003876" }}
                >
                  Vista previa
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 rounded-xl transition-all hover:-translate-y-px hover:shadow-md"
                  style={{ background: "#003876", boxShadow: "0 2px 8px rgba(0,56,118,0.25)" }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                  </svg>
                  Imprimir / PDF
                </button>
              </div>
            </div>
          </div>

          {/* Right: live preview */}
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{ border: "1px solid #edf0f5", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid #f0f4f8", background: "#fafbfc" }}
            >
              <div className="text-sm font-bold" style={{ color: "#0e1b2e" }}>Vista previa</div>
              <span className="text-xs" style={{ color: "#b0bac5" }}>Se actualiza automáticamente</span>
            </div>
            <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
              <iframe
                key={JSON.stringify(data) + plantilla}
                srcDoc={buildLetterHtml(plantilla, data)}
                className="w-full border-0"
                style={{ height: "70vh", minHeight: 500 }}
                title="Vista previa de la carta"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
