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
  applicationName: "Entre la Vida y la Muerte · CBTA #134",
  title: {
    default: "Entre la Vida y la Muerte · CBTA #134 — Festival Día de Muertos 2026",
    template: "%s | Entre la Vida y la Muerte · CBTA #134",
  },
  description:
    "Celebración cultural del Día de Muertos en el Centro de Bachillerato Tecnológico Agropecuario #134 de San Francisco Tetlanohcan, Tlaxcala. Concurso de ofrendas, desfile de catrinas y tradiciones.",
  keywords: [
    "Entre la Vida y la Muerte",
    "CBTA 134",
    "CBT 134",
    "CBTA #134",
    "Día de Muertos",
    "Tetlanhocan",
    "Tetlanohcan",
    "Tlaxcala",
    "evento cultural",
    "concurso de ofrendas",
    "catrinas",
    "ofrendas",
    "PAEC",
    "Festival Entre la Vida y la Muerte",
  ],
  authors: [{ name: "Diego Alexander" }, { name: "Comité CBTA #134" }],
  creator: "CBTA #134",
  publisher: "CBTA #134 Tetlanhocan",
  manifest: "/manifest.json",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Entre la Vida y la Muerte · CBTA #134",
    description:
      "Festival cultural del Día de Muertos en San Francisco Tetlanohcan, Tlaxcala. Concurso de ofrendas, desfile de catrinas, música y altares tradicionales.",
    url: "/",
    siteName: "Entre la Vida y la Muerte · CBTA #134",
    images: [
      {
        url: "/images/og-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Entre la Vida y la Muerte · CBTA #134 — Festival Día de Muertos 2026",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Entre la Vida y la Muerte · CBTA #134",
    description:
      "Festival cultural del Día de Muertos en San Francisco Tetlanohcan, Tlaxcala. Concurso de ofrendas, desfile de catrinas y altares.",
    images: ["/images/og-preview.jpg"],
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
    google: "lCKeR42IO1yUIKCqn8IfQpFXtAxKPeZMem_MDti8OSk",
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
        <meta name="google-site-verification" content="lCKeR42IO1yUIKCqn8IfQpFXtAxKPeZMem_MDti8OSk" />
        <meta name="thumbnail" content="https://dia-de-muertos-cbta134.vercel.app/images/og-preview.jpg" />
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
