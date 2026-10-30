import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, CheckCircle2, AlertTriangle, ArrowRight, Mail } from 'lucide-react';
import CookiePreferencesButton from '@/components/CookiePreferencesButton';

export const metadata: Metadata = {
  title: 'Aviso de Privacidad Integral — CBTA #134 Tetlanhocan',
  description:
    'Aviso de Privacidad Integral del portal oficial del Festival Entre la Vida y la Muerte 2026, emitido conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).',
};

export default function PrivacidadPage() {
  return (
    <PageLayout
      prevPage={{ href: '/', label: 'Inicio' }}
      nextPage={{ href: '/terminos', label: 'Términos y Condiciones' }}
      showFooter
    >
      <main style={{ maxWidth: 960, margin: '0 auto', padding: ' clamp(32px, 5vw, 64px) 24px', color: 'white', fontFamily: 'Inter, sans-serif' }}>
        
        {/* Cabecera de la página */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 999,
            background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#34D399',
            marginBottom: 16,
          }}>
            <Shield size={14} />
            <span>Marco Legal Mexicano · LFPDPPP</span>
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
            Aviso de Privacidad Integral
          </h1>

          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 12,
            color: 'rgba(249,115,22,0.8)',
            margin: 0,
            letterSpacing: '0.05em',
          }}>
            Portal Cultural del Festival «Entre la Vida y la Muerte» · CBTA #134
          </p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            Última actualización legal: Octubre de 2026 · San Francisco Tetlanohcan, Tlaxcala
          </p>
        </div>

        {/* Resumen ejecutivo de garantías */}
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
              <Lock size={18} color="#F97316" />
              <strong style={{ fontSize: 14 }}>Sin Fines Comerciales</strong>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>
              Plataforma 100% educativa y cultural escolar. No vendemos, no rentamos ni cedemos tus datos a anunciantes.
            </p>
          </div>

          <div style={{
            padding: 20, borderRadius: 16,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Eye size={18} color="#34D399" />
              <strong style={{ fontSize: 14 }}>Analítica Disociada</strong>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>
              Las métricas de visitas son anónimas. No realizamos seguimiento cruzado de navegación entre sitios web.
            </p>
          </div>

          <div style={{
            padding: 20, borderRadius: 16,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Shield size={18} color="#60A5FA" />
              <strong style={{ fontSize: 14 }}>Derechos ARCO</strong>
            </div>
            <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>
              Puedes solicitar en cualquier momento la eliminación o corrección de cualquier foto o comentario donde participes.
            </p>
          </div>
        </div>

        {/* Cuerpo del documento legal */}
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
          {/* Sección 1 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            1. Identidad y Domicilio del Responsable
          </h2>
          <p style={{ margin: '0 0 24px' }}>
            El <strong>Centro de Bachillerato Tecnológico Agropecuario No. 134 (CBTA #134)</strong>, institución pública de educación media superior dependiente de la Dirección General de Educación Tecnológica Agropecuaria y Ciencias del Mar (DGETAyCM), con domicilio ubicado en Carretera a San Francisco Tetlanohcan s/n, Barrio de Aquiahuac, Municipio de San Francisco Tetlanohcan, Tlaxcala, México, Código Postal 90840, es el responsable del uso y protección de sus datos personales tratados con motivo de la difusión y operación del sitio web oficial del Festival Cultural «Entre la Vida y la Muerte 2026».
          </p>

          {/* Sección 2 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            2. Finalidades del Tratamiento de Datos
          </h2>
          <p style={{ margin: '0 0 10px' }}>
            Los datos personales y registros multimedia recabados a través de este portal serán utilizados para las siguientes finalidades:
          </p>
          <ul style={{ margin: '0 0 24px', paddingLeft: 24 }}>
            <li style={{ marginBottom: 8 }}>
              <strong>Finalidades Primarias (Educativas y Culturales):</strong>
              <ul style={{ marginTop: 6 }}>
                <li>Difusión comunitaria del Festival Tradicional del Día de Muertos 2026 y del Proyecto Académico de Educación Comunitaria (PAEC).</li>
                <li>Publicación de fotografías y videocápsulas informativas del Desfile de Catrinas y Concurso de Ofrendas tradicionales.</li>
                <li>Gestión del libro digital de mensajes y memorias del festival.</li>
                <li>Acreditación y reconocimiento institucional al equipo de desarrollo estudiantil del 5° Semestre de Programación.</li>
              </ul>
            </li>
            <li style={{ marginBottom: 8 }}>
              <strong>Finalidades Secundarias:</strong>
              <ul style={{ marginTop: 6 }}>
                <li>Contabilización estadística anonimizada de afluencia digital para evaluar el impacto del proyecto escolar en la comunidad.</li>
              </ul>
            </li>
          </ul>

          {/* Sección 3 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            3. Datos Personales que Recabamos
          </h2>
          <p style={{ margin: '0 0 10px' }}>
            Para llevar a cabo las finalidades descritas, podemos recabar:
          </p>
          <ul style={{ margin: '0 0 14px', paddingLeft: 24 }}>
            <li><strong>Fotografías y videograbaciones públicas:</strong> Capturadas en espacios públicos abiertos durante el desfile escolar y las actividades culturales.</li>
            <li><strong>Nombre o seudónimo voluntario:</strong> Proporcionado voluntariamente por el usuario al redactar un comentario o mensaje conmemorativo.</li>
            <li><strong>Identificador técnico disociado (UUID):</strong> Generado localmente en su dispositivo para prevenir el recuento múltiple de visitas sin vincularlo a su identidad civil.</li>
          </ul>
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)',
            fontSize: 12.5, color: '#A7F3D0', marginBottom: 24,
          }}>
            ✓ <strong>Sin Datos Sensibles:</strong> Esta plataforma <strong>no recaba ni almacena datos personales sensibles</strong> (tales como origen étnico, convicciones religiosas, estado de salud o datos financieros y bancarios).
          </div>

          {/* Sección 4 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            4. Protección Especial a la Privacidad de Menores de Edad
          </h2>
          <p style={{ margin: '0 0 24px' }}>
            En cumplimiento al principio constitucional del interés superior de la niñez y adolescencia, el material fotográfico donde participen estudiantes menores de 18 años tiene fines estrictamente cívicos, pedagógicos y culturales. Cualquier madre, padre, tutor legal o estudiante que desee que una imagen o video sea retirado o modificado, podrá solicitarlo de inmediato mediante el procedimiento ARCO señalado en este aviso, procediéndose a su remoción prioritaria en un lapso no mayor a 24 horas hábiles.
          </p>

          {/* Sección 5 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            5. Transferencia de Datos Personales
          </h2>
          <p style={{ margin: '0 0 24px' }}>
            El CBTA #134 <strong>no realiza transferencias de datos personales</strong> a terceras empresas comerciales, agencias de publicidad, ni intermediarios de mercadotecnia. Los datos técnicos de infraestructura son procesados de forma cifrada mediante proveedores de alojamiento en la nube (Vercel y Supabase) bajo estrictos estándares de seguridad informática y confidencialidad.
          </p>

          {/* Sección 6 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            6. Ejercicio de Derechos ARCO y Revocación del Consentimiento
          </h2>
          <p style={{ margin: '0 0 12px' }}>
            Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (<strong>Acceso</strong>). Asimismo, es su derecho solicitar la corrección de su información en caso de que esté desactualizada, sea inexacta o incompleta (<strong>Rectificación</strong>); que la eliminemos de nuestros registros cuando considere que la misma no está siendo utilizada conforme a los principios legales (<strong>Cancelación</strong>); así como oponerse al uso de sus datos para fines específicos (<strong>Oposición</strong>).
          </p>
          <div style={{
            padding: 18, borderRadius: 12,
            background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.3)',
            marginBottom: 24,
          }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600, color: 'white' }}>
              Para ejercer cualquiera de sus derechos ARCO, favor de comunicarse con la Dirección del Plantel:
            </p>
            <p style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#F97316' }}>
              📧 Correo oficial: <a href="mailto:contacto@cbta134.edu.mx" style={{ color: '#F97316', textDecoration: 'underline' }}>contacto@cbta134.edu.mx</a>
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              Asunto: «Solicitud de Derechos ARCO — Festival Día de Muertos 2026»
            </p>
          </div>

          {/* Sección 7 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            7. Política de Cookies y Tecnologías de Rastreo
          </h2>
          <p style={{ margin: '0 0 12px' }}>
            Le informamos que en este sitio web utilizamos cookies técnicas esenciales (para mantener la sesión segura y las preferencias visuales) y cookies de analítica disociada (para registrar visitas únicas anuales). Puede cambiar o revocar sus preferencias de cookies en cualquier momento pulsando el botón a continuación:
          </p>

          <div style={{ textAlign: 'center', margin: '20px 0 28px' }}>
            <CookiePreferencesButton />
          </div>

          {/* Sección 8 */}
          <h2 style={{ fontFamily: 'Cinzel, serif', fontSize: 18, color: '#F97316', margin: '0 0 10px', fontWeight: 700 }}>
            8. Cambios y Actualizaciones
          </h2>
          <p style={{ margin: 0 }}>
            El presente aviso de privacidad puede sufrir modificaciones derivadas de requerimientos legales o de nuestras propias actividades institucionales. Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir este aviso a través de este mismo portal en su sección legal.
          </p>
        </div>

        {/* Enlace a Términos */}
        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <Link
            href="/terminos"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
              fontFamily: 'JetBrains Mono, monospace', fontSize: 12,
              padding: '8px 18px', borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <span>Consultar Términos y Condiciones de Uso</span>
            <ArrowRight size={14} color="#F97316" />
          </Link>
        </div>

      </main>
    </PageLayout>
  );
}
