'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Code2, Database, GitBranch, CheckCircle2 } from 'lucide-react';

interface AuthorsSectionProps {
  standalone?: boolean;
}

const AUTORES = [
  {
    nombre: 'Diego Alexander Zecua Zecua',
    rol: 'Desarrollador Full-Stack & UI/UX',
    tag: 'Desarrollo & Diseño',
    icon: Code2,
    color: '#F97316',
    semestre: '5to Semestre "A" · Programación',
    descripcion:
      'Diseño y desarrollo de la arquitectura web frontend (Next.js 16, React 19, TypeScript) e integración backend con Supabase (Base de datos PostgreSQL, Auth, RLS y Storage).',
    aportes: [
      'Arquitectura de componentes y responsive design',
      'Integración de base de datos, Storage y seguridad RLS',
      'Desarrollo del panel de control de administración',
      'Despliegue y configuración CI/CD en Vercel',
    ],
  },
  {
    nombre: 'Milca Antonio',
    rol: 'Analista de Sistemas & Documentación',
    tag: 'Análisis & Modelado',
    icon: Database,
    color: '#EAB308',
    semestre: '5to Semestre "A" · Programación',
    descripcion:
      'Análisis de requerimientos de software y elaboración del reporte documental del proyecto bajo metodología Scrum. Modelado conceptual de la estructura de datos.',
    aportes: [
      'Elaboración del reporte técnico del proyecto (Scrum)',
      'Diseño de diagramas Entidad-Relación (E-R)',
      'Levantamiento y especificación de requerimientos',
      'Documentación de pruebas y casos de uso',
    ],
  },
  {
    nombre: 'Guadalupe',
    rol: 'Scrum Master & Arquitectura',
    tag: 'Gestión Ágil & Diseño',
    icon: GitBranch,
    color: '#A855F7',
    semestre: '5to Semestre "A" · Programación',
    descripcion:
      'Coordinación ágil del equipo como Scrum Master. Co-elaboración del reporte documental, diagramación de arquitectura de frameworks y colaboración en el diseño visual.',
    aportes: [
      'Facilitación de sprints y coordinación del equipo (Scrum)',
      'Co-elaboración y validación del reporte de proyecto',
      'Diagramas de arquitectura funcional y de frameworks',
      'Colaboración en diseño visual y armonía de interfaz',
    ],
  },
];

export default function AuthorsSection({ standalone = false }: AuthorsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id="autores"
      ref={ref}
      style={{
        backgroundColor: '#080208',
        padding: standalone ? 'clamp(32px, 5vw, 64px) clamp(16px, 4vw, 32px)' : '72px 20px',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
      }}
    >
      {/* Luz tenue de fondo */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '50%', borderRadius: '50%', filter: 'blur(160px)', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Encabezado discreto ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 48px)' }}
        >
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11,
            color: 'rgba(249,115,22,0.7)',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 8,
          }}>
            // Créditos & Desarrollo
          </span>

          <h1 style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 800,
            fontSize: 'clamp(24px, 4vw, 40px)',
            color: 'white',
            margin: '0 0 6px',
            lineHeight: 1.2,
          }}>
            Autores del Proyecto
          </h1>

          <p style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 'clamp(11px, 1.8vw, 12px)',
            color: 'rgba(255,255,255,0.45)',
            margin: '0 0 16px',
          }}>
            CBTA #134 · 5to Semestre Grupo &quot;A&quot; · Especialidad Técnico en Programación
          </p>

          <p style={{
            fontSize: 'clamp(13px, 1.6vw, 14px)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 680,
            margin: '0 auto',
            textAlign: 'center',
          }}>
            Proyecto colaborativo de desarrollo de software realizado en el marco del Programa Aula-Escuela-Comunidad (PAEC 2026), aplicando metodologías ágiles y tecnologías web modernas.
          </p>
        </motion.div>

        {/* ── Tarjetas discretas de los autores ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(260px, 30%, 340px), 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          {AUTORES.map((autor, idx) => {
            const Icon = autor.icon;
            return (
              <motion.div
                key={autor.nombre}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.1 + idx * 0.08 }}
                style={{
                  padding: '24px 22px',
                  borderRadius: 18,
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.25s, background 0.25s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(249,115,22,0.3)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.035)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={16} color={autor.color} />
                    </div>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                      color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.03)',
                      padding: '2px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.06)',
                    }}>
                      {autor.tag}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'Cinzel, serif', fontWeight: 700,
                    fontSize: 16, color: 'white', margin: '0 0 2px', lineHeight: 1.3,
                  }}>
                    {autor.nombre}
                  </h3>

                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    color: autor.color, margin: '0 0 12px', fontWeight: 500,
                  }}>
                    {autor.rol}
                  </p>

                  <p style={{
                    fontSize: 12.5, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 14px',
                    textAlign: 'justify', textJustify: 'inter-word',
                  }}>
                    {autor.descripcion}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, marginBottom: 4 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                      color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em',
                      display: 'block', marginBottom: 6,
                    }}>
                      Contribuciones:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {autor.aportes.map((aporte, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                          <CheckCircle2 size={12} color="rgba(249,115,22,0.7)" style={{ marginTop: 3, flexShrink: 0 }} />
                          <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                            {aporte}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10, marginTop: 14,
                  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)',
                }}>
                  {autor.semestre}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Nota institucional sobria al pie ── */}
        <div style={{
          padding: '16px 20px',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.015)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Image
              src="/images/logo-cbta.png"
              alt="CBTA #134"
              width={32}
              height={32}
              style={{ opacity: 0.6 }}
            />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              Centro de Bachillerato Tecnológico Agropecuario No. 134 · San Francisco Tetlanhocan, Tlaxcala
            </span>
          </div>

          <span style={{
            fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
            color: 'rgba(249,115,22,0.65)', letterSpacing: '0.05em',
          }}>
            Actividad PAEC 2026
          </span>
        </div>

      </div>
    </section>
  );
}
