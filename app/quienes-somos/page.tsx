import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import AboutSection from '@/components/AboutSection';

export const metadata: Metadata = {
  title: 'Quiénes Somos — CBTA #134 Tetlanhocan',
};

export default function QuienesSomosPage() {
  return (
    <PageLayout
      prevPage={{ href: '/', label: 'Inicio' }}
      nextPage={{ href: '/programa', label: 'Programa' }}
    >
      <AboutSection standalone />
    </PageLayout>
  );
}
