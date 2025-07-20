"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, Clock, DollarSign, Rocket, Target } from "lucide-react";
import { useState } from "react";

export default function CreateLaunchpadView() {
  const [launchpadData, setLaunchpadData] = useState({
    tokenAddress: "",
    tokenName: "",
    tokenSymbol: "",
    presaleRate: "",
    softCap: "",
    hardCap: "",
    minContribution: "",
    maxContribution: "",
    liquidityPercent: "",
    listingRate: "",
    description: "",
    website: "",
    telegram: "",
    twitter: "",
    logo: null,
  });

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleInputChange = (field: string, value: string) => {
    setLaunchpadData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pb-6 pt-3 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/50 sticky top-0 backdrop-blur-2xl z-10 py-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">CREATE LAUNCHPAD</h1>
          <p className="text-sm text-neutral-400">Set up your token presale campaign</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          >
            Save Draft
          </Button>
          <Button className="bg-primary hover:bg-primary/80 text-black">
            <Rocket className="w-4 h-4" />
            Launch Presale
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Launchpad Form */}
        <Card className="lg:col-span-2 bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PRESALE CONFIGURATION</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Token Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary tracking-wider">TOKEN INFORMATION</h3>

              <div className="space-y-2">
                <Label htmlFor="tokenAddress" className="text-xs text-neutral-400 tracking-wider">
                  TOKEN CONTRACT ADDRESS
                </Label>
                <Input
                  id="tokenAddress"
                  placeholder="0x..."
                  value={launchpadData.tokenAddress}
                  onChange={(e) => handleInputChange("tokenAddress", e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tokenName" className="text-xs text-neutral-400 tracking-wider">
                    TOKEN NAME
                  </Label>
                  <Input
                    id="tokenName"
                    placeholder="Auto-filled from contract"
                    value={launchpadData.tokenName}
                    onChange={(e) => handleInputChange("tokenName", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tokenSymbol" className="text-xs text-neutral-400 tracking-wider">
                    TOKEN SYMBOL
                  </Label>
                  <Input
                    id="tokenSymbol"
                    placeholder="Auto-filled from contract"
                    value={launchpadData.tokenSymbol}
                    onChange={(e) => handleInputChange("tokenSymbol", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Presale Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary tracking-wider">PRESALE DETAILS</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="presaleRate" className="text-xs text-neutral-400 tracking-wider">
                    PRESALE RATE (tokens per ETH)
                  </Label>
                  <Input
                    id="presaleRate"
                    placeholder="e.g., 1000"
                    value={launchpadData.presaleRate}
                    onChange={(e) => handleInputChange("presaleRate", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="listingRate" className="text-xs text-neutral-400 tracking-wider">
                    LISTING RATE (tokens per ETH)
                  </Label>
                  <Input
                    id="listingRate"
                    placeholder="e.g., 800"
                    value={launchpadData.listingRate}
                    onChange={(e) => handleInputChange("listingRate", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="softCap" className="text-xs text-neutral-400 tracking-wider">
                    SOFT CAP (ETH)
                  </Label>
                  <Input
                    id="softCap"
                    placeholder="e.g., 50"
                    value={launchpadData.softCap}
                    onChange={(e) => handleInputChange("softCap", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hardCap" className="text-xs text-neutral-400 tracking-wider">
                    HARD CAP (ETH)
                  </Label>
                  <Input
                    id="hardCap"
                    placeholder="e.g., 200"
                    value={launchpadData.hardCap}
                    onChange={(e) => handleInputChange("hardCap", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minContribution" className="text-xs text-neutral-400 tracking-wider">
                    MIN CONTRIBUTION (ETH)
                  </Label>
                  <Input
                    id="minContribution"
                    placeholder="e.g., 0.1"
                    value={launchpadData.minContribution}
                    onChange={(e) => handleInputChange("minContribution", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxContribution" className="text-xs text-neutral-400 tracking-wider">
                    MAX CONTRIBUTION (ETH)
                  </Label>
                  <Input
                    id="maxContribution"
                    placeholder="e.g., 5"
                    value={launchpadData.maxContribution}
                    onChange={(e) => handleInputChange("maxContribution", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="liquidityPercent" className="text-xs text-neutral-400 tracking-wider">
                  LIQUIDITY PERCENTAGE (%)
                </Label>
                <Input
                  id="liquidityPercent"
                  placeholder="e.g., 70"
                  value={launchpadData.liquidityPercent}
                  onChange={(e) => handleInputChange("liquidityPercent", e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                />
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary tracking-wider">PRESALE TIMELINE</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-neutral-400 tracking-wider">START DATE</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-neutral-800 border-neutral-600 text-white hover:bg-neutral-700"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-600">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-neutral-400 tracking-wider">END DATE</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal bg-neutral-800 border-neutral-600 text-white hover:bg-neutral-700"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-neutral-800 border-neutral-600">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Project Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary tracking-wider">PROJECT INFORMATION</h3>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs text-neutral-400 tracking-wider">
                  PROJECT DESCRIPTION
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its goals, and why investors should participate..."
                  value={launchpadData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 min-h-[120px]"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs text-neutral-400 tracking-wider">
                    WEBSITE
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://yourproject.com"
                    value={launchpadData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telegram" className="text-xs text-neutral-400 tracking-wider">
                      TELEGRAM
                    </Label>
                    <Input
                      id="telegram"
                      placeholder="@yourprojectgroup"
                      value={launchpadData.telegram}
                      onChange={(e) => handleInputChange("telegram", e.target.value)}
                      className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="text-xs text-neutral-400 tracking-wider">
                      TWITTER
                    </Label>
                    <Input
                      id="twitter"
                      placeholder="@yourproject"
                      value={launchpadData.twitter}
                      onChange={(e) => handleInputChange("twitter", e.target.value)}
                      className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview & Summary */}
        <div className="space-y-6">
          {/* Presale Preview */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">PRESALE PREVIEW</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-neutral-800 rounded">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <Rocket className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-white font-bold">{launchpadData.tokenName || "Token Name"}</h3>
                <p className="text-neutral-400 text-sm font-mono">{launchpadData.tokenSymbol || "SYMBOL"}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <DollarSign className="w-3 h-3 text-primary" />
                  <span className="text-neutral-400">Soft Cap:</span>
                  <span className="text-white font-mono">{launchpadData.softCap || "0"} ETH</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Target className="w-3 h-3 text-primary" />
                  <span className="text-neutral-400">Hard Cap:</span>
                  <span className="text-white font-mono">{launchpadData.hardCap || "0"} ETH</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="w-3 h-3 text-primary" />
                  <span className="text-neutral-400">Duration:</span>
                  <span className="text-white">
                    {startDate && endDate
                      ? `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
                      : "Not set"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Structure */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">FEE STRUCTURE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Platform Fee:</span>
                <span className="text-white">2%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Token Fee:</span>
                <span className="text-white">2%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Liquidity Lock:</span>
                <span className="text-white">365 days</span>
              </div>
              <div className="border-t border-neutral-700 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-neutral-400">Total Fees:</span>
                  <span className="text-primary">4%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">REQUIREMENTS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${launchpadData.tokenAddress ? "bg-primary" : "bg-neutral-600"}`}
                />
                <span className={launchpadData.tokenAddress ? "text-white" : "text-neutral-400"}>
                  Valid token contract
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${launchpadData.softCap && launchpadData.hardCap ? "bg-primary" : "bg-neutral-600"}`}
                />
                <span className={launchpadData.softCap && launchpadData.hardCap ? "text-white" : "text-neutral-400"}>
                  Set funding goals
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className={`w-2 h-2 rounded-full ${startDate && endDate ? "bg-primary" : "bg-neutral-600"}`} />
                <span className={startDate && endDate ? "text-white" : "text-neutral-400"}>Set timeline</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div
                  className={`w-2 h-2 rounded-full ${launchpadData.description ? "bg-primary" : "bg-neutral-600"}`}
                />
                <span className={launchpadData.description ? "text-white" : "text-neutral-400"}>
                  Project description
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
