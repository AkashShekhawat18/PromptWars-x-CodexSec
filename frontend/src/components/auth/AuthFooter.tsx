import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthFooter({ text, linkText, href }: AuthFooterProps) {
  return (
    <p className="mt-8 text-center text-sm text-[#8A8A93]">
      {text}{" "}
      <Link href={href} className="text-white hover:underline underline-offset-4">
        {linkText}
      </Link>
    </p>
  );
}
