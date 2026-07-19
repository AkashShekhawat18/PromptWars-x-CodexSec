import { Input } from "@/components/ui/input";
import { UseFormRegisterReturn } from "react-hook-form";

interface EmailInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  registration?: UseFormRegisterReturn;
}

export function EmailInput({ registration, ...props }: EmailInputProps) {
  return (
    <Input
      type="email"
      className="bg-[#141416] border-white/10 text-white placeholder:text-[#8A8A93] h-11 focus-visible:ring-1 focus-visible:ring-white/30 focus-visible:border-white/20 transition-colors"
      {...registration}
      {...props}
    />
  );
}
