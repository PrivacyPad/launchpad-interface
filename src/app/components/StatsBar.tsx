import React from "react";

export default function StatsBar() {
  const walletConnected = false; // This would typically come from your app's state

  return (
    <div className="bg-neutral-800 border-b border-neutral-700">
      <div className="max-w-320 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-8 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">TOKENS CREATED:</span>
              <span className="text-white">1,247</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">ACTIVE LAUNCHES:</span>
              <span className="text-primary">23</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">TOTAL RAISED:</span>
              <span className="text-white">$24.7M</span>
            </div>
          </div>
          <div className="text-xs text-neutral-500">
            {walletConnected ? (
              <span className="text-primary">WALLET CONNECTED</span>
            ) : (
              <span>WALLET NOT CONNECTED</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
