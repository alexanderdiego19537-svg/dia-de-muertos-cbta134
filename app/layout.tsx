import type { Metadata } from "next";
import "./globals.css";
import PetalRain from "@/components/PetalRain";
import VisitorTracker from "@/components/VisitorTracker";
import EditorBar from "@/components/editor/EditorBar";
import CookieBanner from "@/components/CookieBanner";
import AnunciosBanner from "@/components/AnunciosBanner";
import StructuredData from "@/components/StructuredData";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL && !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://dia-de-muertos-cbta134.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Día de Muertos 2026 — CBTA #134 Tetlanhocan, Tlaxcala",
    template: "%s | CBTA #134 Tetlanhocan",
  },
  description:
    "Celebración cultural del Día de Muertos en el Centro de Bachillerato Tecnológico Agropecuario #134 de San Francisco Tetlanohcan, Tlaxcala. Miércoles 28 de octubre de 2026. Concurso de catrinas, desfile y ofrendas tradicionales.",
  keywords: [
    "Día de Muertos",
    "CBTA 134",
    "CBT 134",
    "Tetlanhocan",
    "Tetlanohcan",
    "Tlaxcala",
    "evento cultural",
    "catrinas",
    "ofrendas",
    "PAEC",
    "Festival Entre la Vida y la Muerte",
  ],
  authors: [{ name: "Diego Alexander" }, { name: "Comité CBTA #134" }],
  creator: "CBTA #134",
  publisher: "CBTA #134 Tetlanhocan",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💀</text></svg>",
  },
  openGraph: {
    title: "Día de Muertos 2026 — CBTA #134 Tetlanhocan",
    description:
      "Celebración cultural del Día de Muertos. Miércoles 28 de octubre, 8:00 AM – 1:30 PM. Auditorio de Aquiahuac, Tetlanhocan, Tlaxcala. Desfile, concurso de catrinas y montaje de ofrendas.",
    url: "/",
    siteName: "CBTA #134 — Festival Día de Muertos 2026",
    images: [
      {
        url: "/images/catrina-candle.jpg",
        width: 1200,
        height: 630,
        alt: "Catrina con vela — Festival CBTA #134",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Día de Muertos 2026 — CBTA #134 Tetlanhocan",
    description:
      "Festival cultural del Día de Muertos en San Francisco Tetlanohcan, Tlaxcala. Desfile, catrinas y ofrendas tradicionales.",
    images: ["/images/catrina-candle.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
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
        {/* Marcado Estructurado Schema.org JSON-LD (Paso 8: SEO) */}
        <StructuredData />
        {/* Google Analytics 4 (activado automáticamente si existe NEXT_PUBLIC_GA_ID) */}
        <GoogleAnalytics />
      </head>
      <body style={{ backgroundColor: "#080208", color: "white", margin: 0, padding: 0 }}>
        {/* Petales de cempasúchil — toda la app, pointer-events:none, no tapa nada */}
        <PetalRain count={24} />
        {/* Registro único de visita por dispositivo */}
        <VisitorTracker />
        {/* Banner de consentimiento legal de cookies LFPDPPP */}
        <CookieBanner />
        {/* Banner superior de avisos y anuncios oficiales */}
        <AnunciosBanner />
        {/* Barra de herramientas para editores en la misma página */}
        <EditorBar />
        {children}
      </body>
    </html>
  );
}
