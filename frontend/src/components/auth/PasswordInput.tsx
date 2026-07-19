"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { UseFormRegisterReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { clsx } from "clsx";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  registration?: UseFormRegisterReturn;
  showStrengthMeter?: boolean;
  passwordValue?: string;
}

export function PasswordInput({ registration, showStrengthMeter, passwordValue = "", ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length > 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = calculateStrength(passwordValue);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className="bg-[#141416] border-white/10 text-white placeholder:text-[#8A8A93] h-11 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/20 transition-colors pr-10"
          {...registration}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6C5CE7]/50 rounded-sm"
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {showStrengthMeter && passwordValue.length > 0 && (
        <div className="flex gap-1 mt-2">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={clsx(
                "h-1 w-full rounded-full transition-colors duration-300",
                strength >= level
                  ? strength === 1
                    ? "bg-red-500"
                    : strength === 2
                    ? "bg-yellow-500"
                    : strength === 3
                    ? "bg-blue-500"
                    : "bg-white"
                  : "bg-white/10"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
