import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Rocket, TrendingUp, Users } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function StatsOverview() {
  const [animatedStats, setAnimatedStats] = useState({
    totalRaised: 0,
    activeLaunches: 0,
    totalInvestors: 0,
    successRate: 0,
  });

  // Animate stats on mount
  useEffect(() => {
    const targets = {
      totalRaised: 24.7,
      activeLaunches: 23,
      totalInvestors: 8947,
      successRate: 94,
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        totalRaised: Math.floor(targets.totalRaised * progress * 10) / 10,
        activeLaunches: Math.floor(targets.activeLaunches * progress),
        totalInvestors: Math.floor(targets.totalInvestors * progress),
        successRate: Math.floor(targets.successRate * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700">
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-2">TOTAL RAISED</p>
              <p className="text-3xl font-bold text-white">${animatedStats.totalRaised}M</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 group">
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-2">ACTIVE LAUNCHES</p>
              <p className="text-3xl font-bold text-white">{animatedStats.activeLaunches}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 group">
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-2">TOTAL INVESTORS</p>
              <p className="text-3xl font-bold text-white">{animatedStats.totalInvestors.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="w-8 h-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700 group">
        <CardContent className="">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider mb-2">SUCCESS RATE</p>
              <p className="text-3xl font-bold text-white">{animatedStats.successRate}%</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
