"use client";

import Button from "@/components/Button";
import ComingSoonTooltipWrapper from "@/components/ComingSoonTooltipWrapper";
import DatePicker from "@/components/DatePicker";
import Input from "@/components/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useErc20TokenInfo } from "@/hooks/useErc20";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Rocket } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FeeStructure from "./FeeStructure";
import LaunchPresaleDialog from "./LaunchPresaleDialog";
import PresalePreview from "./PresalePreview";
import Requirements from "./Requirements";
import { createPresaleSchema } from "./helpers";
import { toast } from "sonner";
import { useUploadFile } from "@/hooks/useUploadFile";

export default function CreateLaunchpadView() {
  const form = useForm({
    defaultValues: {
      tokenAddress: "",
      tokenName: "",
      tokenSymbol: "",
      presaleRate: undefined,
      softCap: undefined,
      hardCap: undefined,
      minContribution: undefined,
      maxContribution: undefined,
      liquidityPercent: 60,
      listingRate: undefined,
      description: undefined,
      website: undefined,
      telegram: undefined,
      twitter: undefined,
      startDate: undefined,
      endDate: undefined,
      thumbnail: undefined,
    },
    mode: "all",
    reValidateMode: "onChange",
    resolver: yupResolver(createPresaleSchema, { stripUnknown: false }),
  });

  const [showLaunchDialog, setShowLaunchDialog] = useState(false);

  const launchpadData = form.watch();
  const formState = form.formState;

  const { data: erc20Info, isLoading: isLoadingErc20Info } = useErc20TokenInfo(launchpadData.tokenAddress, {
    staleTime: 60_000, // 1 minute
  });

  const onSubmit = () => {
    setShowLaunchDialog(true);
  };

  const uploadFileMutation = useUploadFile();

  const handleUploadIcon = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 1 * 1024 * 1024) {
        // 1MB limit
        toast.error("Icon file size must be less than 1MB.");
        return;
      }
      if (!["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)) {
        toast.error("Unsupported file format. Please upload a JPEG, PNG, GIF, or WEBP image.");
        form.setValue("thumbnail", "");
        return;
      }
      try {
        form.setValue("thumbnail", "");
        const res = await uploadFileMutation.mutateAsync(file);
        form.setValue("thumbnail", res.url);
      } catch (error) {
        console.error("Error uploading icon:", error);
        toast.error("Failed to upload icon. Please try again.");
        form.setValue("thumbnail", "");
        // Reset the input file
        if (event.target) {
          event.target.value = "";
        }
      }
    } else {
      form.setValue("thumbnail", "");
    }
  };

  useEffect(() => {
    if (erc20Info) {
      form.setValue("tokenName", erc20Info.name);
      form.setValue("tokenSymbol", erc20Info.symbol);
    } else {
      form.setValue("tokenName", "");
      form.setValue("tokenSymbol", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [erc20Info]);

  return (
    <>
      <div className="pb-6 pt-3 space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/50 sticky top-0 backdrop-blur-2xl z-10 py-3">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-wider">CREATE LAUNCHPAD</h1>
            <p className="text-sm text-neutral-400">Set up your token presale campaign</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-primary hover:bg-primary/80 text-black"
              form="create-launchpad-form"
              type="submit"
              disabled={formState.isSubmitting || formState.isLoading}
              loading={formState.isSubmitting}
              icon={<Rocket className="w-4 h-4" />}
            >
              Launch Presale
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Launchpad Form */}
          <Card className="lg:col-span-2 bg-neutral-900 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">
                PRESALE CONFIGURATION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form id="create-launchpad-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      {...form.register("tokenAddress")}
                      value={launchpadData.tokenAddress}
                      error={!!formState.errors.tokenAddress}
                      helperText={formState.errors.tokenAddress?.message}
                      className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tokenName" className="text-xs text-neutral-400 tracking-wider">
                        TOKEN NAME {isLoadingErc20Info ? <Loader2 className="size-[1.2em] animate-spin" /> : null}
                      </Label>
                      <Input
                        id="tokenName"
                        placeholder="Auto-filled from contract"
                        value={launchpadData.tokenName}
                        disabled
                        className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tokenSymbol" className="text-xs text-neutral-400 tracking-wider">
                        TOKEN SYMBOL {isLoadingErc20Info ? <Loader2 className="size-[1.2em] animate-spin" /> : null}
                      </Label>
                      <Input
                        id="tokenSymbol"
                        placeholder="Auto-filled from contract"
                        value={launchpadData.tokenSymbol}
                        disabled
                        className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
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
                        PRESALE RATE (tokens per cWETH)
                      </Label>
                      <Input.Number
                        id="presaleRate"
                        placeholder="e.g., 1000"
                        {...form.register("presaleRate")}
                        value={launchpadData.presaleRate}
                        error={!!formState.errors.presaleRate}
                        helperText={formState.errors.presaleRate?.message}
                        className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="listingRate" className="text-xs text-neutral-400 tracking-wider">
                        LISTING RATE (tokens per cWETH)
                      </Label>
                      <Input.Number
                        id="listingRate"
                        placeholder="e.g., 800"
                        value={launchpadData.listingRate}
                        {...form.register("listingRate")}
                        error={!!formState.errors.listingRate}
                        helperText={formState.errors.listingRate?.message}
                        className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="softCap" className="text-xs text-neutral-400 tracking-wider">
                        SOFT CAP (cWETH)
                      </Label>
                      <Input.Number
                        id="softCap"
                        placeholder="e.g., 50"
                        value={launchpadData.softCap}
                        {...form.register("softCap")}
                        error={!!formState.errors.softCap}
                        helperText={formState.errors.softCap?.message}
                        className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hardCap" className="text-xs text-neutral-400 tracking-wider">
                        HARD CAP (cWETH)
                      </Label>
                      <Input.Number
                        id="hardCap"
                        placeholder="e.g., 200"
                        value={launchpadData.hardCap}
                        {...form.register("hardCap")}
                        error={!!formState.errors.hardCap}
                        helperText={formState.errors.hardCap?.message}
                        className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ComingSoonTooltipWrapper comingSoon>
                      <div className="space-y-2">
                        <Label htmlFor="minContribution" className="text-xs text-neutral-400 tracking-wider">
                          MIN CONTRIBUTION (cWETH)
                        </Label>
                        <Input.Number
                          id="minContribution"
                          placeholder="e.g., 0.1"
                          // value={launchpadData.minContribution}
                          // {...form.register("minContribution")}
                          // error={!!formState.errors.minContribution}
                          // helperText={formState.errors.minContribution?.message}
                          className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                          disabled={true}
                        />
                      </div>
                    </ComingSoonTooltipWrapper>

                    <ComingSoonTooltipWrapper comingSoon>
                      <div className="space-y-2">
                        <Label htmlFor="maxContribution" className="text-xs text-neutral-400 tracking-wider">
                          MAX CONTRIBUTION (cWETH)
                        </Label>
                        <Input.Number
                          id="maxContribution"
                          placeholder="e.g., 5"
                          // value={launchpadData.maxContribution}
                          // {...form.register("maxContribution")}
                          // error={!!formState.errors.maxContribution}
                          // helperText={formState.errors.maxContribution?.message}
                          className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                          disabled={true}
                        />
                      </div>
                    </ComingSoonTooltipWrapper>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="liquidityPercent" className="text-xs text-neutral-400 tracking-wider">
                        LIQUIDITY PERCENTAGE (%)
                      </Label>
                      <Input.Number
                        id="liquidityPercent"
                        placeholder="e.g., 70"
                        value={launchpadData.liquidityPercent}
                        {...form.register("liquidityPercent")}
                        error={!!formState.errors.liquidityPercent}
                        helperText={formState.errors.liquidityPercent?.message}
                        className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                      />
                    </div>

                    {/* <div className="space-y-2">
                      <Label htmlFor="liquidityLockup" className="text-xs text-neutral-400 tracking-wider">
                        LIQUIDITY LOCKUP TIME (days)
                      </Label>
                      <Input.Number
                        id="liquidityLockup"
                        placeholder="e.g., 30"
                        value={launchpadData.liquidityLockup}
                        {...form.register("liquidityLockup")}
                        error={!!formState.errors.liquidityLockup}
                        helperText={formState.errors.liquidityLockup?.message}
                        className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                      />
                    </div> */}
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-primary tracking-wider">PRESALE TIMELINE</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-neutral-400 tracking-wider">START DATE</Label>
                      <DatePicker
                        date={launchpadData.startDate}
                        onChange={(date) => form.setValue("startDate", date!, { shouldValidate: true })}
                        error={!!formState.errors.startDate}
                        helperText={formState.errors.startDate?.message}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-neutral-400 tracking-wider">END DATE</Label>
                      <DatePicker
                        date={launchpadData.endDate}
                        onChange={(date) => form.setValue("endDate", date!, { shouldValidate: true })}
                        error={!!formState.errors.endDate}
                        helperText={formState.errors.endDate?.message}
                      />
                    </div>
                  </div>
                </div>

                {/* Project Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-primary tracking-wider">PROJECT INFORMATION</h3>

                  <div className="space-y-2">
                    <Label htmlFor="icon" className="text-xs text-neutral-400 tracking-wider">
                      PROJECT THUMBNAIL
                    </Label>
                    <Input
                      id="icon"
                      type="file"
                      accept="image/*"
                      onChange={handleUploadIcon}
                      className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                    />
                    <p className="text-xs text-neutral-400">Upload a JPEG, PNG, or GIF image (max 1MB)</p>
                    {uploadFileMutation.isPending && (
                      <div className="flex flex-col gap-2 items-center justify-center mt-2 py-5">
                        <span className="loading loading-spinner size-[1.25em] text-neutral-400"></span>
                        <span className="text-sm text-neutral-400">Uploading image...</span>
                      </div>
                    )}
                    {launchpadData.thumbnail ? (
                      <div className="py-2 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={launchpadData.thumbnail}
                          alt="Project Thumbnail Preview"
                          className="aspect-[3.85] w-full object-cover rounded"
                        />
                      </div>
                    ) : (
                      !uploadFileMutation.isPending && (
                        <div className="flex justify-center py-2">
                          <div className="h-30 w-full border border-dashed border-neutral-600 rounded text-neutral-400 flex items-center justify-center text-sm">
                            No Image
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs text-neutral-400 tracking-wider">
                      PROJECT DESCRIPTION
                    </Label>
                    <Input.Textarea
                      id="description"
                      placeholder="Describe your project, its goals, and why investors should participate..."
                      value={launchpadData.description}
                      {...form.register("description")}
                      error={!!formState.errors.description}
                      helperText={formState.errors.description?.message}
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
                        {...form.register("website")}
                        error={!!formState.errors.website}
                        helperText={formState.errors.website?.message}
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
                          {...form.register("telegram")}
                          error={!!formState.errors.telegram}
                          helperText={formState.errors.telegram?.message}
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
                          {...form.register("twitter")}
                          error={!!formState.errors.twitter}
                          helperText={formState.errors.twitter?.message}
                          className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview & Summary */}
          <div className="space-y-6">
            {/* Presale Preview */}
            <PresalePreview launchpadData={launchpadData} erc20Info={erc20Info} />

            {/* Fee Structure */}
            <FeeStructure />

            {/* Requirements */}
            <Requirements
              validTokenAddress={!!launchpadData.tokenAddress && erc20Info?.address === launchpadData.tokenAddress}
              fundingGoalsSet={!!launchpadData.softCap && !!launchpadData.hardCap}
              timelineSet={!!launchpadData.startDate && !!launchpadData.endDate}
              projectDescriptionProvided={!!launchpadData.description}
            />
          </div>
        </div>
      </div>
      {erc20Info && (
        <LaunchPresaleDialog
          onOpenChange={setShowLaunchDialog}
          open={showLaunchDialog}
          launchpadData={launchpadData}
          erc20Info={erc20Info}
        />
      )}
    </>
  );
}
