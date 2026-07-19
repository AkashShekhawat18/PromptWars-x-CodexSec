"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { NeuralOrb } from "@/components/3d/NeuralOrb";
import { Button } from "@/components/ui/button";
import { userAPI } from "@/lib/api";

export function Hero() {
  const router = useRouter();

  const handleStartTrial = () => {
    router.push("/signup");
  };

  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden pt-20">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <NeuralOrb />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          NeuroFlow AI is now in Beta
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-6xl md:text-[84px] leading-tight md:leading-[0.95] tracking-tight font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 max-w-4xl"
        >
          Your Autonomous AI Productivity OS
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-8 text-xl text-[#8A8A93] max-w-2xl font-medium"
        >
          Automate workflows, synthesize meetings, and manage projects with a multi-agent cognitive layer that thinks alongside you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-12 flex justify-center w-full px-4 sm:px-0"
        >
          <Button 
            onClick={handleStartTrial}
            className="w-full sm:w-auto h-12 px-10 rounded-full bg-white text-black hover:bg-white/90 text-base font-semibold transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            Start Free Trial
          </Button>
        </motion.div>
      </div>

      {/* Vignette effect to fade into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0A0A0C] to-transparent pointer-events-none z-10" />
    </section>
  );
}
