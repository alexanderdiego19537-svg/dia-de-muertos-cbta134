import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ProgramaSection from '@/components/ProgramaSection';

export const metadata: Metadata = {
  title: 'Programa del Festival — CBTA #134',
  description: 'Programa oficial del Festival Entre la Vida y la Muerte, CBTA #134, 28 de Octubre en el Auditorio de Aquiahuac.',
};

export default function ProgramaPage() {
  return (
    <PageLayout
      prevPage={{ href: '/quienes-somos', label: 'Quiénes Somos' }}
      nextPage={{ href: '/galeria', label: 'Galería' }}
    >
      <ProgramaSection standalone />
    </PageLayout>
  );
}
