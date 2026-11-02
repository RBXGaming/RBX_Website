/**
 * Web Audio API Sound Utility for RBX Gaming Cafe Admin Alerts
 * - 100% self-contained synthesized sounds (zero network latency / no external assets).
 * - Compliant with modern browser autoplay policies (auto-resumes on first user gesture).
 * - Safe fallback: Errors are caught gracefully without interrupting UI rendering.
 */

let sharedAudioContext: AudioContext | null = null;
let isAudioUnlockedState = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioContext) {
      sharedAudioContext = new AudioCtx();
    }
    return sharedAudioContext;
  } catch (e) {
    console.warn('AudioContext not supported or disabled:', e);
    return null;
  }
}

/**
 * Initializes listeners to unlock Web Audio API on the first user interaction.
 */
export function initAudioUnlock(): () => void {
  if (typeof window === 'undefined') return () => {};

  const unlock = async () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        await ctx.resume();
      }
      isAudioUnlockedState = true;
    } catch (e) {
      // Ignore autoplay resume errors
    } finally {
      cleanup();
    }
  };

  const cleanup = () => {
    window.removeEventListener('click', unlock);
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('mousedown', unlock);
  };

  window.addEventListener('click', unlock, { passive: true, once: true });
  window.addEventListener('keydown', unlock, { passive: true, once: true });
  window.addEventListener('touchstart', unlock, { passive: true, once: true });
  window.addEventListener('mousedown', unlock, { passive: true, once: true });

  return cleanup;
}

export function isAudioUnlocked(): boolean {
  if (!sharedAudioContext) return false;
  return sharedAudioContext.state === 'running' || isAudioUnlockedState;
}

/**
 * Plays a pleasant, futuristic 3-tone notification chime for incoming bookings.
 * Frequency Sequence: E5 (659.25Hz) -> G#5 (830.61Hz) -> B5 (987.77Hz)
 */
export async function playNewBookingSound(): Promise<boolean> {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    const notes = [
      { freq: 659.25, time: 0.0, duration: 0.12 },
      { freq: 830.61, time: 0.11, duration: 0.12 },
      { freq: 987.77, time: 0.22, duration: 0.35 },
    ];

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      // Smooth attack and exponential decay
      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.exponentialRampToValueAtTime(0.28, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + duration);
    });

    isAudioUnlockedState = true;
    return true;
  } catch (err) {
    console.warn('Audio alert could not be played:', err);
    return false;
  }
}

/**
 * Plays a short, subtle single confirmation chime.
 */
export async function playStatusUpdateSound(): Promise<boolean> {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.08); // A5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);

    isAudioUnlockedState = true;
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Manual test trigger for admin preview
 */
export async function testAlertSound(): Promise<boolean> {
  return playNewBookingSound();
}
