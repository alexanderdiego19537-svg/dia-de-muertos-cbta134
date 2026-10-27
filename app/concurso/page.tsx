import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import ConcursoSection from '@/components/ConcursoSection';

export const metadata: Metadata = {
  title: 'Concurso de Ofrendas — CBTA #134',
  description: 'Convocatoria oficial del Concurso de Ofrendas del Centro de Bachillerato Tecnológico Agropecuario No. 134. Honrando nuestras raíces, celebramos la vida.',
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
