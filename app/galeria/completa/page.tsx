import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Galería Completa — CBTA #134',
};

const photos = [
  { src: '/images/catrina-candle.jpg', alt: 'Catrina con vela', caption: 'Catrina tradicional con vela' },
  { src: '/images/catrina-dress.jpg',  alt: 'Traje de catrina',  caption: 'Traje tradicional de catrina' },
  { src: '/images/catrina-roses.jpg',  alt: 'Catrina con rosas', caption: 'Catrina con flores de cempasúchil' },
];

export default function GaleriaCompletaPage() {
  return (
    <PageLayout prevPage={{ href: '/galeria', label: 'Galería' }}>
      <div style={{
        padding: 'clamp(32px,5vw,64px) clamp(16px,5vw,48px)',
        backgroundColor: '#080208',
        minHeight: '70vh',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(28px,4vw,48px)' }}>
            <h1 style={{
              fontFamily: 'Cinzel, serif', fontWeight: 900,
              fontSize: 'clamp(26px,5vw,56px)',
              color: 'white', margin: '0 0 10px',
            }}>
              Galería Completa
            </h1>
            <p style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(10px,2vw,12px)',
              color: 'rgba(249,115,22,0.6)',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              margin: 0,
            }}>
              Festival Entre la Vida y la Muerte — CBTA #134
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(160px, 28vw, 340px), 1fr))',
            gap: 'clamp(12px,2vw,20px)',
          }}>
            {photos.map((photo, i) => (
              <div key={i} style={{
                position: 'relative', borderRadius: 'clamp(10px,2vw,16px)',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                aspectRatio: '3/4',
              }}>
                <Image src={photo.src} alt={photo.alt} fill style={{ objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: 'clamp(16px,3vw,24px) clamp(12px,2vw,16px) clamp(12px,2vw,16px)',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                }}>
                  <p style={{
                    margin: 0, fontFamily: 'Inter, sans-serif',
                    fontSize: 'clamp(12px,2vw,14px)',
                    color: 'rgba(255,255,255,0.85)',
                  }}>
                    {photo.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            textAlign: 'center', marginTop: 'clamp(28px,4vw,48px)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(10px,1.8vw,11px)',
            color: 'rgba(255,255,255,0.2)',
          }}>
            Más fotografías se agregarán tras el evento del 28 de octubre.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
