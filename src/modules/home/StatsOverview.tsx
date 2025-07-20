import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Rocket, TrendingUp, Users } from "lucide-react";
import React from "react";

export default function StatsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="py-4 bg-neutral-900 border-neutral-700">
        <CardContent className="px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider">TOTAL RAISED</p>
              <p className="text-2xl font-bold text-white">$24.7M</p>
            </div>
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="py-4 bg-neutral-900 border-neutral-700">
        <CardContent className="px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider">ACTIVE LAUNCHES</p>
              <p className="text-2xl font-bold text-white">23</p>
            </div>
            <Rocket className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="py-4 bg-neutral-900 border-neutral-700">
        <CardContent className="px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider">TOTAL INVESTORS</p>
              <p className="text-2xl font-bold text-white">8,947</p>
            </div>
            <Users className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      <Card className="py-4 bg-neutral-900 border-neutral-700">
        <CardContent className="px-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-400 tracking-wider">SUCCESS RATE</p>
              <p className="text-2xl font-bold text-white">94%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
