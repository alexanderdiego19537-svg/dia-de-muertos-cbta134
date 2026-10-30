'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Code2, Database, Layout, Sparkles, Award, GitBranch, Cpu, CheckCircle2, GraduationCap, Users } from 'lucide-react';

interface AuthorsSectionProps {
  standalone?: boolean;
}

const AUTORES = [
  {
    nombre: 'Diego Alexander Zecua Zecua',
    rol: 'Lead Full-Stack Developer & Diseñador UI/UX',
    badge: '⚡ Arquitectura & Frontend/Backend',
    color: '#F97316',
    avatarEmoji: '👨‍💻',
    semestre: '5to Semestre "A" · Técnico en Programación',
    descripcion:
      'Líder del desarrollo técnico y diseño interactivo de la plataforma web. Responsable de la integración completa entre frontend de última generación y servicios backend en la nube.',
    responsabilidades: [
      'Arquitectura e ingeniería frontend en Next.js 16 con React 19, TypeScript y Tailwind CSS.',
      'Diseño y modelado del backend en Supabase (Base de datos PostgreSQL, RLS, Storage y Auth).',
      'Desarrollo de animaciones 3D, carrusel de profundidad, experiencia visual y responsive design.',
      'Construcción del Panel de Administración con autenticación y despliegue CI/CD en Vercel.',
    ],
    skills: ['Next.js 16', 'React 19', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion', 'Vercel CI/CD'],
  },
  {
    nombre: 'Milca Antonio',
    rol: 'Analista de Sistemas & Documentación Técnica',
    badge: '📊 Análisis & Modelado E-R',
    color: '#EAB308',
    avatarEmoji: '👩‍💼',
    semestre: '5to Semestre "A" · Técnico en Programación',
    descripcion:
      'Encargada de la fase de análisis de sistemas, especificación formal de requerimientos y diseño de datos. Documentó los artefactos y el reporte técnico del proyecto bajo marco Scrum.',
    responsabilidades: [
      'Elaboración integral del reporte documental del proyecto y bitácora técnica de desarrollo.',
      'Modelado conceptual y diseño de diagramas Entidad-Relación (E-R) para la estructura de la base de datos.',
      'Definición de requerimientos funcionales y reglas de negocio para los módulos de la aplicación.',
      'Documentación de casos de uso y gestión de requerimientos bajo metodología ágil.',
    ],
    skills: ['Diagramas E-R', 'Metodología Scrum', 'Análisis de Requerimientos', 'Modelado Relacional', 'Documentación Técnica'],
  },
  {
    nombre: 'Guadalupe',
    rol: 'Scrum Master & Arquitectura de Software',
    badge: '🚀 Gestión Ágil & Arquitectura',
    color: '#A855F7',
    avatarEmoji: '👩‍💻',
    semestre: '5to Semestre "A" · Técnico en Programación',
    descripcion:
      'Responsable de la facilitación y coordinación ágil del equipo como Scrum Master. Diseñó los diagramas de arquitectura funcional y de frameworks, colaborando en el diseño visual.',
    responsabilidades: [
      'Liderazgo y facilitación como Scrum Master: gestión de sprints, entregables y sincronización del equipo.',
      'Co-elaboración del reporte de proyecto y validación de estándares académicos.',
      'Elaboración de diagramas de arquitectura de software y flujo funcional de la plataforma.',
      'Diagramación de la arquitectura de frameworks (Next.js / SSR / Cliente / API) y soporte en diseño visual.',
    ],
    skills: ['Scrum Master', 'Arquitectura de Software', 'Diagramas de Frameworks', 'Diseño UI Conceptual', 'Gestión de Sprints'],
  },
];

const PILARES = [
  {
    icon: GitBranch,
    titulo: 'Metodología Ágil Scrum',
    detalle: 'Gestión organizada por roles, sprints y entregas incrementales funcionales.',
  },
  {
    icon: Database,
    titulo: 'Diagramas E-R y Arquitectura',
    detalle: 'Modelado relacional de datos y diagramación de componentes y frameworks.',
  },
  {
    icon: Code2,
    titulo: 'Full-Stack Moderno',
    detalle: 'Next.js 16 con Turbopack, React 19, TypeScript y Tailwind CSS.',
  },
  {
    icon: Cpu,
    titulo: 'Backend en Supabase & Cloud',
    detalle: 'PostgreSQL administrado con políticas RLS, Storage en la nube y Vercel CI/CD.',
  },
];

export default function AuthorsSection({ standalone = false }: AuthorsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="autores"
      ref={ref}
      style={{
        backgroundColor: '#080208',
        padding: standalone ? 'clamp(32px, 5vw, 64px) clamp(16px, 4vw, 32px)' : '96px 20px',
        position: 'relative',
        overflow: 'hidden',
        color: 'white',
      }}
    >
      {/* ── Luces ambientales de fondo ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 450, height: 450, borderRadius: '50%', filter: 'blur(140px)', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '50%', right: '10%', width: 400, height: 400, borderRadius: '50%', filter: 'blur(130px)', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)' }} />
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ════════════════════════════════════════════════════════════════
            ENCABEZADO DE AUTORES
        ════════════════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'clamp(36px, 6vw, 60px)' }}
        >
          {/* Badge institucional */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '7px 20px', borderRadius: 999,
            border: '1px solid rgba(249,115,22,0.35)',
            background: 'rgba(249,115,22,0.08)',
            marginBottom: 20,
            boxShadow: '0 0 20px rgba(249,115,22,0.15)',
          }}>
            <GraduationCap size={15} color="#F97316" />
            <span style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 'clamp(10px, 1.8vw, 12px)',
              color: '#F97316',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}>
              CBTA #134 · Especialidad Técnico en Programación
            </span>
          </div>

          <h1 style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 900,
            fontSize: 'clamp(28px, 5.5vw, 56px)',
            color: 'white',
            margin: '0 0 8px',
            lineHeight: 1.15,
            textShadow: '0 2px 20px rgba(0,0,0,0.8)',
          }}>
            Equipo de Desarrollo & Autores
          </h1>
          <h2 style={{
            fontFamily: 'Cinzel, serif',
            fontWeight: 800,
            fontSize: 'clamp(18px, 3.2vw, 30px)',
            background: 'linear-gradient(135deg, #F97316 0%, #EAB308 50%, #F97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 20px',
            lineHeight: 1.2,
          }}>
            Alumnos del 5to Semestre Grupo &quot;A&quot;
          </h2>

          <div style={{
            maxWidth: 820,
            margin: '0 auto',
            padding: '20px 24px',
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.025)',
            backdropFilter: 'blur(12px)',
          }}>
            <p style={{
              fontSize: 'clamp(13.5px, 1.8vw, 15px)',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.78)',
              margin: 0,
              textAlign: 'justify',
              textJustify: 'inter-word',
            }}>
              Este proyecto web fue concebido, diseñado y desarrollado de manera colaborativa por estudiantes de la especialidad de <strong style={{ color: '#F97316' }}>Técnico en Programación</strong> del <strong style={{ color: 'white' }}>CBTA #134 de San Francisco Tetlanhocan</strong>, alineado al <strong style={{ color: '#EAB308' }}>Programa Aula-Escuela-Comunidad (PAEC 2026)</strong>. Combina metodologías ágiles de ingeniería de software con la preservación cultural del Día de Muertos.
            </p>
          </div>
        </motion.div>

        {/* ════════════════════════════════════════════════════════════════
            TARJETAS DE LOS TRES AUTORES
        ════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 30%, 370px), 1fr))',
          gap: 24,
          marginBottom: 'clamp(48px, 7vw, 76px)',
        }}>
          {AUTORES.map((autor, idx) => (
            <motion.div
              key={autor.nombre}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + idx * 0.1 }}
              style={{
                position: 'relative',
                padding: '28px 24px',
                borderRadius: 24,
                border: `1px solid ${autor.color}40`,
                background: `linear-gradient(180deg, ${autor.color}0D 0%, rgba(12,5,12,0.95) 100%)`,
                boxShadow: `0 12px 36px rgba(0,0,0,0.6), 0 0 25px ${autor.color}15`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header autor */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 16,
                    background: `${autor.color}20`, border: `1px solid ${autor.color}60`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, flexShrink: 0,
                  }}>
                    {autor.avatarEmoji}
                  </div>
                  <div>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                      color: autor.color, background: `${autor.color}15`,
                      padding: '3px 10px', borderRadius: 999, border: `1px solid ${autor.color}35`,
                      display: 'inline-block', marginBottom: 4, letterSpacing: '0.05em',
                    }}>
                      {autor.badge}
                    </span>
                    <h3 style={{
                      fontFamily: 'Cinzel, serif', fontWeight: 800,
                      fontSize: 'clamp(16px, 2vw, 19px)', color: 'white', margin: 0, lineHeight: 1.25,
                    }}>
                      {autor.nombre}
                    </h3>
                  </div>
                </div>

                <div style={{
                  padding: '8px 12px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                  marginBottom: 14,
                }}>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
                    color: 'rgba(255,255,255,0.85)', margin: 0, fontWeight: 500,
                  }}>
                    💼 {autor.rol}
                  </p>
                  <p style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: 'rgba(255,255,255,0.45)', margin: '3px 0 0',
                  }}>
                    🎓 {autor.semestre}
                  </p>
                </div>

                <p style={{
                  fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, margin: '0 0 16px',
                  textAlign: 'justify', textJustify: 'inter-word',
                }}>
                  {autor.descripcion}
                </p>

                {/* Lista de responsabilidades */}
                <div style={{ marginBottom: 18 }}>
                  <span style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                    color: autor.color, letterSpacing: '0.15em', textTransform: 'uppercase',
                    display: 'block', marginBottom: 8,
                  }}>
                    Contribuciones Clave:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {autor.responsabilidades.map((resp, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                        <CheckCircle2 size={13} color={autor.color} style={{ marginTop: 3, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55 }}>
                          {resp}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Habilidades / Tags */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 14 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {autor.skills.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
                        color: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.05)',
                        padding: '3px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            PILARES DE INGENIERÍA Y TRABAJO EN EQUIPO
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginBottom: 'clamp(48px, 6vw, 64px)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 11,
              color: '#F97316', letterSpacing: '0.25em', textTransform: 'uppercase',
              display: 'block', marginBottom: 6,
            }}>
              Ingeniería & Proceso
            </span>
            <h3 style={{
              fontFamily: 'Cinzel, serif', fontWeight: 800,
              fontSize: 'clamp(20px, 3.5vw, 34px)', color: 'white', margin: 0,
            }}>
              Pilares Técnicos del Proyecto
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}>
            {PILARES.map((pilar) => {
              const Icon = pilar.icon;
              return (
                <div
                  key={pilar.titulo}
                  style={{
                    padding: '20px',
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.025)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={18} color="#F97316" />
                  </div>
                  <h4 style={{ fontFamily: 'Cinzel, serif', fontWeight: 700, fontSize: 15, color: 'white', margin: 0 }}>
                    {pilar.titulo}
                  </h4>
                  <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, margin: 0 }}>
                    {pilar.detalle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            TARJETA INSTITUCIONAL CBTA #134
        ════════════════════════════════════════════════════════════════ */}
        <div style={{
          padding: '28px 32px',
          borderRadius: 24,
          border: '1px solid rgba(249,115,22,0.3)',
          background: 'linear-gradient(135deg, rgba(249,115,22,0.06) 0%, rgba(10,4,4,0.9) 100%)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Image
              src="/images/logo-cbta.png"
              alt="Escudo oficial CBTA #134"
              width={64}
              height={64}
              style={{ filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.4))' }}
            />
            <div>
              <h4 style={{ fontFamily: 'Cinzel, serif', fontWeight: 800, fontSize: 18, color: 'white', margin: '0 0 4px' }}>
                CBTA #134 · San Francisco Tetlanhocan
              </h4>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                Centro de Bachillerato Tecnológico Agropecuario No. 134
              </p>
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#F97316', margin: '4px 0 0' }}>
                5° Semestre Grupo &quot;A&quot; · Especialidad en Programación · PAEC 2026
              </p>
            </div>
          </div>

          <div style={{
            padding: '10px 18px', borderRadius: 999,
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,0.7)',
          }}>
            Tlaxcala, México · Octubre 2026
          </div>
        </div>

      </div>
    </section>
  );
}
