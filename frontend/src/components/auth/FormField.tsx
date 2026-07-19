import { Label } from "@/components/ui/label";
import { ReactNode } from "react";

export function FormField({ label, id, children, error, optional = false }: { label: string; id: string; children: ReactNode; error?: string; optional?: boolean }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-white/80 font-medium text-sm">
          {label}
        </Label>
        {optional && <span className="text-xs text-[#8A8A93]">Optional</span>}
      </div>
      {children}
      {error && (
        <p className="text-red-400 text-xs mt-1 transition-opacity">
          {error}
        </p>
      )}
    </div>
  );
}
