"use client";

import { useState, useRef, useEffect } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { ValidationMessage } from "@/components/auth/ValidationMessage";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Please enter the complete verification code");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    if (fullCode !== "123456") {
      setError("Invalid code. Please try again. (Hint: 123456)");
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    router.push("/");
  };

  const handleResend = () => {
    if (timeLeft > 0) return;
    setTimeLeft(60);
    // Simulate resend API
  };

  return (
    <AuthCard>
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Check your email</h2>
        <p className="text-[#8A8A93] text-sm leading-relaxed max-w-sm mx-auto">
          We sent a verification code to <span className="text-white font-medium">name@company.com</span>.
          Enter it below to verify your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2 max-w-[320px] mx-auto">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 bg-[#141416] border border-white/10 rounded-xl text-center text-xl text-white font-semibold placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-colors"
            />
          ))}
        </div>

        <ValidationMessage message={error || undefined} />

        <LoadingButton type="submit" isLoading={isLoading} loadingText="Verifying...">
          Verify email
        </LoadingButton>
      </form>

      <p className="mt-8 text-center text-sm text-[#8A8A93]">
        Didn&apos;t receive the email?{" "}
        <button 
          onClick={handleResend}
          disabled={timeLeft > 0}
          className={`font-medium ${timeLeft > 0 ? "text-[#8A8A93] cursor-not-allowed" : "text-white hover:underline underline-offset-4 transition-colors"}`}
        >
          {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Click to resend"}
        </button>
      </p>
    </AuthCard>
  );
}
