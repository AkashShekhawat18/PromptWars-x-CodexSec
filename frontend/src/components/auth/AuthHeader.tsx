export function AuthHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">{title}</h1>
      <p className="text-[#8A8A93] text-sm">{description}</p>
    </div>
  );
}
