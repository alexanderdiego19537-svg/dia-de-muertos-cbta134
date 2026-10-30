import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import GaleriaClient from './GaleriaClient';

export const metadata: Metadata = {
  title: 'Galería — CBTA #134',
};

export default function GaleriaPage() {
  return (
    <PageLayout
      prevPage={{ href: '/concurso', label: 'Concurso' }}
      nextPage={{ href: '/ubicacion', label: 'Ubicación' }}
    >
      <GaleriaClient />
    </PageLayout>
  );
}
