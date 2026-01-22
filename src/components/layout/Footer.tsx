import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <main className="flex justify-center font-sans px-4">
        <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo_dark.png"
              alt="Ai Spec Kit"
              width={530}
              height={90}
              className="h-6 w-auto"
            />
            <span className="text-lg font-semibold text-foreground">
              Ai Spec Kit
            </span>
          </Link>

          <p className="text-sm text-muted-foreground">
            © 2026 Ai Spec Kit. All rights reserved.
          </p>
        </div>
      </main>
    </footer>
  );
};

export default Footer;
