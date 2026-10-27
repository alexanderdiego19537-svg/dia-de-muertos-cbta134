'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Skull, User } from 'lucide-react';

interface InfoBotProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
  time: string;
}

const getTime = () => new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });

const getReply = (input: string): string => {
  const lower = input.toLowerCase();
  if (lower.includes('hora') || lower.includes('horario') || lower.includes('cuándo') || lower.includes('cuando')) {
    return 'El evento es el miércoles 28 de octubre de 2026. Comienza a las 8:00 AM y finaliza aproximadamente a la 1:00 PM. ¡No llegues tarde para ver la pasarela de Catrines y Catrinas! 💀';
  }
  if (lower.includes('actividad') || lower.includes('programa') || lower.includes('qué hay') || lower.includes('que hay')) {
    return 'El programa incluye: 👗 Pasarela de Catrines y Catrinas, 🕯️ Ofrendas, 🌺 Mercadito, 🌽 Ritual del Maíz, 💃 Baile de la Llorona, 🧙 Baile de la Bruja, 🎭 Obra del Charro Negro y 📜 Poesía. Cada actividad dura aprox. 30 minutos.';
  }
  if (lower.includes('dónde') || lower.includes('donde') || lower.includes('lugar') || lower.includes('ubicación') || lower.includes('ubicacion')) {
    return 'El evento es en el Auditorio de Aquiahuac, San Francisco Tetlanhocan, Tlaxcala. La dirección exacta es: C. Josefa Ortiz de Domínguez, 90840 Tetlanhocan. Puedes ver el mapa en la sección de Ubicación 📍';
  }
  if (lower.includes('cbt') || lower.includes('escuela') || lower.includes('institución') || lower.includes('institucion') || lower.includes('quién organiza') || lower.includes('quien organiza')) {
    return 'El evento lo organiza la parte académica del Centro de Bachillerato Tecnológico Agropecuario #134, una institución educativa de San Francisco Tetlanhocan, Tlaxcala, alineada al Programa PAEC. 🎓';
  }
  if (lower.includes('altar') || lower.includes('ofrenda') || lower.includes('cómo') || lower.includes('como')) {
    return 'El altar tradicional incluye: 🌼 Flor de cempasúchil (guía las almas), 📸 Foto del difunto, 🕯️ Velas (iluminan el camino), 💧 Agua, 🧂 Sal (purifica), y la comida favorita del difunto. ¡Revisa la sección "Calendario del Más Allá" para fechas específicas!';
  }
  if (lower.includes('logo') || lower.includes('flor') || lower.includes('cempasúchil') || lower.includes('cempasuchil')) {
    return 'El logo principal del evento es una flor de cempasúchil 🌼, símbolo sagrado del Día de Muertos en México. La flor guía a las almas con su aroma. El escudo institucional del CBTA #134 también aparece en la página.';
  }
  if (lower.includes('fecha') || lower.includes('dia') || lower.includes('día') || lower.includes('28')) {
    return 'El evento del CBT #134 es el miércoles 28 de octubre de 2026. En la sección "Calendario del Más Allá" encontrarás todas las fechas importantes del Día de Muertos (28 oct – 2 nov) con su significado. 📅';
  }
  return '¡Buena pregunta! Te invito a explorar las secciones de la página para más información: "El Evento" para el programa, "Tradiciones" para el calendario cultural, o "Ubicación" para llegar al auditorio. También puedes hacer clic en "Ver Evento" arriba. 🌺💀';
};

const suggestions = [
  '¿Cuándo es el evento?',
  '¿Qué actividades habrá?',
  '¿Dónde es el evento?',
  '¿Cómo poner un altar?',
];

export default function InfoBot({ isOpen, onClose }: InfoBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0, from: 'bot',
      text: '¡Hola! Soy el asistente del CBTA #134. ¿Tienes alguna pregunta sobre el evento de Día de Muertos del 28 de octubre? 💀🌺',
      time: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: 'user', text, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, from: 'bot', text: getReply(text), time: getTime() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-50" style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }} />
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
            style={{ width: '100%', maxWidth: '420px', background: '#080404', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.25)' }}>
                  <Skull size={18} style={{ color: '#F97316' }} />
                  <span style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, background: '#22c55e', borderRadius: '50%', border: '2px solid #080404' }} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: 'white', fontWeight: 600, fontSize: '14px' }}>Asistente CBTA #134</span>
                    <Sparkles size={11} style={{ color: '#F97316' }} />
                  </div>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>INFO BOT // EN LÍNEA</span>
                </div>
              </div>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={15} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: msg.from === 'user' ? 'flex-end' : 'flex-start', gap: '4px' }}>
                    <div style={{
                      padding: '10px 14px', borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      fontSize: '13px', lineHeight: 1.6, color: 'white',
                      background: msg.from === 'user' ? 'linear-gradient(135deg, #F97316, #C2410C)' : 'rgba(255,255,255,0.05)',
                      border: msg.from === 'bot' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.25)', flexDirection: msg.from === 'user' ? 'row-reverse' : 'row' }}>
                      {msg.from === 'bot' ? <Skull size={9} style={{ color: 'rgba(249,115,22,0.5)' }} /> : <User size={9} />}
                      <span>{msg.from === 'bot' ? 'Asistente' : 'Tú'}</span>
                      <span>· {msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex' }}>
                  <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Escribiendo</span>
                    {[0, 150, 300].map((delay, i) => (
                      <span key={i} style={{ width: 5, height: 5, background: '#F97316', borderRadius: '50%', display: 'block', animation: 'bounce 1s infinite', animationDelay: `${delay}ms` }} />
                    ))}
                  </div>
                </div>
              )}

              {messages.length < 3 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {suggestions.map((s) => (
                    <button key={s} onClick={() => handleSend(s)}
                      style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', padding: '6px 12px', borderRadius: '999px', border: '1px solid rgba(249,115,22,0.25)', color: 'rgba(249,115,22,0.65)', background: 'none', cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget.style.background = 'rgba(249,115,22,0.1)'); (e.currentTarget.style.color = '#F97316'); }}
                      onMouseLeave={e => { (e.currentTarget.style.background = 'none'); (e.currentTarget.style.color = 'rgba(249,115,22,0.65)'); }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 8px 8px 16px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pregunta algo..."
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '13px', fontFamily: 'Inter, sans-serif' }} />
                <button type="submit" disabled={!input.trim()}
                  style={{ width: 32, height: 32, borderRadius: '50%', background: input.trim() ? 'linear-gradient(135deg, #F97316, #C2410C)' : 'rgba(255,255,255,0.05)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
                  <Send size={13} style={{ color: input.trim() ? 'white' : 'rgba(255,255,255,0.2)', transform: 'rotate(-12deg)' }} />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
