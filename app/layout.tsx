import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GESTION DE NOTAS",
  description: "Plataforma para la Gestión de Notas de Emilio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-custom antialiased bg-gradient-to-r from-grayPrimary to-graySecondary text-neonGreen`}
      >
        <header className="p-6 bg-forestGreen text-graySecondary shadow-lg">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-wider">
              Gestión de Notas
            </h1>
            <p className="text-lg mt-2">
              Organiza tus Notas de Forma Eficiente con Estilo :D
            </p>
          </div>
        </header>
        <main className="p-8 container mx-auto bg-gray-800 rounded-lg shadow-xl">
          {children}
        </main>
        <footer className="p-4 bg-grayPrimary text-gray-300 text-center mt-6">
          <p className="text-sm font-light">
            &copy; {new Date().getFullYear()} Gestión de Notas de Emilio. Todos
            los derechos reservados.
          </p>
        </footer>
      </body>
    </html>
  );
}
