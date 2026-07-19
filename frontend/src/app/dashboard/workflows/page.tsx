import { Metadata } from "next";
import { WorkflowEngine } from "@/components/workflows/WorkflowEngine";

export const metadata: Metadata = {
  title: "Workflow Engine | NeuroFlow AI",
  description: "Automate tasks and orchestrate AI agents with a visual workflow builder.",
};

export default function WorkflowsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
      <div className="max-w-[1440px] mx-auto">
        <WorkflowEngine />
      </div>
    </div>
  );
}
