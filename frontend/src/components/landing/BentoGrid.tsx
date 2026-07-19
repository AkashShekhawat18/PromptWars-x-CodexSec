"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Calendar, FileText, Zap } from "lucide-react";

const features = [
  {
    title: "Multi-Agent Planning",
    description: "Our Supervisor Agent breaks down your massive projects into delegatable tasks in seconds.",
    icon: BrainCircuit,
    colSpan: "md:col-span-2",
  },
  {
    title: "Knowledge Vault",
    description: "Talk to your documents. Semantic RAG search across your entire workspace.",
    icon: FileText,
    colSpan: "md:col-span-1",
  },
  {
    title: "Autonomous Scheduling",
    description: "Calendar AI that resolves conflicts and time-blocks deep work automatically.",
    icon: Calendar,
    colSpan: "md:col-span-1",
  },
  {
    title: "Workflow Automation",
    description: "Trigger background automations using natural language commands. No code required.",
    icon: Zap,
    colSpan: "md:col-span-2",
  },
];

export function BentoGrid() {
  return (
    <section id="features" className="relative w-full py-24 px-6 z-20">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Intelligence built into every layer.
          </h2>
          <p className="text-[#8A8A93] text-lg max-w-2xl mx-auto">
            NeuroFlow operates with a swarm of specialized AI agents designed to handle specific domains of your productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
              className={`group relative overflow-hidden rounded-3xl bg-[#141416]/80 backdrop-blur-xl border border-white/5 p-8 ${feature.colSpan} transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/5`}
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-[#8A8A93] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
