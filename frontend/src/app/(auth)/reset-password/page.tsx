"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField } from "@/components/auth/FormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { ValidationMessage } from "@/components/auth/ValidationMessage";

const resetPasswordSchema = z.object({
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch("password");

  const onSubmit = async (_data: ResetPasswordValues) => {
    setServerError(null);
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <AuthCard>
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Password reset</h3>
          <p className="text-[#8A8A93] mb-8">Your password has been successfully reset.</p>
          <Link 
            href="/login" 
            className="flex items-center justify-center w-full h-11 bg-white text-black hover:bg-white/90 rounded-lg font-medium transition-colors"
          >
            Continue to log in
          </Link>
        </div>
      ) : (
        <>
          <AuthHeader 
            title="Set new password" 
            description="Must be at least 8 characters." 
          />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ValidationMessage message={serverError || undefined} />

            <FormField label="New Password" id="password" error={errors.password?.message}>
              <PasswordInput 
                id="password" 
                placeholder="••••••••" 
                registration={register("password")} 
                showStrengthMeter
                passwordValue={passwordValue}
              />
            </FormField>

            <FormField label="Confirm New Password" id="confirmPassword" error={errors.confirmPassword?.message}>
              <PasswordInput 
                id="confirmPassword" 
                placeholder="••••••••" 
                registration={register("confirmPassword")} 
              />
            </FormField>

            <LoadingButton type="submit" isLoading={isLoading} loadingText="Resetting password...">
              Reset password
            </LoadingButton>
          </form>
        </>
      )}
    </AuthCard>
  );
}
