"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Eye, Code, Zap, Info } from "lucide-react";

export default function CreateTokenView() {
  const [tokenData, setTokenData] = useState({
    name: "",
    symbol: "",
    decimals: "18",
    totalSupply: "",
    description: "",
    website: "",
    telegram: "",
    twitter: "",
    mintable: false,
    burnable: false,
    pausable: false,
    taxable: false,
    taxRate: "0",
  });

  const [step, setStep] = useState(1);

  const handleInputChange = (field: string, value: string | boolean) => {
    setTokenData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pb-6 pt-3 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/50 sticky top-0 backdrop-blur-2xl z-10 py-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">CREATE TOKEN</h1>
          <p className="text-sm text-neutral-400">Deploy your custom ERC-20 token</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-300 bg-transparent"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button className="bg-primary hover:bg-primary/80 text-black">
            <Zap className="w-4 h-4" />
            Deploy Token
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="bg-neutral-900 border-neutral-700 py-4">
        <CardContent className="px-4">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: "Basic Info", active: step >= 1 },
              { step: 2, title: "Features", active: step >= 2 },
              { step: 3, title: "Social Links", active: step >= 3 },
              { step: 4, title: "Deploy", active: step >= 4 },
            ].map((item, index) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    item.active ? "bg-primary text-black" : "bg-neutral-700 text-neutral-400"
                  }`}
                >
                  {item.step}
                </div>
                <span className={`ml-2 text-xs ${item.active ? "text-white" : "text-neutral-400"}`}>{item.title}</span>
                {index < 3 && <div className={`w-12 h-px mx-4 ${item.active ? "bg-primary" : "bg-neutral-700"}`} />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Form */}
        <Card className="lg:col-span-2 bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">TOKEN CONFIGURATION</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary tracking-wider">BASIC INFORMATION</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs text-neutral-400 tracking-wider">
                    TOKEN NAME
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., My Awesome Token"
                    value={tokenData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symbol" className="text-xs text-neutral-400 tracking-wider">
                    SYMBOL
                  </Label>
                  <Input
                    id="symbol"
                    placeholder="e.g., MAT"
                    value={tokenData.symbol}
                    onChange={(e) => handleInputChange("symbol", e.target.value.toUpperCase())}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="decimals" className="text-xs text-neutral-400 tracking-wider">
                    DECIMALS
                  </Label>
                  <Input
                    id="decimals"
                    type="number"
                    value={tokenData.decimals}
                    onChange={(e) => handleInputChange("decimals", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalSupply" className="text-xs text-neutral-400 tracking-wider">
                    TOTAL SUPPLY
                  </Label>
                  <Input
                    id="totalSupply"
                    placeholder="e.g., 1000000"
                    value={tokenData.totalSupply}
                    onChange={(e) => handleInputChange("totalSupply", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs text-neutral-400 tracking-wider">
                  DESCRIPTION
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your token and its use case..."
                  value={tokenData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400 min-h-[100px]"
                />
              </div>
            </div>

            {/* Token Features */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary tracking-wider">TOKEN FEATURES</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded">
                  <div>
                    <div className="text-sm text-white">Mintable</div>
                    <div className="text-xs text-neutral-400">Allow creating new tokens</div>
                  </div>
                  <Switch
                    checked={tokenData.mintable}
                    onCheckedChange={(checked) => handleInputChange("mintable", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded">
                  <div>
                    <div className="text-sm text-white">Burnable</div>
                    <div className="text-xs text-neutral-400">Allow destroying tokens</div>
                  </div>
                  <Switch
                    checked={tokenData.burnable}
                    onCheckedChange={(checked) => handleInputChange("burnable", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded">
                  <div>
                    <div className="text-sm text-white">Pausable</div>
                    <div className="text-xs text-neutral-400">Allow pausing transfers</div>
                  </div>
                  <Switch
                    checked={tokenData.pausable}
                    onCheckedChange={(checked) => handleInputChange("pausable", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-neutral-800 rounded">
                  <div>
                    <div className="text-sm text-white">Taxable</div>
                    <div className="text-xs text-neutral-400">Apply tax on transfers</div>
                  </div>
                  <Switch
                    checked={tokenData.taxable}
                    onCheckedChange={(checked) => handleInputChange("taxable", checked)}
                  />
                </div>
              </div>

              {tokenData.taxable && (
                <div className="space-y-2">
                  <Label htmlFor="taxRate" className="text-xs text-neutral-400 tracking-wider">
                    TAX RATE (%)
                  </Label>
                  <Input
                    id="taxRate"
                    type="number"
                    min="0"
                    max="25"
                    value={tokenData.taxRate}
                    onChange={(e) => handleInputChange("taxRate", e.target.value)}
                    className="bg-neutral-800 border-neutral-600 text-white"
                  />
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-primary tracking-wider">SOCIAL LINKS</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs text-neutral-400 tracking-wider">
                    WEBSITE
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://yourtoken.com"
                    value={tokenData.website}
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
                      placeholder="@yourtokengroup"
                      value={tokenData.telegram}
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
                      placeholder="@yourtoken"
                      value={tokenData.twitter}
                      onChange={(e) => handleInputChange("twitter", e.target.value)}
                      className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview & Info */}
        <div className="space-y-6">
          {/* Token Preview */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">TOKEN PREVIEW</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-neutral-800 rounded">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-black text-xl font-bold">
                    {tokenData.symbol ? tokenData.symbol.charAt(0) : "?"}
                  </span>
                </div>
                <h3 className="text-white font-bold">{tokenData.name || "Token Name"}</h3>
                <p className="text-neutral-400 text-sm">{tokenData.symbol || "SYMBOL"}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Supply:</span>
                  <span className="text-white">{tokenData.totalSupply || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Decimals:</span>
                  <span className="text-white">{tokenData.decimals}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {tokenData.mintable && <Badge className="bg-primary/20 text-primary text-xs">Mintable</Badge>}
                {tokenData.burnable && <Badge className="bg-primary/20 text-primary text-xs">Burnable</Badge>}
                {tokenData.pausable && <Badge className="bg-primary/20 text-primary text-xs">Pausable</Badge>}
                {tokenData.taxable && <Badge className="bg-primary/20 text-primary text-xs">Taxable</Badge>}
              </div>
            </CardContent>
          </Card>

          {/* Deployment Info */}
          <Card className="bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">DEPLOYMENT INFO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-neutral-800 rounded">
                <Info className="w-4 h-4 text-primary" />
                <div className="text-xs text-neutral-300">
                  Estimated gas fee: <span className="text-white">0.05 ETH</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Network:</span>
                  <span className="text-white">Ethereum Mainnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Standard:</span>
                  <span className="text-white">ERC-20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Compiler:</span>
                  <span className="text-white">Solidity 0.8.19</span>
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/80 text-black"
                disabled={!tokenData.name || !tokenData.symbol || !tokenData.totalSupply}
              >
                <Code className="w-4 h-4" />
                Generate Contract
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
