import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";

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
            Ready to launch your Token with privacy?
            {/* <br />
            <span className="text-4xl md:text-6xl">Into the Future</span> */}
          </h1>

          <p className="text-sm md:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-20 delay-200 duration-1000">
            Create, launch, and manage your token presales with unparalleled financial privacy. Powered by Fully
            Homomorphic Encryption (FHE) via the Zama protocol, PrivacyPad lets users invest without ever revealing
            individual purchase amounts.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-in fade-in slide-in-from-bottom-20 delay-400 duration-1000">
            <Button
              size="default"
              className="bg-gradient-to-r from-primary to-yellow-500 hover:from-yellow-500 hover:to-primary text-black px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => router.push("/create-launchpad")}
            >
              <Rocket className="w-4 h-4 group-hover:animate-bounce" />
              Launch Privately
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="default"
              className="border border-neutral-600 text-neutral-300 hover:bg-neutral-800/50 hover:border-neutral-500 px-6 py-2 backdrop-blur-sm transition-all duration-300 group bg-transparent"
              asChild
            >
              <a
                href={"https://drive.google.com/file/d/12WK8mYl9Wst-00h34rqEQ8lOr-LC2L6y/view"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Play className="w-4 h-4" />
                Watch Demo
              </a>
            </Button>

            <Button
              variant="outline"
              size="default"
              className="border border-neutral-600 text-neutral-300 hover:bg-neutral-800/50 px-6 py-2 backdrop-blur-sm transition-all duration-300 group bg-transparent"
              asChild
            >
              <a href={"https://github.com/PrivacyPad"} target="_blank" rel="noopener noreferrer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-neutral-500 animate-in fade-in slide-in-from-bottom-20 delay-600 duration-1000">
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
