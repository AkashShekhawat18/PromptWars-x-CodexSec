import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center justify-center gap-3 mb-8 group w-fit mx-auto transition-opacity hover:opacity-80">
      <div className="relative flex items-center justify-center w-12 h-12">
        <div className="absolute inset-0 bg-white/10 rounded-xl rotate-45 group-hover:rotate-90 transition-transform duration-500 ease-in-out" />
        <div className="absolute inset-1 bg-white/20 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500 ease-in-out delay-75" />
        <div className="absolute inset-2 bg-white rounded-md" />
      </div>
      <span className="text-xl font-medium tracking-tight text-white">NeuroFlow</span>
    </Link>
  );
}
