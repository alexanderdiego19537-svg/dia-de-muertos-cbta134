import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { Scale, BookOpen, Users, AlertCircle, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso — CBTA #134 Tetlanhocan',
  description:
    'Términos y condiciones de uso del sitio web oficial del Festival Entre la Vida y la Muerte 2026 del CBTA #134 en San Francisco Tetlanohcan, Tlaxcala.',
};

export default function TerminosPage() {
  return (
    <PageLayout
      prevPage={{ href: '/privacidad', label: 'Privacidad' }}
      nextPage={{ href: '/', label: 'Inicio' }}
      showFooter
    >
      <main style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(32px, 5vw, 64px) 24px', color: 'white', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Cabecera */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316',
            marginBottom: 16,
          }}>
            <Scale size={14} />
            <span>Condiciones de Uso Comunitario · PAEC 2026</span>
          </div>

          <h1 style={{
            fontFamily: 'Cinzel, serif',
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 800,
            lineHeight: 1.2,
            margin: '0 0 16px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(255,255,255,0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Términos y Condiciones de Uso
          </h1>

          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            color: 'rgba(249,115,22,0.8)',
            margin: 0,
            letterSpacing: '0.05em',
          }}>
            Festival Cultural «Entre la Vida y la Muerte» · CBTA #134 Tetlanohcan
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Vigencia: Ciclo Escolar 2026-2027 · San Francisco Tetlanohcan, Tlaxcala
          </p>
        </div>

        {/* Resumen de Principios */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 16,
          marginBottom: 44,
        }}>
          <div style={{
            padding: 20, borderRadius: 16,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <BookOpen size={18} color="#F97316" />
              <strong style={{ fontSize: 14 }}>Proyecto Escolar PAEC</strong>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>
              Desarrollado con orgullo por estudiantes de Programación para promover las tradiciones locales de Tetlanohcan.
            </p>
          </div>

          <div style={{
            padding: 20, borderRadius: 16,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Users size={18} color="#34D399" />
              <strong style={{ fontSize: 14 }}>Convivencia Respetuosa</strong>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>
              Espacio abierto y seguro para familias, alumnos y visitantes de honor de la comunidad de Tlaxcala.
            </p>
          </div>

          <div style={{
            padding: 20, borderRadius: 16,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <ShieldCheck size={18} color="#60A5FA" />
              <strong style={{ fontSize: 14 }}>Propiedad Estudiantil</strong>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>
              Reconocimiento pleno de autoría académica y cultural a los alumnos participantes y docentes asesores.
            </p>
          </div>
        </div>

        {/* Contenido de los Términos */}
        <div style={{
          backgroundColor: 'rgba(12, 5, 12, 0.75)',
          border: '1px solid rgba(249,115,22,0.2)',
          borderRadius: 20,
          padding: 'clamp(20px, 4vw, 40px)',
          lineHeight: 1.8,
          fontSize: 14,
          color: 'rgba(255,255,255,0.85)',
          textAlign: 'justify',
        }}>
          {/* 1 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            1. Aceptación de los Términos
          </h2>
          <p style={{ margin: '0 0 24px' }}>
            El acceso, navegación y uso de esta plataforma web oficial del Festival «Entre la Vida y la Muerte 2026» atribuye la condición de usuario a quien lo realice, e implica la aceptación plena de los presentes Términos y Condiciones. Si no estuviera de acuerdo con alguno de los puntos aquí expuestos, deberá abstenerse de utilizar el sitio.
          </p>

          {/* 2 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            2. Objeto y Carácter del Sitio
          </h2>
          <p style={{ margin: '0 0 24px' }}>
            Este portal ha sido creado con fines exclusivamente culturales, educativos y comunitarios dentro del Proyecto Académico de Educación Comunitaria (PAEC) del <strong>Centro de Bachillerato Tecnológico Agropecuario No. 134</strong>. Su objetivo es difundir la celebración del Día de Muertos en San Francisco Tetlanohcan, exhibir las ofrendas y disfraces del concurso escolar, y mantener informada a la comunidad estudiantil y a sus familias sobre el cronograma oficial del evento.
          </p>

          {/* 3 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            3. Reglas de Conducta y Uso Aceptable
          </h2>
          <p style={{ margin: '0 0 10px' }}>
            Al interactuar con las funciones públicas del portal (incluyendo comentarios, reacciones y libro conmemorativo), el usuario se compromete a:
          </p>
          <ul style={{ margin: '0 0 14px', paddingLeft: 24 }}>
            <li>Mantener un tono de respeto irrestricto hacia la memoria de los difuntos, los altares tradicionales y la comunidad educativa.</li>
            <li>No publicar mensajes que contengan lenguaje discriminatorio, violento, obsceno o que vulneren los derechos humanos.</li>
            <li>No realizar publicidad comercial no autorizada, venta de productos, enlaces sospechosos ni proselitismo político o electoral.</li>
            <li>No introducir software malicioso, virus informáticos o intentar vulnerar la infraestructura del portal escolar.</li>
          </ul>
          <p style={{ margin: '0 0 24px', fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            * El equipo de administración escolar y moderación se reserva el derecho de retirar de forma inmediata cualquier comentario que contravenga estas disposiciones.
          </p>

          {/* 4 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            4. Propiedad Intelectual y Créditos Estudiantiles
          </h2>
          <p style={{ margin: '0 0 24px' }}>
            El diseño visual, código fuente, interfaz interactiva, animaciones y elementos estructurales del portal fueron desarrollados por el equipo de alumnos del 5to Semestre Grupo «A» de la especialidad de Técnico en Programación: <strong>Diego Alexander</strong> (Desarrollador), <strong>Milca Antonio</strong> (Scrum Master) y <strong>Guadalupe</strong> (Product Owner). Todo el material gráfico, fotografías de ofrendas y videos de presentaciones pertenecen a sus autores correspondientes y se exhiben con fines de fomento cívico-cultural escolar. Queda prohibida su explotación comercial con fines de lucro sin consentimiento expreso por escrito del plantel.
          </p>

          {/* 5 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            5. Exclusión de Responsabilidad
          </h2>
          <p style={{ margin: '0 0 24px' }}>
            El CBTA #134 realiza sus mejores esfuerzos para garantizar la disponibilidad continua y la exactitud de la información contenida en el portal. No obstante, no garantiza la ausencia total de interrupciones técnicas derivadas de proveedores externos de alojamiento en la nube, contingencias climáticas en la red local o modificaciones de último momento en el programa oficial del evento causadas por fuerza mayor.
          </p>

          {/* 6 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            6. Legislación Aplicable y Jurisdicción
          </h2>
          <p style={{ margin: 0 }}>
            Para la interpretación, cumplimiento y resolución de cualquier controversia que pudiera derivarse del uso de este portal web, las partes se someten expresamente a las leyes federales de los Estados Unidos Mexicanos y a los tribunales competentes de la ciudad de Tlaxcala de Xicohténcatl, Tlaxcala, renunciando a cualquier otro fuero que por razón de domicilio presente o futuro pudiera corresponderles.
          </p>
        </div>

        {/* Enlace de regreso a Privacidad y a Inicio */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 36, flexWrap: 'wrap' }}>
          <Link
            href="/privacidad"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              padding: '8px 18px', borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <ArrowLeft size={14} color="#F97316" />
            <span>Consultar Aviso de Privacidad</span>
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'white', textDecoration: 'none',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              padding: '8px 18px', borderRadius: 999,
              border: '1px solid rgba(249,115,22,0.4)',
              background: 'rgba(249,115,22,0.1)',
            }}
          >
            <span>Volver al Inicio</span>
            <ArrowRight size={14} color="#F97316" />
          </Link>
        </div>

      </main>
    </PageLayout>
  );
}
