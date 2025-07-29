"use client";

import { mockPresale } from "@/data/mock-presale";
import useWeb3 from "@/hooks/useWeb3";
import { C_WETH9 } from "@/web3/core/constants";
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

  // Mock data - in real app, this would be fetched based on launchpad-id
  const launchpadData = mockPresale;

  return (
    <div className="py-6">
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
          <Comments />
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
          <Newsletter />
        </div>
      </div>
    </div>
  );
}
