"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import { subirFoto, eliminarFoto } from "@/lib/cloudinary";

export async function enviarReporte(fd: FormData) {
  const nombre = String(fd.get("nombre") ?? "").trim();
  const telefono = String(fd.get("telefono") ?? "").trim();
  const tipo = String(fd.get("tipo") ?? "").trim();
  const ubicacion = String(fd.get("ubicacion") ?? "").trim();
  const descripcion = String(fd.get("descripcion") ?? "").trim();

  if (!nombre || !tipo || !ubicacion || !descripcion) {
    return { ok: false, error: "Campos requeridos faltantes" };
  }

  await prisma.reporte.create({
    data: { nombre, telefono, tipo, ubicacion, descripcion },
  });

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.DIRECTIVA_EMAIL ?? "juntasanantonio@gmail.com",
        subject: `[Reporte] ${tipo} — ${ubicacion}`,
        text: `Nuevo reporte de ${nombre} (${telefono || "sin teléfono"}):\n\nTipo: ${tipo}\nUbicación: ${ubicacion}\n\n${descripcion}`,
      });
    } catch {
      // Email falla silenciosamente — el reporte ya quedó en BD
    }
  }

  return { ok: true };
}

export async function enviarSugerencia(fd: FormData) {
  const nombre = String(fd.get("nombre") ?? "").trim();
  const mensaje = String(fd.get("mensaje") ?? "").trim();

  if (!nombre || !mensaje) {
    return { ok: false, error: "Completa todos los campos" };
  }

  await prisma.sugerencia.create({ data: { nombre, mensaje } });
  return { ok: true };
}

// ── ADMIN AUTH ──

export async function adminLogin(fd: FormData) {
  const password = String(fd.get("password") ?? "");
  if (password !== process.env.ADMIN_PASSWORD) {
    return { ok: false, error: "Contraseña incorrecta" };
  }
  const cookieStore = await cookies();
  cookieStore.set("admin_session", process.env.ADMIN_PASSWORD!, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8,
    sameSite: "lax",
  });
  redirect("/admin");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

// ── AVISOS ──

export async function crearAviso(fd: FormData) {
  await requireAdmin();
  await prisma.aviso.create({
    data: {
      titulo: String(fd.get("titulo")),
      descripcion: String(fd.get("descripcion")),
      tipo: String(fd.get("tipo")),
    },
  });
  revalidatePath("/");
  redirect("/admin/avisos");
}

export async function eliminarAviso(id: number) {
  await requireAdmin();
  await prisma.aviso.update({ where: { id }, data: { activo: false } });
  revalidatePath("/");
  redirect("/admin/avisos");
}

// ── REPORTES ──

export async function actualizarEstadoReporte(id: number, estado: string) {
  await requireAdmin();
  await prisma.reporte.update({ where: { id }, data: { estado } });
  revalidatePath("/");
  redirect("/admin/reportes");
}

// ── OBRAS ──

export async function crearObra(fd: FormData) {
  await requireAdmin();
  const costoRaw = String(fd.get("costo") ?? "").trim();
  const inicioRaw = String(fd.get("inicio") ?? "").trim();
  const finRaw = String(fd.get("fin") ?? "").trim();

  await prisma.obra.create({
    data: {
      titulo: String(fd.get("titulo")),
      descripcion: String(fd.get("descripcion")),
      estado: String(fd.get("estado")),
      costo: costoRaw ? parseFloat(costoRaw) : null,
      inicio: inicioRaw ? new Date(inicioRaw) : null,
      fin: finRaw ? new Date(finRaw) : null,
    },
  });
  revalidatePath("/");
  redirect("/admin/obras");
}

export async function actualizarEstadoObra(id: number, estado: string) {
  await requireAdmin();
  await prisma.obra.update({ where: { id }, data: { estado } });
  revalidatePath("/");
  redirect("/admin/obras");
}

export async function eliminarObra(id: number) {
  await requireAdmin();
  await prisma.obra.update({ where: { id }, data: { activo: false } });
  revalidatePath("/");
  redirect("/admin/obras");
}

// ── VECINOS / CUOTAS ──

