import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import AuthorsSection from '@/components/AuthorsSection';

export const metadata: Metadata = {
  title: 'Autores y Desarrolladores — CBTA #134 Tetlanhocan',
  description: 'Equipo de desarrollo y autores del sitio web oficial del Festival Entre la Vida y la Muerte. Alumnos del 5to Semestre "A" de Técnico en Programación del CBTA #134.',
};

export default function AutoresPage() {
  return (
    <PageLayout
      prevPage={{ href: '/ubicacion', label: 'Ubicación' }}
      nextPage={{ href: '/', label: 'Inicio' }}
      showFooter
    >
      <AuthorsSection standalone />
    </PageLayout>
  );
}
