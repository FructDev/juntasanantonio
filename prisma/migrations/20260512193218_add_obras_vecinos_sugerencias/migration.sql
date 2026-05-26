-- CreateTable
CREATE TABLE "Obra" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'EN_CURSO',
    "costo" REAL,
    "inicio" DATETIME,
    "fin" DATETIME,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Vecino" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "cedula" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "calle" TEXT NOT NULL,
    "numero" TEXT NOT NULL DEFAULT '',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Cuota" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "vecinoId" INTEGER NOT NULL,
    "mes" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "pagado" BOOLEAN NOT NULL DEFAULT false,
    "fechaPago" DATETIME,
    "monto" REAL NOT NULL DEFAULT 500,
    CONSTRAINT "Cuota_vecinoId_fkey" FOREIGN KEY ("vecinoId") REFERENCES "Vecino" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sugerencia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Cuota_vecinoId_mes_anio_key" ON "Cuota"("vecinoId", "mes", "anio");
