import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <main className="flex justify-center font-sans px-4">
        <div className="container flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <Image
              src="/logo_dark.png"
              alt="AI Spec Kit"
              width={530}
              height={90}
              className="h-6 w-auto"
            />
            <span className="text-xl font-semibold text-foreground">
              AI Spec Kit
            </span>
          </Link>
        </div>
      </main>
    </nav>
  );
};

export default Navbar;
