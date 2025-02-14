import { useCallback, useEffect, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import type { Options } from "canvas-confetti";

interface ConfettiProps {
  fire: boolean;
}

export function Confetti({ fire }: ConfettiProps) {
  const refAnimationInstance = useRef<
    ((options?: Partial<Options>) => void) | null
  >(null);

  const getInstance = useCallback(
    (confetti: { confetti: (options?: Partial<Options>) => void }) => {
      refAnimationInstance.current = confetti.confetti;
    },
    [],
  );

  const makeShot = useCallback(() => {
    const instance = refAnimationInstance.current;
    if (instance) {
      instance({
        spread: 90,
        startVelocity: 45,
        particleCount: 150,
        scalar: 1.2,
        ticks: 200,
        origin: { y: 1, x: 0.5 },
        gravity: 1,
        colors: ["#FF577F", "#FF884B", "#FFD384", "#FFF9B0", "#7DB9B6"],
        shapes: ["circle", "square"],
        decay: 0.9,
        drift: 0,
      });
    }
  }, []);

  useEffect(() => {
    if (fire) {
      makeShot();
    }
  }, [fire, makeShot]);

  return (
    <ReactCanvasConfetti
      onInit={getInstance}
      style={{
        position: "fixed",
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        zIndex: 50,
      }}
    />
  );
}
