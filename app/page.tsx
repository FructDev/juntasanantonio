import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickAccess from "@/components/QuickAccess";
import Directiva from "@/components/Directiva";
import Avisos from "@/components/Avisos";
import Obras from "@/components/Obras";
import Gestiones from "@/components/Gestiones";
import Documentos from "@/components/Documentos";
import Finanzas from "@/components/Finanzas";
import Donaciones from "@/components/Donaciones";
import Sugerencias from "@/components/Sugerencias";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import ReportarModal from "@/components/ReportarModal";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <QuickAccess />
        <Directiva />
        <Avisos />
        <Obras />
        <Gestiones />
        <Documentos />
        <Finanzas />
        <Donaciones />
        <Sugerencias />
        <Contacto />
      </main>
      <Footer />
      {/* Modal de reporte — se abre al click de cualquier href="#reportar" */}
      <ReportarModal />
    </>
  );
}