export async function crearVecino(fd: FormData) {
  await requireAdmin();
  await prisma.vecino.create({
    data: {
      nombre: String(fd.get("nombre")),
      cedula: String(fd.get("cedula") ?? "").trim() || null,
      telefono: String(fd.get("telefono") ?? "").trim() || null,
      calle: String(fd.get("calle")),
      numero: String(fd.get("numero") ?? "").trim(),
    },
  });
  redirect("/admin/vecinos");
}

export async function toggleCuota(vecinoId: number, mes: string, anio: number) {
  await requireAdmin();
  const existing = await prisma.cuota.findUnique({
    where: { vecinoId_mes_anio: { vecinoId, mes, anio } },
  });

  if (existing) {
    await prisma.cuota.update({
      where: { id: existing.id },
      data: { pagado: !existing.pagado, fechaPago: !existing.pagado ? new Date() : null },
    });
  } else {
    await prisma.cuota.create({
      data: { vecinoId, mes, anio, pagado: true, fechaPago: new Date() },
    });
  }
  redirect("/admin/vecinos");
}

export async function eliminarVecino(id: number) {
  await requireAdmin();
  await prisma.vecino.update({ where: { id }, data: { activo: false } });
  redirect("/admin/vecinos");
}

// ── SUGERENCIAS ──

export async function marcarSugerenciaLeida(id: number) {
  await requireAdmin();
  await prisma.sugerencia.update({ where: { id }, data: { leido: true } });
  redirect("/admin/sugerencias");
}

export async function eliminarSugerencia(id: number) {
  await requireAdmin();
  await prisma.sugerencia.delete({ where: { id } });
  redirect("/admin/sugerencias");
}

// ── DOCUMENTOS ──

export async function subirDocumento(fd: FormData) {
  await requireAdmin();
  const archivo = fd.get("archivo") as File | null;
  const nombre = String(fd.get("nombre") ?? "").trim();
  const categoria = String(fd.get("categoria") ?? "").trim();

  if (!nombre || !categoria) return;

  let contenido: Uint8Array<ArrayBuffer> | undefined;
  let mimeType = "";
  let nombreArchivo = "";
  let tamano = "";

  if (archivo && archivo.size > 0) {
    const bytes = await archivo.arrayBuffer() as ArrayBuffer;
    contenido = new Uint8Array(bytes);
    mimeType = archivo.type || "application/octet-stream";
    nombreArchivo = archivo.name;
    tamano = archivo.size < 1024 * 1024
      ? `${Math.round(archivo.size / 1024)} KB`
      : `${(archivo.size / (1024 * 1024)).toFixed(1)} MB`;
  }

  await prisma.documento.create({
    data: { nombre, categoria, contenido, mimeType, nombreArchivo, tamano },
  });
  revalidatePath("/");
  redirect("/admin/documentos");
}

export async function eliminarDocumento(id: number) {
  await requireAdmin();
  await prisma.documento.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin/documentos");
}

// ── FINANZAS ──

export async function crearFinanza(fd: FormData) {
  await requireAdmin();
  await prisma.finanzaResumen.create({
    data: {
      mes: String(fd.get("mes")),
      anio: Number(fd.get("anio")),
      saldo: Number(fd.get("saldo")),
      ingresos: Number(fd.get("ingresos")),
      gastos: Number(fd.get("gastos")),
      familiasTotales: Number(fd.get("familiasTotales")),
      familiasPagadas: Number(fd.get("familiasPagadas")),
    },
  });
  revalidatePath("/");
  redirect("/admin/finanzas");
}

export async function actualizarFinanza(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  await prisma.finanzaResumen.update({
    where: { id },
    data: {
      mes: String(fd.get("mes")),
      anio: Number(fd.get("anio")),
      saldo: Number(fd.get("saldo")),
      ingresos: Number(fd.get("ingresos")),
      gastos: Number(fd.get("gastos")),
      familiasTotales: Number(fd.get("familiasTotales")),
      familiasPagadas: Number(fd.get("familiasPagadas")),
    },
  });
  revalidatePath("/");
  redirect("/admin/finanzas");
}

export async function eliminarFinanza(id: number) {
  await requireAdmin();
  await prisma.gastoItem.deleteMany({ where: { finanzaId: id } });
  await prisma.finanzaResumen.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin/finanzas");
}

