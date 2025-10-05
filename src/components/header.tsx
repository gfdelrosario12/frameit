import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-white border-b py-2 m-0">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4">
        <span className="font-extrabold font- text-lg sm:text-2xl bg-gradient-to-r from-fuchsia-900 via-pink-500 to-purple-500 bg-clip-text text-transparent">
          FRAMEIT
        </span>
        {/* Logo and title grouped for better mobile stacking */}
        <div className="flex items-center gap-2">
          <span className="relative w-8 h-8 sm:w-10 sm:h-10">
            <Image
              src="/logo.png"
              alt="FrameIt Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </span>
        </div>
      </div>
    </header>
  );
}
