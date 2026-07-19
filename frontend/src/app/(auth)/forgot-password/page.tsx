"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField } from "@/components/auth/FormField";
import { EmailInput } from "@/components/auth/EmailInput";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { ValidationMessage } from "@/components/auth/ValidationMessage";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const emailValue = watch("email");

  const onSubmit = async (_data: ForgotPasswordValues) => {
    setServerError(null);
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <AuthCard>
      <Link href="/login" className="inline-flex items-center text-sm font-medium text-[#8A8A93] hover:text-white transition-colors mb-8">
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to log in
      </Link>

      <AuthHeader 
        title="Reset password" 
        description="Enter your email and we'll send you a reset link." 
      />

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center text-center py-4">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
          <p className="text-[#8A8A93] mb-8 leading-relaxed">
            We&apos;ve sent a password reset link to <span className="font-semibold text-white">{emailValue}</span>. Please check your inbox.
          </p>
          <Link 
            href="/login" 
            className="flex items-center justify-center w-full h-11 bg-white text-black hover:bg-white/90 rounded-lg font-medium transition-colors"
          >
            Return to log in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <ValidationMessage message={serverError || undefined} />

          <FormField label="Email Address" id="email" error={errors.email?.message}>
            <EmailInput id="email" placeholder="name@company.com" registration={register("email")} />
          </FormField>

          <LoadingButton type="submit" isLoading={isLoading} loadingText="Sending link...">
            Send reset link
          </LoadingButton>
        </form>
      )}
    </AuthCard>
  );
}
