export function Divider({ text = "or" }: { text?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/10"></div>
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-[#0A0A0C] px-3 text-[#8A8A93]">{text}</span>
      </div>
    </div>
  );
}
