"use client";

import { Button } from "@/components/ui/button";
import WalletButton from "@/components/WalletButton";
import { navConfig } from "@/configs/nav.config";
import { cn } from "@/lib/utils";
import { useCwethWrapModal } from "@/state/modal/cweth-wrap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const { setModalOpen: setShowWrapDialog } = useCwethWrapModal();

  return (
    <header className="bg-neutral-900 border-b border-neutral-700">
      <div className="max-w-320 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={"/"} className="flex items-center">
            <Image src={"/icon.png"} alt="PrivacyPad's icon" width={32} height={32} className="size-8" />
            <h1 className="text-primary font-bold text-xl tracking-wider ml-2">PrivacyPad</h1>
            {/* <span className="ml-2 text-neutral-500 text-xs">v1.0.0 BETA</span> */}
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navConfig.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors", {
                    "text-white": isActive,
                    "text-neutral-400 hover:text-white hover:bg-neutral-800": !isActive,
                  })}
                >
                  {item.Icon && <item.Icon className="size-4" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right side - Wallet */}
          <div className="flex items-center gap-2">
            {/* Wallet Connect Button */}
            <WalletButton />
            <Button
              onClick={() => setShowWrapDialog(true)}
              variant="outline"
              className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>CWETH</span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
    </header>
  );
}
