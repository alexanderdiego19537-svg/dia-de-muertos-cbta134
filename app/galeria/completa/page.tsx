import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import GaleriaClient from '../GaleriaClient';

export const metadata: Metadata = {
  title: 'Galería Completa — CBTA #134',
  description: 'Colección fotográfica completa del Festival Entre la Vida y la Muerte, concursos de ofrendas, desfiles y altares.',
};

export default function GaleriaCompletaPage() {
  return (
    <PageLayout
      prevPage={{ href: '/programa', label: 'Programa' }}
      nextPage={{ href: '/ubicacion', label: 'Ubicación' }}
      showFooter
    >
      <GaleriaClient />
    </PageLayout>
  );
}
