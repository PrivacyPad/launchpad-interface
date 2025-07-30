"use client";

import { usePresaleQuery } from "@/hooks/usePresale";
import useWeb3 from "@/hooks/useWeb3";
import { C_WETH9 } from "@/web3/core/constants";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import About from "./About";
import Actions from "./Actions";
import BannerAndToken from "./BannerAndToken";
import Comments from "./Comments";
import ContributionInfo from "./ContributionInfo";
import Newsletter from "./Newsletter";
import PoolInfo from "./PoolInfo";
import PresaleForm from "./PresaleForm";
import TokenDetails from "./TokenDetails";

export default function PresaleView() {
  const { chainId, address } = useWeb3();
  const CWETH = C_WETH9[chainId];

  const presaleAddress = useParams().id as string;

  const {
    data: launchpadData,
    isLoading,
    isPending,
  } = usePresaleQuery(presaleAddress, {
    enabled: true,
  });

  return (
    <div className="py-6">
      {isLoading || isPending ? (
        <div className="flex items-center justify-center py-10 flex-col gap-2 text-primary">
          <Loader2 className="size-[1.5em] animate-spin" />
          <span className="">Loading data...</span>
        </div>
      ) : (
        <div>
          {launchpadData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Banner and Token Header */}
                <BannerAndToken launchpadData={launchpadData} />

                {/* About Section */}
                <About description={launchpadData.description} />

                {/* Token Details */}
                <TokenDetails launchpadData={launchpadData} />

                {/* Pool Info */}
                <PoolInfo launchpadData={launchpadData} CWETH={CWETH} />

                {/* Comments Section */}
                {address && <Comments />}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status and Countdown */}
                <PresaleForm launchpadData={launchpadData} CWETH={CWETH} />

                {/* User Contribution Info */}
                {address && <ContributionInfo launchpadData={launchpadData} CWETH={CWETH} address={address} />}

                {/* Actions */}
                {address && <Actions launchpadData={launchpadData} address={address} />}

                {/* Newsletter */}
                {/* <Newsletter /> */}
              </div>
            </div>
          )}
          {!launchpadData && (
            <div className="text-center py-12 text-neutral-400">
              <p className="text-lg">Presale not found</p>
              <p className="text-sm">The presale you are looking for does not exist or has been removed.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
