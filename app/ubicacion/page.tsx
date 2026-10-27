import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import LocationSection from '@/components/LocationSection';

export const metadata: Metadata = {
  title: 'Ubicación — CBTA #134 Tetlanhocan',
};

export default function UbicacionPage() {
  return (
    <PageLayout
      prevPage={{ href: '/galeria', label: 'Galería' }}
      showFooter
    >
      <LocationSection standalone />
    </PageLayout>
  );
}
