"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
// @ts-expect-error maath doesn't have good TS types for this export
import * as random from "maath/random/dist/maath-random.esm";
import { clsx } from "clsx";

import { usePathname } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ParticleSwarm(props: any) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);
  const sphere = random.inSphere(new Float32Array(3000), { radius: 1.5 });
  const pathname = usePathname();

  useFrame((state, delta) => {
    if (ref.current && pathname !== "/login") {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={sphere}
        stride={3}
        frustumCulled={false}
        {...props}
      >
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.01}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

export function NeuralOrb({ className }: { className?: string }) {
  return (
    <div className={clsx("w-full h-full", className)}>
      <Canvas camera={{ position: [0, 0, 2.5] }}>
        <ParticleSwarm />
      </Canvas>
    </div>
  );
}
