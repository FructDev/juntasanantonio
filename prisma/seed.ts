import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Directiva
  await prisma.directivaMiembro.deleteMany();
  await prisma.directivaMiembro.createMany({
    data: [
      { nombre: "Juan Pérez Martínez", cargo: "Presidente", iniciales: "JP", color: "azul", telefono: "(809) 123-4567", orden: 1 },
      { nombre: "María García López", cargo: "Vicepresidenta", iniciales: "MG", color: "rojo", telefono: "(809) 123-4568", orden: 2 },
      { nombre: "Carlos Rodríguez", cargo: "Secretario", iniciales: "CR", color: "cielo", telefono: "(809) 123-4569", orden: 3 },
      { nombre: "Ana Marte Sánchez", cargo: "Tesorera", iniciales: "AM", color: "cielo", telefono: "(809) 123-4570", orden: 4 },
      { nombre: "Rafael Díaz Núñez", cargo: "Vocal", iniciales: "RD", color: "cielo", telefono: "(809) 123-4571", orden: 5 },
    ],
  });

  // Avisos
  await prisma.aviso.deleteMany();
  await prisma.aviso.createMany({
    data: [
      { titulo: "Corte de agua — Viernes 9 de mayo", descripcion: "INAPA realizará trabajos de mantenimiento en la red principal. El servicio se restablecerá a las 4pm. Se recomienda almacenar agua previamente.", tipo: "URGENTE", fecha: new Date("2025-05-05") },
      { titulo: "Asamblea ordinaria — Sábado 17 de mayo", descripcion: "Reunión a las 7pm en el salón comunitario. Agenda: presupuesto 2025, obras de la cañada y elección de vocal.", tipo: "ASAMBLEA", fecha: new Date("2025-04-28") },
      { titulo: "Operativo de recogida de escombros", descripcion: "El Ayuntamiento Municipal pasará el miércoles 7 de mayo. Sacar materiales la noche anterior.", tipo: "INFORMACION", fecha: new Date("2025-04-20") },
      { titulo: "Reparación del alumbrado — Calle 3", descripcion: "EDES-SUR confirmó que la reparación de las 4 lámparas apagadas se realizará en los próximos días hábiles.", tipo: "INFORMACION", fecha: new Date("2025-04-15") },
      { titulo: "Jornada de limpieza comunitaria", descripcion: "Sábado 10 de mayo a las 7am. Limpiaremos las cañadas y puntos de acumulación de basura. Traer guantes.", tipo: "EVENTO", fecha: new Date("2025-04-08") },
      { titulo: "Cañada desbordada — sector bajo", descripcion: "Tras las lluvias del fin de semana la cañada se desbordó. Evitar el área y reportar daños a la directiva.", tipo: "ALERTA", fecha: new Date("2025-04-02") },
    ],
  });

  // Documentos
  await prisma.documento.deleteMany();
  await prisma.documento.createMany({
    data: [
      { nombre: "Acta asamblea ordinaria — Abril 2025", categoria: "ACTA", tamano: "245 KB", fecha: new Date("2025-04-30") },
      { nombre: "Carta al Ayuntamiento — Solicitud reparación cañada sector bajo", categoria: "CARTA", tamano: "180 KB", fecha: new Date("2025-04-15") },
      { nombre: "Estado de caja — Abril 2025", categoria: "FINANZA", tamano: "120 KB", fecha: new Date("2025-05-01") },
      { nombre: "Acta asamblea ordinaria — Marzo 2025", categoria: "ACTA", tamano: "210 KB", fecha: new Date("2025-03-31") },
      { nombre: "Estado de caja — Marzo 2025", categoria: "FINANZA", tamano: "115 KB", fecha: new Date("2025-04-01") },
      { nombre: "Carta a EDES-SUR — Alumbrado calles 3 y 5", categoria: "CARTA", tamano: "95 KB", fecha: new Date("2025-03-10") },
    ],
  });

  // Finanzas
  await prisma.gastoItem.deleteMany();
  await prisma.finanzaResumen.deleteMany();
  const finanza = await prisma.finanzaResumen.create({
    data: { mes: "Mayo", anio: 2025, saldo: 42800, ingresos: 18500, gastos: 12300, familiasTotales: 180, familiasPagadas: 134 },
  });
  await prisma.gastoItem.createMany({
    data: [
      { nombre: "Reparación luminaria calle 3", monto: 4500, porcentaje: 73, finanzaId: finanza.id },
      { nombre: "Limpieza cañada sector bajo", monto: 3200, porcentaje: 52, finanzaId: finanza.id },
      { nombre: "Gestiones administrativas", monto: 2800, porcentaje: 45, finanzaId: finanza.id },
      { nombre: "Papelería y comunicaciones", monto: 1800, porcentaje: 29, finanzaId: finanza.id },
    ],
  });

  // Obras
  await prisma.obra.deleteMany();
  await prisma.obra.createMany({
    data: [
      {
        titulo: "Reparación de cañada — Sector Bajo",
        descripcion: "Limpieza profunda y reparación de los muros de contención de la cañada en el sector bajo del barrio, afectada por lluvias recientes.",
        estado: "COMPLETADA",
        costo: 28000,
        inicio: new Date("2025-01-10"),
        fin: new Date("2025-03-05"),
      },
      {
        titulo: "Alumbrado LED — Calles 3 y 5",
        descripcion: "Sustitución de las luminarias dañadas por tecnología LED de mayor eficiencia en las calles 3 y 5, coordinado con EDES-SUR.",
        estado: "COMPLETADA",
        costo: 15000,
        inicio: new Date("2025-02-15"),
        fin: new Date("2025-04-20"),
      },
      {
        titulo: "Pavimentación Calle 7",
        descripcion: "Asfaltado de los 280 metros lineales de la calle 7 que permanecen en tierra. Gestión ante el Ayuntamiento Municipal de San Cristóbal.",
        estado: "EN_CURSO",
        costo: 85000,
        inicio: new Date("2025-04-01"),
        fin: null,
      },
      {
        titulo: "Parque infantil comunitario",
        descripcion: "Construcción de área recreativa con juegos infantiles en el terreno comunal de la calle Osvaldo Bazil. Pendiente de financiamiento.",
        estado: "PLANIFICADA",
        costo: 120000,
        inicio: null,
        fin: null,
      },
    ],
  });

  // Vecinos
  await prisma.cuota.deleteMany();
  await prisma.vecino.deleteMany();

  const vecinosData = [
    { nombre: "Juan Pérez Martínez",   calle: "Calle 3",  numero: "12",  telefono: "(809) 123-4567" },
    { nombre: "María García López",    calle: "Calle 5",  numero: "4",   telefono: "(809) 234-5678" },
    { nombre: "Carlos Rodríguez",      calle: "Calle 3",  numero: "28",  telefono: "(809) 345-6789" },
    { nombre: "Ana Marte Sánchez",     calle: "Calle 7",  numero: "6",   telefono: "(809) 456-7890" },
    { nombre: "Rafael Díaz Núñez",     calle: "Calle 1",  numero: "15",  telefono: "(809) 567-8901" },
    { nombre: "Carmen Polanco",        calle: "Calle 5",  numero: "33",  telefono: "(809) 678-9012" },
    { nombre: "Luis Almonte",          calle: "Calle 2",  numero: "8",   telefono: "(809) 789-0123" },
    { nombre: "Rosa Inés Jiménez",     calle: "Calle 4",  numero: "22",  telefono: "(809) 890-1234" },
  ];

  const anio = new Date().getFullYear();
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo"];

  for (const v of vecinosData) {
    const vecino = await prisma.vecino.create({ data: v });
    // Random payment history for first 5 months
    const cuotas = meses.map((mes) => ({
      vecinoId: vecino.id,
      mes,
      anio,
      pagado: Math.random() > 0.25,
      monto: 500,
    }));
    for (const c of cuotas) {
      await prisma.cuota.create({
        data: {
          ...c,
          fechaPago: c.pagado ? new Date() : null,
        },
      });
    }
  }

  // Sugerencias
  await prisma.sugerencia.deleteMany();
  await prisma.sugerencia.createMany({
    data: [
      { nombre: "Rosa Jiménez", mensaje: "Sería bueno colocar un espejo vial en la esquina de la calle 3 con la principal. Los carros salen muy rápido y es peligroso.", leido: false },
      { nombre: "Vecino anónimo", mensaje: "Propongo que la asamblea discuta la posibilidad de instalar cámaras en los puntos de mayor inseguridad del barrio.", leido: false },
    ],
  });

  console.log("✅ Seed completado con todos los modelos");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
