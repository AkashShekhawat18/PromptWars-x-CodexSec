export function ValidationMessage({ message }: { message?: string }) {
  if (!message) return null;
  
  return (
    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
      {message}
    </div>
  );
}
