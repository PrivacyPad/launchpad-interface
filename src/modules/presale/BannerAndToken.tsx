import { TPresale } from "@/@types/launchpad.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Globe, Heart, MessageSquare, Share2 } from "lucide-react";

export default function BannerAndToken({ launchpadData }: { launchpadData: TPresale }) {
  return (
    <Card className="bg-neutral-900 border-neutral-700 overflow-hidden py-0">
      <div
        className="h-52 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 relative"
        style={
          launchpadData.thumbnail
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7)), url(${launchpadData.thumbnail || "/images/default-banner.jpg"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "transparent",
              }
            : {}
        }
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 left-6 flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={launchpadData.token.icon || "/images/empty-token.webp"} alt={launchpadData.token.name} />
            <AvatarFallback className="bg-primary text-black">{launchpadData.token.symbol}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-white">{launchpadData.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-primary text-black">PRESALE</Badge>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4 text-white" />
                <MessageSquare className="w-4 h-4 text-white" />
                <Share2 className="w-4 h-4 text-white" />
                <Heart className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
