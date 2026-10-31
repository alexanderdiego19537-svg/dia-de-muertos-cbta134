import { NextResponse, type NextRequest } from 'next/server';
import { logError } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, correo, asunto, mensaje, hp_check } = body;

    // 1. Protección Anti-Bot Honeypot (campo señuelo que los humanos dejan vacío)
    if (hp_check) {
      return NextResponse.json({ ok: true, message: 'Recibido' });
    }

    // 2. Validación estricta de campos obligatorios
    if (!nombre || !correo || !mensaje) {
      return NextResponse.json(
        { error: 'Por favor completa todos los campos requeridos (nombre, correo y mensaje).' },
        { status: 400 }
      );
    }

    // 3. Validación de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      return NextResponse.json(
        { error: 'El correo electrónico ingresado no tiene un formato válido.' },
        { status: 400 }
      );
    }

    // Sanitización básica
    const cleanNombre = String(nombre).slice(0, 100).trim();
    const cleanCorreo = String(correo).slice(0, 120).trim();
    const cleanAsunto = String(asunto || 'Contacto Portal Web CBTA #134').slice(0, 150).trim();
    const cleanMensaje = String(mensaje).slice(0, 2000).trim();

    // 4. Envío con Resend si la clave de API está configurada en Vercel
    const resendApiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.NOTIFICATION_EMAIL || 'contacto@cbta134.edu.mx';

    if (resendApiKey) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Festival CBTA 134 <onboarding@resend.dev>',
          to: [adminEmail],
          reply_to: cleanCorreo,
          subject: `[CBTA 134 - Festival] ${cleanAsunto}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #F97316; margin-top: 0;">Nuevo mensaje del Portal Cultural</h2>
              <p><strong>Remitente:</strong> ${cleanNombre} (${cleanCorreo})</p>
              <p><strong>Asunto:</strong> ${cleanAsunto}</p>
              <hr style="border: 0; border-top: 1px solid #eee;" />
              <p style="white-space: pre-wrap; color: #333;">${cleanMensaje}</p>
              <hr style="border: 0; border-top: 1px solid #eee;" />
              <small style="color: #999;">Enviado desde el portal web oficial del Festival Entre la Vida y la Muerte — CBTA #134.</small>
            </div>
          `,
        }),
      });

      if (!resendRes.ok) {
        const errData = await resendRes.json();
        logError(errData, { component: 'API_Contact', action: 'resend_send' });
        return NextResponse.json(
          { error: 'Hubo un inconveniente al despachar el correo. Intenta de nuevo más tarde.' },
          { status: 502 }
        );
      }
    } else {
      // Modo desarrollo / clave pendiente: se registra en logs sin quebrar la experiencia
      console.log(`[AVISO RESEND PENDIENTE] Mensaje recibido de ${cleanNombre} (${cleanCorreo}): ${cleanMensaje}`);
    }

    return NextResponse.json({
      ok: true,
      message: 'Tu mensaje fue recibido y canalizado exitosamente con el comité del CBTA #134.',
    });
  } catch (error) {
    logError(error, { component: 'API_Contact', action: 'general_exception' });
    return NextResponse.json(
      { error: 'Error interno al procesar el mensaje. Por favor intenta nuevamente.' },
      { status: 500 }
    );
  }
}
