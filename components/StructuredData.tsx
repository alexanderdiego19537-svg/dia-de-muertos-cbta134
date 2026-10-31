export default function StructuredData() {
  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Festival Cultural Entre la Vida y la Muerte 2026 — CBTA #134',
    description:
      'Celebración cultural y concurso de Día de Muertos del CBTA #134 en San Francisco Tetlanohcan, Tlaxcala. Desfile de contingentes, pasarela de Catrinas y Catrines, y exhibición de ofrendas tradicionales.',
    startDate: '2026-10-28T08:00:00-06:00',
    endDate: '2026-10-28T13:30:00-06:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Auditorio de Aquiahuac',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Barrio de Aquiahuac',
        addressLocality: 'San Francisco Tetlanohcan',
        addressRegion: 'Tlaxcala',
        postalCode: '90840',
        addressCountry: 'MX',
      },
    },
    image: ['https://dia-de-muertos-cbta134.vercel.app/images/catrina-candle.jpg'],
    organizer: {
      '@type': 'EducationalOrganization',
      name: 'Centro de Bachillerato Tecnológico Agropecuario No. 134 (CBTA #134)',
      url: 'https://dia-de-muertos-cbta134.vercel.app',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'MXN',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-10-01T00:00:00-06:00',
    },
  };

  const schoolSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'CBTA #134 San Francisco Tetlanohcan',
    alternateName: 'Centro de Bachillerato Tecnológico Agropecuario No. 134',
    url: 'https://dia-de-muertos-cbta134.vercel.app',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'San Francisco Tetlanohcan',
      addressRegion: 'Tlaxcala',
      addressCountry: 'MX',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />
    </>
  );
}
