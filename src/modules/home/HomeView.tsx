"use client";

import { EPresaleStatus } from "@/@types/launchpad.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getPresaleStatus, usePresaleListQuery } from "@/hooks/usePresale";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import HeroBanner from "./HeroBanner";
import PresaleItem from "./PresaleItem";
import StatsOverview from "./StatsOverview";

export default function HomeView() {
  const { data: presaleList, isLoading, isPending } = usePresaleListQuery({ enabled: true, refetchInterval: 20_000 });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLaunches = useMemo(() => {
    return presaleList?.filter((launch) => {
      const matchesSearch =
        launch.token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        launch.description.toLowerCase().includes(searchTerm.toLowerCase());
      const status = getPresaleStatus(launch);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [presaleList, searchTerm, statusFilter]);

  return (
    <div className="py-6 space-y-6">
      {/* Hero Banner */}
      <HeroBanner />

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
                    <SelectItem value={EPresaleStatus.Upcoming} className="text-white hover:bg-neutral-700">
                      Upcoming
                    </SelectItem>
                    <SelectItem value={EPresaleStatus.Active} className="text-white hover:bg-neutral-700">
                      Active
                    </SelectItem>
                    <SelectItem value={EPresaleStatus.Completed} className="text-white hover:bg-neutral-700">
                      Completed
                    </SelectItem>
                    <SelectItem value={EPresaleStatus.Failed} className="text-white hover:bg-neutral-700">
                      Failed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {isLoading || isPending ? (
              <>
                <div className="flex items-center justify-center py-10 flex-col gap-2 text-primary">
                  <Loader2 className="size-[1.5em] animate-spin" />
                  <span className="">Loading data...</span>
                </div>
              </>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredLaunches?.map((launch) => {
                    return <PresaleItem key={launch.presaleAddress} presale={launch} />;
                  })}
                  {filteredLaunches?.length === 0 && (
                    <div className="cols-span-1 lg:col-span-2 flex flex-col items-center justify-center text-center text-neutral-400 py-10 gap-2">
                      <svg
                        data-v-ad307406=""
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-12"
                      >
                        <path d="M13 16a3 3 0 0 1 2.24 5"></path>
                        <path d="M18 12h.01"></path>
                        <path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3"></path>
                        <path d="M20 8.54V4a2 2 0 1 0-4 0v3"></path>
                        <path d="M7.612 12.524a3 3 0 1 0-1.6 4.3"></path>
                      </svg>
                      No launches found matching your criteria.
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
