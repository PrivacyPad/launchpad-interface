import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Rocket, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function HeroBanner() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-primary/10 to-neutral-900/90">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05),transparent_50%)] animate-pulse"></div>
        {/* Subtle Floating Elements */}
        <div className="absolute top-4 left-8 w-1 h-1 bg-primary rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-8 right-12 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-4 left-12 w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-500"></div>

        {/* Subtle Moving Gradient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-l from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 px-6 py-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-neutral-800/50 border border-primary/30 rounded-full px-3 py-1 text-xs text-primary animate-in fade-in backdrop-blur-sm duration-1000">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>The Future of Token Launches</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-primary to-blue-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-20 duration-1000">
            Launch Your Token
            <br />
            <span className="text-4xl md:text-6xl">Into the Future</span>
          </h1>

          <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-20 delay-200 duration-1000">
            Create, launch, and manage your token presales with our cutting-edge platform. Join thousands of successful
            projects that chose our launchpad.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in fade-in slide-in-from-bottom-20 delay-400 duration-1000">
            <Button
              size="default"
              className="bg-gradient-to-r from-primary to-yellow-500 hover:from-primary/80 hover:to-yellow-500/80 text-black font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => router.push("/create-token")}
            >
              <Rocket className="w-4 h-4 group-hover:animate-bounce" />
              Launch Your Token
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="default"
              className="border border-neutral-600 text-neutral-300 hover:bg-neutral-800/50 px-6 py-2 backdrop-blur-sm transition-all duration-300 group bg-transparent"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4 text-xs text-neutral-500 animate-in fade-in slide-in-from-bottom-20 delay-600 duration-1000">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse delay-200"></div>
              <span>Instant Deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-400"></div>
              <span>Secure & Audited</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
