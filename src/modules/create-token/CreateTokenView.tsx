"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTokenFactoryContractWrite } from "@/hooks/useContract";
import { useUploadFile } from "@/hooks/useUploadFile";
import useWeb3 from "@/hooks/useWeb3";
import { toastTxSuccess } from "@/lib/toast";
import yup from "@/lib/yup";
import { formatNumber } from "@/utils/format";
import { yupResolver } from "@hookform/resolvers/yup";
import { EventLog } from "ethers";
import { Info, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  symbol: yup.string().required("Symbol is required"),
  decimals: yup
    .number()
    .integer("Decimals must be an integer")
    .min(6, "Decimals must be at least 6")
    .max(18, "Decimals must be at most 18")
    .required("Decimals is required"),
  totalSupply: yup
    .number()
    .integer("Total supply must be an integer")
    .positive("Total supply must be a positive number")
    .required("Total supply is required"),
  description: yup.string().optional(),
  website: yup.string().url("Invalid URL").optional(),
  telegram: yup.string().optional(),
  twitter: yup.string().optional(),
  iconFile: yup
    .mixed<FileList | File[]>()
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || !(value as FileList | File[])[0]) return true; // Allow empty or no file
      const file = (value as FileList | File[])[0];
      return file && ["image/jpeg", "image/png", "image/gif"].includes(file.type);
    })
    .optional(),
  icon: yup.string().optional(), // For compatibility with the form, but not used directly
});
type FormData = yup.InferType<typeof schema>;

export default function CreateTokenView() {
  const { address } = useWeb3();
  const tokenFactoryContract = useTokenFactoryContractWrite();

  const form = useForm({
    defaultValues: {
      name: "",
      symbol: "",
      decimals: 18,
      totalSupply: 1_000_000_000,
      description: "",
      website: "",
      telegram: "",
      twitter: "",
      icon: undefined,
      iconFile: undefined,
    },
    mode: "onTouched",
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });
  const tokenData = form.watch();
  const formState = form.formState;

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
      if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
        toast.error("Unsupported file format. Please upload a JPEG, PNG, or GIF image.");
        return;
      }
      try {
        const res = await uploadFileMutation.mutateAsync(file);
        form.setValue("icon", res.url);
      } catch (error) {
        console.error("Error uploading icon:", error);
        toast.error("Failed to upload icon. Please try again.");
        form.setValue("icon", "");
        // Reset the input file
        if (event.target) {
          event.target.value = "";
        }
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (!address) {
        throw new Error("Please connect your wallet to create a token.");
      }
      if (!tokenFactoryContract) {
        throw new Error("Token Factory contract is not available.");
      }
      const totalSupplyInWei = BigInt(data.totalSupply) * BigInt(10) ** BigInt(data.decimals);
      const tx = await tokenFactoryContract.createToken(
        data.name,
        data.symbol,
        data.decimals,
        totalSupplyInWei,
        data.website || ""
      );
      const receipt = await tx.wait();

      // Read the address from TokenCreated event
      const event = receipt?.logs?.[2] as EventLog;
      const tokenAddress = event.args[0];
      toastTxSuccess("Token created successfully!", tx.hash);
      console.log({
        tokenAddress,
        name: data.name,
        symbol: data.symbol,
        decimals: data.decimals,
        totalSupply: data.totalSupply,
        description: data.description,
        website: data.website,
        telegram: data.telegram,
        twitter: data.twitter,
      });
    } catch (error) {
      console.error("Error creating token:", error);
      toast.error("Failed to create token. Please try again.");
    }
  };

  return (
    <div className="pb-6 pt-3 space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-background/50 sticky top-0 backdrop-blur-2xl z-10 py-3">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wider">CREATE TOKEN</h1>
          <p className="text-sm text-neutral-400">Deploy your ERC-20 token</p>
        </div>
        <div className="flex gap-2">
          <Button
            form="create-token-form"
            type="submit"
            loading={formState.isSubmitting}
            disabled={!formState.isValid || formState.isValidating || formState.isLoading || formState.isSubmitting}
          >
            {!formState.isSubmitting && <Zap className="w-4 h-4" />}
            Deploy Token
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Token Form */}
        <Card className="lg:col-span-2 bg-neutral-900 border-neutral-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-neutral-300 tracking-wider">TOKEN CONFIGURATION</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="create-token-form">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-primary tracking-wider">BASIC INFORMATION</h3>

                <div className="space-y-2">
                  <Label htmlFor="icon" className="text-xs text-neutral-400 tracking-wider">
                    TOKEN ICON
                  </Label>
                  <Input
                    id="icon"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadIcon}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                  <p className="text-xs text-neutral-400">
                    Upload a JPEG, PNG, or GIF image (max 1MB). Recommended size: 256x256px.
                  </p>
                  {uploadFileMutation.isPending && (
                    <div className="flex flex-col gap-2 items-center justify-center mt-2">
                      <span className="loading loading-spinner size-[1.25em]"></span>
                    </div>
                  )}
                  {tokenData.icon && (
                    <div className="mt-2 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tokenData.icon}
                        alt="Token Icon Preview"
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs text-neutral-400 tracking-wider">
                      TOKEN NAME
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., My Awesome Token"
                      {...form.register("name")}
                      onChange={() => {}}
                      error={!!formState.errors.name}
                      helperText={formState.errors.name?.message}
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
                      {...form.register("symbol")}
                      error={!!formState.errors.symbol}
                      helperText={formState.errors.symbol?.message}
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
                      min="6"
                      max="18"
                      placeholder="e.g., 18"
                      {...form.register("decimals")}
                      error={!!formState.errors.decimals}
                      helperText={formState.errors.decimals?.message}
                      className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalSupply" className="text-xs text-neutral-400 tracking-wider">
                      TOTAL SUPPLY
                    </Label>
                    <Input.Number
                      id="totalSupply"
                      placeholder="e.g., 1000000"
                      {...form.register("totalSupply")}
                      value={tokenData.totalSupply}
                      error={!!formState.errors.totalSupply}
                      helperText={formState.errors.totalSupply?.message}
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
                    {...form.register("description")}
                    className="bg-neutral-800 border-neutral-600 text-white placeholder-neutral-400"
                  />
                </div>
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
                        placeholder="@yourtokengroup"
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
                        placeholder="@yourtoken"
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
                  {tokenData.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={tokenData.icon} alt="Token Icon" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-black text-xl font-bold">
                      {tokenData.symbol ? tokenData.symbol.charAt(0) : "?"}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-bold">{tokenData.name || "Token Name"}</h3>
                <p className="text-neutral-400 text-sm">{tokenData.symbol || "SYMBOL"}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Supply:</span>
                  <span className="text-white">{formatNumber(tokenData.totalSupply || "0")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Decimals:</span>
                  <span className="text-white">{tokenData.decimals}</span>
                </div>
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
                <div className="text-sm text-neutral-300">
                  Estimated gas fee: <span className="text-white">0.0012 ETH</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Network:</span>
                  <span className="text-white">Sepolia</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Standard:</span>
                  <span className="text-white">ERC-20</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
