import confetti from "canvas-confetti";

/**
 * Microinteracción de celebración (R11.2–R11.6).
 *
 * Dispara un confeti breve y, opcionalmente, un sonido corto desde un asset
 * LOCAL (`/sounds/approve.mp3`). No hay red externa: `canvas-confetti` se
 * empaqueta con la app y el audio se sirve desde `public/`.
 *
 * Reglas de comportamiento:
 * - Es puramente de presentación: nunca bloquea la UI ni retrasa los datos (R11.5).
 * - Nunca propaga errores (incluidos los de `audio.play()` bloqueado por el
 *   navegador): todo intento se envuelve en try/catch que traga el error (R11.5).
 * - Con `prefers-reduced-motion: reduce` se desactiva el confeti por completo (R11.4).
 * - El sonido está silenciado por defecto. Sólo suena si el llamador pide
 *   `sound: true` Y hubo un gesto de usuario previo que habilite audio Y no
 *   está activo `prefers-reduced-motion: reduce` (R11.3).
 * - SSR-safe: si no hay `window`, la función no hace nada.
 */

export type CelebrateOptions = {
  /**
   * Solicita reproducir el sonido. Por defecto `false` (silenciado).
   * Aun pidiéndolo, el sonido sólo suena si hubo gesto de usuario previo y no
   * está activo `prefers-reduced-motion`.
   */
  sound?: boolean;
};

/** Ruta del asset de audio local (sin red externa, R11.6). */
const APPROVE_SOUND_SRC = "/sounds/approve.mp3";

/**
 * Bandera a nivel de módulo: ¿hubo ya un gesto de usuario que habilite audio?
 * Los navegadores bloquean el autoplay de audio hasta que el usuario interactúa
 * con la página. Registramos el primer gesto (pointer/keydown/touch) y, a partir
 * de ahí, permitimos intentar reproducir el sonido.
 */
let hadUserGesture = false;
let gestureListenerAttached = false;

function markGesture(): void {
  hadUserGesture = true;
}

function ensureGestureTracking(): void {
  if (gestureListenerAttached || typeof window === "undefined") {
    return;
  }
  gestureListenerAttached = true;
  const opts: AddEventListenerOptions = { once: true, passive: true };
  // `once: true` limpia cada listener tras el primer disparo.
  window.addEventListener("pointerdown", markGesture, opts);
  window.addEventListener("keydown", markGesture, opts);
  window.addEventListener("touchstart", markGesture, opts);
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Confeti breve y discreto. No lanza nunca. */
function fireConfetti(): void {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 35,
      ticks: 200,
      origin: { y: 0.7 },
      disableForReducedMotion: true,
      scalar: 0.9,
    });
  } catch {
    // El confeti es decorativo: cualquier fallo se ignora (R11.5).
  }
}

/**
 * Reproduce el sonido local si procede. No lanza nunca; si el navegador bloquea
 * la reproducción, el rechazo de la promesa se traga en silencio (R11.5).
 */
function playSound(): void {
  try {
    const audio = new Audio(APPROVE_SOUND_SRC);
    audio.volume = 0.6;
    const maybePromise: Promise<void> | undefined = audio.play();
    if (maybePromise && typeof maybePromise.then === "function") {
      maybePromise.catch(() => {
        // Autoplay bloqueado o asset ausente: silencioso, sin propagar (R11.5, R11.6).
      });
    }
  } catch {
    // `Audio` no disponible o cualquier otro fallo: silencioso.
  }
}

/**
 * Dispara la celebración. Siempre segura de llamar; no bloquea ni lanza.
 *
 * @param options.sound Pide reproducir el sonido (silenciado por defecto).
 */
export function celebrate(options: CelebrateOptions = {}): void {
  if (typeof window === "undefined") {
    return;
  }

  // Empieza a seguir gestos de usuario para futuras celebraciones.
  ensureGestureTracking();

  const reducedMotion = prefersReducedMotion();

  // Confeti: desactivado con movimiento reducido (R11.4).
  if (!reducedMotion) {
    fireConfetti();
  }

  // Sonido: silenciado por defecto. Sólo suena si se pide explícitamente,
  // hubo gesto de usuario previo y no hay movimiento reducido (R11.3).
  const wantsSound = options.sound === true;
  if (wantsSound && hadUserGesture && !reducedMotion) {
    playSound();
  }
}
