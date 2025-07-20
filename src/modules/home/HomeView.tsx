"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users } from "lucide-react";
import { useState } from "react";
import StatsOverview from "./StatsOverview";
import Link from "next/link";

export default function HomeView() {
  const recentLaunches = [
    {
      id: "TKN-001",
      name: "MOONSHOT",
      symbol: "MOON",
      raised: "$125,000",
      target: "$500,000",
      progress: 25,
      status: "active",
      timeLeft: "5 days",
      description: "Revolutionary DeFi protocol focused on yield optimization and automated market making strategies.",
      website: "https://moonshot.finance",
      telegram: "@moonshotfinance",
      twitter: "@MoonshotDeFi",
      participants: 1247,
      minContribution: "0.1 ETH",
      maxContribution: "5 ETH",
    },
    {
      id: "TKN-002",
      name: "DEFI PROTOCOL",
      symbol: "DEFI",
      raised: "$890,000",
      target: "$1,000,000",
      progress: 89,
      status: "active",
      timeLeft: "2 days",
      description:
        "Next-generation decentralized finance platform with cross-chain capabilities and advanced lending protocols.",
      website: "https://defiprotocol.io",
      telegram: "@defiprotocol",
      twitter: "@DeFiProtocol",
      participants: 3456,
      minContribution: "0.2 ETH",
      maxContribution: "10 ETH",
    },
    {
      id: "TKN-003",
      name: "GAMING TOKEN",
      symbol: "GAME",
      raised: "$2,100,000",
      target: "$2,000,000",
      progress: 100,
      status: "completed",
      timeLeft: "Completed",
      description: "Play-to-earn gaming ecosystem with NFT integration and metaverse compatibility.",
      website: "https://gamingtoken.gg",
      telegram: "@gamingtoken",
      twitter: "@GamingTokenGG",
      participants: 5678,
      minContribution: "0.05 ETH",
      maxContribution: "3 ETH",
    },
    {
      id: "TKN-004",
      name: "AI NETWORK",
      symbol: "AINE",
      raised: "$45,000",
      target: "$300,000",
      progress: 15,
      status: "failed",
      timeLeft: "Failed",
      description:
        "Artificial intelligence-powered blockchain network for decentralized machine learning applications.",
      website: "https://ainetwork.tech",
      telegram: "@ainetwork",
      twitter: "@AINetworkTech",
      participants: 234,
      minContribution: "0.1 ETH",
      maxContribution: "2 ETH",
    },
    {
      id: "TKN-005",
      name: "METAVERSE COIN",
      symbol: "META",
      raised: "$0",
      target: "$800,000",
      progress: 0,
      status: "upcoming",
      timeLeft: "Starts in 3 days",
      description:
        "Virtual reality metaverse platform with land ownership, avatar customization, and social experiences.",
      website: "https://metaversecoin.world",
      telegram: "@metaversecoin",
      twitter: "@MetaverseCoin",
      participants: 0,
      minContribution: "0.1 ETH",
      maxContribution: "8 ETH",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  type Launch = (typeof recentLaunches)[number];
  const [selectedSale, setSelectedSale] = useState<Launch | null>(null);

  const filteredLaunches = recentLaunches.filter((launch) => {
    const matchesSearch =
      launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      launch.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      launch.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || launch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          bg: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20",
          border: "border-blue-500/50",
          text: "text-blue-400",
          badge: "bg-blue-500/20 text-blue-400",
          icon: "🚀",
        };
      // case "active":
      //   return {
      //     bg: "bg-gradient-to-br from-primary/30 via-yellow-500/20 to-orange-500/30",
      //     border: "border-primary shadow-lg shadow-primary/20",
      //     text: "text-primary",
      //     badge: "bg-primary/20 text-primary",
      //     icon: "⚡",
      //   };
      case "completed":
        return {
          bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
          border: "border-green-500/50",
          text: "text-green-400",
          badge: "bg-green-500/20 text-green-400",
          icon: "✅",
        };
      case "failed":
        return {
          bg: "bg-gradient-to-r from-red-500/20 to-pink-500/20",
          border: "border-red-500/50",
          text: "text-red-400",
          badge: "bg-red-500/20 text-red-400",
          icon: "❌",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-neutral-800/50 to-neutral-700/50",
          border: "border-neutral-600",
          text: "text-neutral-400",
          badge: "bg-neutral-500/20 text-neutral-400",
          icon: "⏳",
        };
    }
  };

  return (
    <div className="py-6 space-y-6">
      {/* Stats Overview */}
      <StatsOverview />

      <div className="grid grid-cols-1 gap-6">
        {/* Recent Launches */}
        <Card className="bg-neutral-900 border-neutral-700">
          <CardHeader className="">
            <CardTitle className="text-xl font-bold text-white tracking-wider">TOKEN LAUNCHES</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search launches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 max-w-120"
                />
              </div>
              <div className="">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-neutral-800 border-neutral-600 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-600" side="bottom" align="end">
                    <SelectItem value="all" className="text-white hover:bg-neutral-700">
                      All Status
                    </SelectItem>
                    <SelectItem value="upcoming" className="text-white hover:bg-neutral-700">
                      Upcoming
                    </SelectItem>
                    <SelectItem value="active" className="text-white hover:bg-neutral-700">
                      Active
                    </SelectItem>
                    <SelectItem value="completed" className="text-white hover:bg-neutral-700">
                      Completed
                    </SelectItem>
                    <SelectItem value="failed" className="text-white hover:bg-neutral-700">
                      Failed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredLaunches.map((launch) => {
                const statusConfig = getStatusConfig(launch.status);
                return (
                  <div
                    key={launch.id}
                    className={`${statusConfig.bg} ${statusConfig.border} border p-6 transition-all duration-300 hover:scale-[1.01] group relative overflow-hidden`}
                    onClick={() => setSelectedSale(launch)}
                  >
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 ${launch.status === "active" ? "bg-gradient-to-br from-primary via-yellow-500 to-orange-500 shadow-lg shadow-primary/50" : "bg-gradient-to-br from-primary to-yellow-500"} flex items-center justify-center`}
                          >
                            <span className="text-black text-lg font-bold">{launch.symbol.charAt(0)}</span>
                          </div>
                          <div>
                            <h3
                              className={`text-lg font-bold ${launch.status === "active" ? "text-white group-hover:text-primary bg-gradient-to-r from-white to-primary bg-clip-text" : "text-white group-hover:text-primary"} transition-colors`}
                            >
                              {launch.name}
                            </h3>
                            <p className="text-sm text-neutral-400">{launch.symbol}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{statusConfig.icon}</span>
                          <div
                            className={`px-3 py-1 text-xs font-medium ${launch.status === "active" ? "bg-gradient-to-r from-primary to-yellow-500 text-black shadow-lg" : statusConfig.badge}`}
                          >
                            {launch.status.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-neutral-300 mb-4 line-clamp-2">{launch.description}</p>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-neutral-400">Progress</span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`${launch.status === "active" ? "text-primary font-bold" : statusConfig.text}`}
                            >
                              {launch.status === "active" ? "? / ?" : `${launch.raised} / ${launch.target}`}
                            </span>
                            <span className="text-neutral-500">
                              {launch.status === "active" ? "(?%)" : `(${launch.progress}%)`}
                            </span>
                          </div>
                        </div>

                        {launch.status !== "upcoming" && launch.status !== "active" && (
                          <div
                            className={`w-full ${launch.status === "active" ? "bg-neutral-700 shadow-inner" : "bg-neutral-800"} h-3 overflow-hidden`}
                          >
                            <div
                              className={`h-3 transition-all duration-500 ${
                                launch.status === "completed"
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                  : launch.status === "failed"
                                    ? "bg-gradient-to-r from-red-500 to-pink-500"
                                    : "bg-gradient-to-r from-primary via-yellow-500 to-orange-500 shadow-lg"
                              } ${launch.status === "active" ? "animate-pulse" : ""}`}
                              style={{ width: `${launch.progress}%` }}
                            ></div>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4 text-xs text-neutral-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{launch.timeLeft}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{launch.participants.toLocaleString()}</span>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className={`bg-gradient-to-r from-primary to-yellow-500 text-black font-semibold hover:opacity-80 transition-all`}
                            asChild
                          >
                            <Link href={`/launchpad/${launch.id}`}>View</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
