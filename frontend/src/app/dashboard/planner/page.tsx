import { Metadata } from "next";
import { AdaptivePlanner } from "@/components/planner/AdaptivePlanner";

export const metadata: Metadata = {
  title: "Adaptive Planner | NeuroFlow AI",
  description: "AI-assisted weekly and daily planning, time blocking, and priority matrices.",
};

export default function PlannerPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
      <div className="max-w-[1440px] mx-auto">
        <AdaptivePlanner />
      </div>
    </div>
  );
}
