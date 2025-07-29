import { TPresale } from "@/@types/launchpad.types";
import { CopyButton } from "@/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/utils/format";
import { formatUnits } from "viem";

export default function TokenDetails({ launchpadData }: { launchpadData: TPresale }) {
  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">Token</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-neutral-700">
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium w-1/3">Address</td>
                <td className="py-3 text-sm text-white">
                  <div className="flex items-center gap-2">
                    <div className="bg-neutral-800 px-2 py-1 rounded text-primary text-sm truncate min-w-0">
                      {launchpadData.token.address}
                    </div>
                    <CopyButton text={launchpadData.token.address} />
                  </div>
                </td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Name</td>
                <td className="py-3 text-sm text-white font-medium">{launchpadData.token.name}</td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Symbol</td>
                <td className="py-3 text-sm text-white font-medium">{launchpadData.token.symbol}</td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Decimals</td>
                <td className="py-3 text-sm text-white">{launchpadData.token.decimals}</td>
              </tr>
              <tr className="">
                <td className="py-3 pr-4 text-sm text-neutral-400 font-medium">Total Supply</td>
                <td className="py-3 text-sm text-white">
                  {formatNumber(formatUnits(BigInt(launchpadData.token.totalSupply), launchpadData.token.decimals))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
