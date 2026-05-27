import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Junta de Vecinos — Sector San Antonio, San Gregorio de Nigua",
  description:
    "Portal comunitario oficial para los residentes del Sector San Antonio, San Gregorio de Nigua, Provincia San Cristóbal. Reporta problemas, accede a documentos y mantente informado.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.className}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
