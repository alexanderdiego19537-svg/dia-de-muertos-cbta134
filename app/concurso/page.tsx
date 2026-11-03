import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ConcursoSection from '@/components/ConcursoSection';

export const metadata: Metadata = {
  title: 'Concurso de Ofrendas — Entre la Vida y la Muerte · CBTA #134',
  description: 'Convocatoria oficial, bases y exhibición de fotos y videos de ofrendas monumentales del Centro de Bachillerato Tecnológico Agropecuario No. 134.',
};

export default function ConcursoPage() {
  return (
    <PageLayout
      prevPage={{ href: '/programa', label: 'Programa' }}
      nextPage={{ href: '/galeria', label: 'Galería' }}
    >
      <ConcursoSection standalone />
    </PageLayout>
  );
}
