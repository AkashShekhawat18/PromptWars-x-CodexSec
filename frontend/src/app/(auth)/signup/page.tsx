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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "@/lib/api";

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const signupMutation = useMutation({
    mutationFn: authAPI.signup,
    onSuccess: () => {
      setServerError(null);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    },
    onError: (error: unknown) => {
      setServerError((error as Error).message || "An unexpected error occurred");
    }
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch("password");

  const onSubmit = (data: SignupFormValues) => {
    signupMutation.mutate(data);
  };

  if (isSuccess) {
    return (
      <AuthCard>
        <div className="flex flex-col items-center justify-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Account created</h3>
          <p className="text-[#8A8A93] mb-8">Your account has been successfully created.</p>
          <button 
            onClick={() => router.push("/verify-email")}
            className="flex items-center justify-center w-full h-11 bg-white text-black hover:bg-white/90 rounded-lg font-medium transition-colors"
          >
            Continue to Verification
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthHeader 
        title="Create an account" 
        description="Start your free trial. No credit card required." 
      />
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <ValidationMessage message={serverError || undefined} />

        <FormField label="Full Name" id="name" error={errors.name?.message}>
          <Input 
            id="name" 
            placeholder="Ada Lovelace" 
            {...register("name")} 
            className="bg-[#141416] border-white/10 text-white placeholder:text-[#8A8A93] h-11 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/20 transition-colors"
          />
        </FormField>

        <FormField label="Email" id="email" error={errors.email?.message}>
          <EmailInput id="email" placeholder="name@company.com" registration={register("email")} />
        </FormField>

        <FormField label="Password" id="password" error={errors.password?.message}>
          <PasswordInput 
            id="password" 
            placeholder="••••••••" 
            registration={register("password")} 
            showStrengthMeter
            passwordValue={passwordValue}
          />
        </FormField>

        <FormField label="Confirm Password" id="confirmPassword" error={errors.confirmPassword?.message}>
          <PasswordInput 
            id="confirmPassword" 
            placeholder="••••••••" 
            registration={register("confirmPassword")} 
          />
        </FormField>
        
        <div className="flex items-start space-x-2 pt-1 pb-2">
          <Controller
            name="acceptTerms"
            control={control}
            render={({ field }) => (
              <Checkbox 
                id="acceptTerms" 
                checked={field.value || false}
                onCheckedChange={field.onChange}
                className="mt-1 border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black" 
              />
            )}
          />
          <div className="flex flex-col">
            <label
              htmlFor="acceptTerms"
              className="text-sm font-medium leading-snug text-[#8A8A93] cursor-pointer hover:text-white transition-colors"
            >
              I agree to the Terms of Service and Privacy Policy.
            </label>
            {errors.acceptTerms && (
              <p className="text-red-400 text-xs mt-1 transition-opacity">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>
        </div>

        <LoadingButton 
          type="submit" 
          isLoading={signupMutation.isPending} 
          loadingText="Creating account..."
        >
          Create account
        </LoadingButton>
      </form>

      <div className="mt-4 mb-2 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-200/80 space-y-2">
        <p className="font-semibold text-blue-300">Evaluating for a hackathon?</p>
        <p>You can skip registration and use our pre-configured demo accounts. Just head over to the Login page!</p>
        <Link href="/login" className="inline-block mt-2 font-medium text-white hover:underline">
          Go to Demo Login &rarr;
        </Link>
      </div>

      <Divider text="or continue with" />
      <SocialLoginButton text="Sign up with Google" />
      <AuthFooter text="Already have an account?" linkText="Log in" href="/login" />
    </AuthCard>
  );
}
