import confetti from "canvas-confetti";

export function launchConfetti() {
  if (typeof window === "undefined") return;

  // Multi-stage fireworks confetti
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ["#ec4899", "#f43f5e", "#fb7185", "#ffd700"],
  });
  fire(0.2, {
    spread: 60,
    colors: ["#f43f5e", "#a855f7", "#ec4899"],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ["#ffd700", "#ff69b4", "#ff1493", "#ffffff"],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ["#ec4899", "#fbbf24", "#e11d48"],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ["#f43f5e", "#fb7185", "#ffd700"],
  });
}

export function launchHearts() {
  if (typeof window === "undefined") return;

  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#ff4081", "#e91e63", "#9c27b0", "#ffd700"],
      zIndex: 9999,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ff4081", "#e91e63", "#9c27b0", "#ffd700"],
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
