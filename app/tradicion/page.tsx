import type { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import TraditionsSection from '@/components/TraditionsSection';

export const metadata: Metadata = {
  title: 'Tradición del Día de Muertos — CBTA #134 Tetlanhocan',
  description: 'Historia, calendario ritual de ánimas, elementos de la ofrenda y cosmovisión del Día de Muertos en México y Tlaxcala.',
};

export default function TradicionPage() {
  return (
    <PageLayout
      prevPage={{ href: '/quienes-somos', label: 'Quiénes Somos' }}
      nextPage={{ href: '/programa', label: 'Programa' }}
    >
      <TraditionsSection standalone />
    </PageLayout>
  );
}
