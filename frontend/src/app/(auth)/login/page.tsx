"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { FormField } from "@/components/auth/FormField";
import { EmailInput } from "@/components/auth/EmailInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { Divider } from "@/components/auth/Divider";
import { SocialLoginButton } from "@/components/auth/SocialLoginButton";
import { AuthFooter } from "@/components/auth/AuthFooter";
import { ValidationMessage } from "@/components/auth/ValidationMessage";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().default(false).optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: () => {
      setServerError(null);
      router.push(callbackUrl);
    },
    onError: (error: unknown) => {
      setServerError((error as Error).message || "An unexpected error occurred");
    }
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    loginMutation.mutate(data);
  };

  return (
    <AuthCard>
      <AuthHeader 
        title="Log in to NeuroFlow" 
        description="Welcome back! Please enter your details." 
      />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <ValidationMessage message={serverError || undefined} />

        <FormField label="Email" id="email" error={errors.email?.message}>
          <EmailInput id="email" placeholder="name@company.com" registration={register("email")} />
        </FormField>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-white/80 font-medium text-sm">
              Password
            </label>
            <Link 
              href="/forgot-password" 
              className="text-xs font-medium text-[#8A8A93] hover:text-white transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" placeholder="••••••••" registration={register("password")} />
          {errors.password && (
            <p className="text-red-400 text-xs mt-1 transition-opacity">
              {errors.password.message}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2 pt-1 pb-2">
          <Controller
            name="rememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox 
                id="rememberMe" 
                checked={field.value || false}
                onCheckedChange={field.onChange}
                className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" 
              />
            )}
          />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none text-[#8A8A93] cursor-pointer hover:text-white transition-colors"
          >
            Remember for 30 days
          </label>
        </div>

        <LoadingButton 
          type="submit" 
          isLoading={loginMutation.isPending}
          loadingText="Logging in..."
        >
          Log in
        </LoadingButton>
      </form>

      <div className="mt-4 mb-2 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/80 space-y-2">
        <p className="font-semibold text-white">Hackathon Demo Credentials:</p>
        <div className="flex justify-between items-center">
          <span className="text-[#8A8A93]">Admin Portal:</span>
          <span className="font-mono text-xs bg-black/50 px-2 py-1 rounded">admin@neuroflow.ai / admin123</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#8A8A93]">Standard User:</span>
          <span className="font-mono text-xs bg-black/50 px-2 py-1 rounded">user@neuroflow.ai / user1234</span>
        </div>
      </div>

      <SocialLoginButton text="Continue with Google" />
      <AuthFooter text="Don't have an account?" linkText="Sign up" href="/signup" />
    </AuthCard>
  );
}
