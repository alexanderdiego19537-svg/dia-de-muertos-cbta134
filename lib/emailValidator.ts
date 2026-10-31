/**
 * Utilidad de Validación Profesional de Correo Electrónico
 * Detecta formatos inválidos, errores tipográficos comunes y dominios temporales/falsos.
 */

// Lista de dominios temporales o desechables comunes que no deben permitirse
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', '10minutemail.com', 'mailinator.com',
  'guerrillamail.com', 'yopmail.com', 'trashmail.com', 'dispostable.com',
  'getairmail.com', 'sharklasers.com', 'guerrillamailblock.com',
  'fake.com', 'test.com', 'ejemplo.com', 'example.com', 'asdf.com',
  'qwerty.com', 'prueba.com', 'inventado.com', 'nada.com', 'nada.ltd',
  'fakemailgenerator.com', 'throwawaymail.com', 'mohmal.com', 'burnermail.io',
  'mytemp.email', 'tempail.com', 'inboxkitten.com', 'crazymailing.com',
]);

// Lista de nombres de usuario de prueba o falsos que nunca deben permitirse
const DUMMY_USERNAMES = new Set([
  'ejemplo', 'prueba', 'test', 'testing', 'fake', 'falso', 'correofalso',
  'asdf', 'asdfgh', 'qwerty', 'usuario', 'user', 'demo', 'sample',
  'nobody', 'nada', 'correo', 'admin', 'root', 'invitado', 'guest',
  'temporal', 'dummy', 'anonimo', 'anonymous', 'ejemplo1', 'ejemplo2',
  'prueba1', 'prueba2', 'test1', 'test2', '12345', '123456', 'correo1',
  'averrr', 'aversiya', 'aver', 'vegeta', 'holaaseca', 'falso123',
  'random', 'testuser', 'fakeuser', 'correoprueba', 'probando', 'probando1',
]);

// Errores tipográficos comunes en dominios populares y su sugerencia
const COMMON_TYPOS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaul.com': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmil.com': 'hotmail.com',
  'hotmali.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outluk.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'yahho.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yaho.es': 'yahoo.es',
  'iclud.com': 'icloud.com',
  'icoud.com': 'icloud.com',
};

export interface EmailValidationResult {
  valid: boolean;
  error?: string;
  suggestion?: string;
}

export function validateEmail(email: string): EmailValidationResult {
  const clean = email.trim().toLowerCase();

  if (!clean) {
    return { valid: false, error: 'Por favor ingresa tu correo electrónico.' };
  }

  // 1. Verificación de formato general con RFC 5322 simplificado
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(clean)) {
    return {
      valid: false,
      error: 'El formato del correo es inválido. Debe ser algo como tu_nombre@gmail.com.',
    };
  }

  const parts = clean.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'El correo debe contener exactamente un símbolo "@".' };
  }

  const [local, domain] = parts;

  // 2. Validación de longitud
  if (local.length === 0 || local.length > 64) {
    return { valid: false, error: 'La parte del correo antes del "@" no es válida.' };
  }
  if (domain.length < 4 || domain.length > 255) {
    return { valid: false, error: 'El dominio del correo electrónico no es válido.' };
  }

  // 2.1 Bloqueo de nombres de usuario ficticios, de ejemplo o prueba
  if (
    DUMMY_USERNAMES.has(local) ||
    /^(ejemplo|prueba|test|testing|fake|falso|asdf|qwerty|correo|usuario|probando)\d*$/i.test(local)
  ) {
    return {
      valid: false,
      error: 'No se permiten correos de ejemplo o prueba (como "ejemplo@", "prueba@", "test@"). Por favor ingresa tu correo electrónico personal real.',
    };
  }

  // 2.2 Bloqueo de secuencias o caracteres repetitivos falsos (ej. "aaaaa@...", "11111@...")
  if (/^(.)\1{4,}$/.test(local)) {
    return {
      valid: false,
      error: 'El correo ingresado no parece ser una dirección personal real. Por favor escribe tu correo activo.',
    };
  }

  // 3. Verificación de terminación TLD (extensión)
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    return {
      valid: false,
      error: 'El dominio debe terminar en una extensión válida (como .com, .mx, .edu.mx, etc.).',
    };
  }

  // 4. Detección de dominios temporales o desechables
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: 'No se permiten correos temporales ni de prueba. Por favor utiliza tu correo real (Gmail, Outlook, Hotmail, etc.).',
    };
  }

  // 5. Detección de errores tipográficos comunes
  if (COMMON_TYPOS[domain]) {
    const suggestedDomain = COMMON_TYPOS[domain];
    return {
      valid: false,
      error: `¿Quisiste escribir ${local}@${suggestedDomain}? Corrige el error en el dominio.`,
      suggestion: `${local}@${suggestedDomain}`,
    };
  }

  return { valid: true };
}
