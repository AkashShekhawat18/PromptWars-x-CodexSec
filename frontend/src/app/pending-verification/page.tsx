import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PendingVerificationPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-[#000000] to-[#000000]"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-xl text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <ShieldAlert className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-white mb-3">
          Account Pending Approval
        </h1>
        
        <p className="text-[#8A8A93] text-sm leading-relaxed mb-8">
          Your account has been successfully created and is currently under review by an administrator. For security purposes, manual verification is required before you can access the NeuroFlow platform.
        </p>

        <p className="text-[#8A8A93] text-sm leading-relaxed mb-8">
          You will receive an email notification once your account has been approved.
        </p>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-white text-black hover:bg-gray-200">
              Return to Home
            </Button>
          </Link>
          <Link href="/login">
            <Button className="w-full" variant="outline">
              Log out
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
