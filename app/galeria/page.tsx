import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import GallerySection from '@/components/GallerySection';

export const metadata: Metadata = {
  title: 'Galería — CBTA #134',
};

export default function GaleriaPage() {
  return (
    <PageLayout
      prevPage={{ href: '/concurso', label: 'Concurso' }}
      nextPage={{ href: '/ubicacion', label: 'Ubicación' }}
    >
      <GallerySection standalone showViewAll />
    </PageLayout>
  );
}
