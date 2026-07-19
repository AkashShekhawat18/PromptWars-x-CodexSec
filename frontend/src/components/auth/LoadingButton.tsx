import { Button } from "@/components/ui/button";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
}

export function LoadingButton({ isLoading, loadingText = "Loading...", children, className, ...props }: LoadingButtonProps) {
  return (
    <Button 
      {...props}
      disabled={isLoading || props.disabled}
      className={`w-full h-11 bg-white text-black hover:bg-white/90 font-medium ${className}`}
    >
      {isLoading ? (
        <span>{loadingText}</span>
      ) : (
        children
      )}
    </Button>
  );
}
