"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Copy, Globe, MessageSquare, Share2, Heart } from "lucide-react";

export default function PresaleView() {
  const params = useParams();
  const router = useRouter();
  const [investAmount, setInvestAmount] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 9,
    minutes: 52,
    seconds: 47,
  });

  // Mock data - in real app, this would be fetched based on launchpad-id
  const launchpadData = {
    id: params["launchpad-id"],
    name: "Hyfye Fairlaunch",
    symbol: "HYE",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-orSetJcYiOXYGaKNZQ1OSgKSDoe2BF.png",
    bannerImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-orSetJcYiOXYGaKNZQ1OSgKSDoe2BF.png",
    contractAddress: "0x6f3d4cc1c2f3f9a67a8f1c6a6b7f6c5d4e3f2a1b",
    description: `🚀 Hyfye - Web3 for Everyone
• Earn & spend HYE tokens in daily life
• 🎮 Mini Degen + Streamer extensions
• 🎯 Gamified social experiences
• 💰 Earn from posts & shares
• 🎓 Students earn via school marks
• 🏆 Leaderboards & competitions
• 🏋️ Fitness & lifestyle rewards
• 🌾 Agriculture & industry tools
• 🤝 Get paid for ad engagement
• 💚 Earn/achieve HYE anytime
• 🔗 Seamlessly connect with tech users
#Hyfye #HYE #Web3ForAll #PinkSale #EarnWithHYE`,

    // Token Details
    tokenAddress: "0x6f3d4cc1c2f3f9a67a8f1c6a6b7f6c5d4e3f2a1b",
    tokenName: "Hyfye",
    tokenSymbol: "HYE",
    decimals: 18,
    totalSupply: "1,000,000,000,000",

    // Pool Info
    tokensForPresale: "600,000,000,000 HYE",
    tokensForLiquidity: "19,950,000,000 HYE",
    initialMarketCap: "$7,460.58M",
    softCap: "5 BNB",
    hardCap: "10 BNB",

    // Timeline
    startTime: "2025.07.21 21:00 (UTC)",
    endTime: "2025.07.27 21:00 (UTC)",
    listingOn: "PancakeSwap",

    // Percentages
    liquidityPercent: "35%",
    buybackPercent: "16%",
    liquidityLockupTime: "90 days after pool ends",

    // Current Status
    status: "upcoming",
    currentRaised: "0 BNB",
    progress: 0,
    participants: 0,

    // Buyback Info
    totalBuybackAmount: "0.5 BNB",
    buybackAmount: "0 BNB",
    buybackRemainAmount: "0.5 BNB",
    amountPerBuyback: "1 BNB",
    minBuybackDelay: "5 minutes",
    maxBuybackDelay: "2 days",

    // Social Links
    website: "https://hyfye.com",
    telegram: "@hyfyeofficial",
    twitter: "@HyfyeOfficial",
    discord: "discord.gg/hyfye",
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const connectWallet = () => {
    setWalletConnected(true);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner and Token Header */}
          <Card className="bg-neutral-900 border-neutral-700 overflow-hidden py-0">
            <div className="h-48 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 left-6 flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-blue-600 text-2xl font-bold">H</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{launchpadData.name}</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-blue-500 text-white">FAIR</Badge>
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

          {/* About Section */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-neutral-300 text-sm leading-relaxed">
                {launchpadData.description}
              </div>
            </CardContent>
          </Card>

          {/* Token Details */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Token</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-neutral-700">
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium w-1/3">Address</td>
                      <td className="py-3 text-sm text-white">
                        <div className="flex items-center gap-2">
                          <code className="bg-neutral-800 px-2 py-1 rounded text-primary text-xs">
                            {launchpadData.tokenAddress}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(launchpadData.tokenAddress)}
                            className="text-neutral-400 hover:text-white p-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Name</td>
                      <td className="py-3 text-sm text-white font-medium">{launchpadData.tokenName}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Symbol</td>
                      <td className="py-3 text-sm text-white font-medium">{launchpadData.tokenSymbol}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Decimals</td>
                      <td className="py-3 text-sm text-white">{launchpadData.decimals}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Total Supply</td>
                      <td className="py-3 text-sm text-white">{launchpadData.totalSupply}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pool Info */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Pool Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-neutral-700">
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium w-1/3">Address</td>
                      <td className="py-3 text-sm text-white">
                        <div className="flex items-center gap-2">
                          <code className="bg-neutral-800 px-2 py-1 rounded text-primary text-xs">
                            {launchpadData.contractAddress}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(launchpadData.contractAddress)}
                            className="text-neutral-400 hover:text-white p-1"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Tokens For Presale</td>
                      <td className="py-3 text-sm text-white">{launchpadData.tokensForPresale}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Tokens For Liquidity</td>
                      <td className="py-3 text-sm text-white">{launchpadData.tokensForLiquidity}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Initial Market Cap</td>
                      <td className="py-3 text-sm text-white">{launchpadData.initialMarketCap}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Soft Cap</td>
                      <td className="py-3 text-sm text-white">{launchpadData.softCap}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Hard Cap</td>
                      <td className="py-3 text-sm text-white">{launchpadData.hardCap}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Start Time</td>
                      <td className="py-3 text-sm text-white">{launchpadData.startTime}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">End Time</td>
                      <td className="py-3 text-sm text-white">{launchpadData.endTime}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Listing On</td>
                      <td className="py-3 text-sm">
                        <span className="text-primary font-medium">{launchpadData.listingOn}</span>
                      </td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Liquidity Percent</td>
                      <td className="py-3 text-sm text-white">{launchpadData.liquidityPercent}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Buyback Percent</td>
                      <td className="py-3 text-sm text-white">{launchpadData.buybackPercent}</td>
                    </tr>
                    <tr className="">
                      <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Liquidity Lockup Time</td>
                      <td className="py-3 text-sm text-white">{launchpadData.liquidityLockupTime}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Discussion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-neutral-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4" />
                <p>No comments yet</p>
                <p className="text-sm">Be the first to share your thoughts!</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Countdown */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardContent className="">
              <div className="text-center space-y-4">
                <div className="bg-orange-500/10 border border-orange-500/30 p-3">
                  <div className="text-orange-400 text-sm font-medium">AFFILIATE</div>
                  <div className="text-white text-xs mt-1">Presale Starts In</div>
                </div>

                {/* Countdown Timer */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-neutral-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{timeLeft.days.toString().padStart(2, "0")}</div>
                    <div className="text-xs text-neutral-400">Days</div>
                  </div>
                  <div className="bg-neutral-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{timeLeft.hours.toString().padStart(2, "0")}</div>
                    <div className="text-xs text-neutral-400">Hours</div>
                  </div>
                  <div className="bg-neutral-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {timeLeft.minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-neutral-400">Min</div>
                  </div>
                  <div className="bg-neutral-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {timeLeft.seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-xs text-neutral-400">Sec</div>
                  </div>
                </div>

                {/* Investment Interface */}
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Amount</span>
                    <span className="text-white">0 BNB (0.0%)</span>
                  </div>

                  <div className="relative">
                    <Input
                      placeholder="0"
                      value={investAmount}
                      onChange={(e) => setInvestAmount(e.target.value)}
                      className="bg-neutral-800 border-neutral-600 text-white text-right pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <span className="text-sm text-white">BNB</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <Button variant="link" className="text-primary text-xs p-0 h-auto">
                      MAX
                    </Button>
                  </div>

                  {!walletConnected ? (
                    <Button
                      onClick={connectWallet}
                      className="w-full bg-primary hover:bg-primary/80 text-black font-semibold"
                    >
                      Connect Wallet
                    </Button>
                  ) : (
                    <Button className="w-full bg-primary hover:bg-primary/80 text-black font-semibold">
                      Contribute
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full border-neutral-700 text-neutral-400 hover:bg-neutral-800 bg-transparent"
                  >
                    Whitelist Only
                  </Button>
                </div>

                {/* Status Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Status</span>
                    <Badge className="bg-blue-500/20 text-blue-400">Upcoming</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Sale Type</span>
                    <span className="text-white">Public</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Current Raised</span>
                    <span className="text-white">0 BNB (0.0%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buyback Info */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">Buyback Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Buyback Amount</span>
                  <span className="text-white">{launchpadData.totalBuybackAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Buyback Amount</span>
                  <span className="text-white">{launchpadData.buybackAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Buyback Remain Amount</span>
                  <span className="text-white">{launchpadData.buybackRemainAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Amount Per Buyback</span>
                  <span className="text-white">{launchpadData.amountPerBuyback}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Min Buyback Delay</span>
                  <span className="text-white">{launchpadData.minBuybackDelay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Max Buyback Delay</span>
                  <span className="text-white">{launchpadData.maxBuybackDelay}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Newsletter */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">Newsletters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-xs text-neutral-400">
                  Sign up our mailing list to receive our new presales, features, tips and reviews for next 1000x
                  projects.
                </p>
                <Input
                  placeholder="your@email.com"
                  className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                />
                <Button className="w-full bg-primary hover:bg-primary/80 text-black">Subscribe</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
