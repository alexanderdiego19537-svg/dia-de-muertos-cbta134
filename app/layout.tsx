import type { Metadata } from "next";
import "./globals.css";
import PetalRain from "@/components/PetalRain";
import VisitorTracker from "@/components/VisitorTracker";

export const metadata: Metadata = {
  title: "Día de Muertos 2026 — CBTA #134 Tetlanhocan, Tlaxcala",
  description:
    "Celebración cultural del Día de Muertos en el Centro de Bachillerato Tecnológico Agropecuario #134 de San Francisco Tetlanhocan, Tlaxcala. Miércoles 28 de octubre de 2026.",
  keywords:
    "Día de Muertos, CBTA 134, CBT 134, Tetlanhocan, Tlaxcala, evento cultural, catrinas, PAEC",
  authors: [{ name: "Diego Alexander Zecua Zecua" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💀</text></svg>",
  },
  openGraph: {
    title: "Día de Muertos 2026 — CBTA #134 Tetlanhocan",
    description: "Celebración cultural del Día de Muertos. Miércoles 28 de octubre, 8 AM – 1 PM. Auditorio de Aquiahuac, Tetlanhocan, Tlaxcala.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body style={{ backgroundColor: "#080208", color: "white", margin: 0, padding: 0 }}>
        {/* Petales de cempasúchil — toda la app, pointer-events:none, no tapa nada */}
        <PetalRain count={38} />
        {/* Registro único de visita por dispositivo */}
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