export async function agregarGastoItem(fd: FormData) {
  await requireAdmin();
  await prisma.gastoItem.create({
    data: {
      nombre: String(fd.get("nombre")),
      monto: Number(fd.get("monto")),
      porcentaje: Number(fd.get("porcentaje")),
      finanzaId: Number(fd.get("finanzaId")),
    },
  });
  revalidatePath("/");
  redirect("/admin/finanzas");
}

export async function eliminarGastoItem(id: number) {
  await requireAdmin();
  await prisma.gastoItem.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin/finanzas");
}

// ── DIRECTIVA ──

export async function crearMiembro(fd: FormData) {
  await requireAdmin();
  const foto = fd.get("foto") as File | null;
  let fotoUrl = "";
  if (foto && foto.size > 0) {
    fotoUrl = await subirFoto(foto);
  }
  const last = await prisma.directivaMiembro.findFirst({ orderBy: { orden: "desc" } });
  await prisma.directivaMiembro.create({
    data: {
      nombre:    String(fd.get("nombre")),
      cargo:     String(fd.get("cargo")),
      iniciales: String(fd.get("iniciales")).toUpperCase().slice(0, 3),
      color:     String(fd.get("color")),
      telefono:  String(fd.get("telefono")),
      fotoUrl,
      orden: (last?.orden ?? 0) + 1,
    },
  });
  revalidatePath("/");
  redirect("/admin/directiva");
}

export async function actualizarMiembro(fd: FormData) {
  await requireAdmin();
  const id = Number(fd.get("id"));
  const foto = fd.get("foto") as File | null;

  // Si sube una foto nueva, reemplaza la anterior en Cloudinary
  let fotoUrl: string | undefined;
  if (foto && foto.size > 0) {
    const existing = await prisma.directivaMiembro.findUnique({ where: { id }, select: { fotoUrl: true } });
    if (existing?.fotoUrl) await eliminarFoto(existing.fotoUrl);
    fotoUrl = await subirFoto(foto);
  }

  await prisma.directivaMiembro.update({
    where: { id },
    data: {
      nombre:    String(fd.get("nombre")),
      cargo:     String(fd.get("cargo")),
      iniciales: String(fd.get("iniciales")).toUpperCase().slice(0, 3),
      color:     String(fd.get("color")),
      telefono:  String(fd.get("telefono")),
      ...(fotoUrl !== undefined && { fotoUrl }),
    },
  });
  revalidatePath("/");
  redirect("/admin/directiva");
}

export async function eliminarMiembro(id: number) {
  await requireAdmin();
  const m = await prisma.directivaMiembro.findUnique({ where: { id }, select: { fotoUrl: true } });
  if (m?.fotoUrl) await eliminarFoto(m.fotoUrl);
  await prisma.directivaMiembro.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin/directiva");
}

// ── DONACIONES ──

export async function guardarDonacionConfig(fd: FormData) {
  await requireAdmin();
  const data = {
    tieneCuenta:     fd.get("tieneCuenta") === "on",
    banco:           String(fd.get("banco")           ?? "").trim(),
    tipoCuenta:      String(fd.get("tipoCuenta")      ?? "").trim(),
    numeroCuenta:    String(fd.get("numeroCuenta")    ?? "").trim(),
    titular:         String(fd.get("titular")         ?? "").trim(),
    whatsappConfirm: String(fd.get("whatsappConfirm") ?? "").trim(),
    itemsNecesarios: String(fd.get("itemsNecesarios") ?? "").trim(),
    lugarEntrega:    String(fd.get("lugarEntrega")    ?? "").trim(),
    horarioEntrega:  String(fd.get("horarioEntrega")  ?? "").trim(),
    contactoEspecie: String(fd.get("contactoEspecie") ?? "").trim(),
  };

  const existing = await prisma.donacionConfig.findFirst();
  if (existing) {
    await prisma.donacionConfig.update({ where: { id: existing.id }, data });
  } else {
    await prisma.donacionConfig.create({ data });
  }
  revalidatePath("/");
  redirect("/admin/donaciones");
}

// ── INTERNAL ──

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (session !== process.env.ADMIN_PASSWORD) {
    throw new Error("No autorizado");
  }
}
