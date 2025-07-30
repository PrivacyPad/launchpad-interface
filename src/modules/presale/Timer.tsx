import useTimerCountdown from "@/hooks/useTimerCountdown";

export default function CountdownTimer({ to }: { to: number | undefined }) {
  const countdown = useTimerCountdown({
    to: to,
  });

  return (
    <div className="grid grid-cols-4 gap-2">
      <div className="bg-neutral-800 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-primary">{countdown?.formatted.day || "00"}</div>
        <div className="text-xs text-neutral-400">Days</div>
      </div>
      <div className="bg-neutral-800 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-primary">{countdown?.formatted.hour || "00"}</div>
        <div className="text-xs text-neutral-400">Hours</div>
      </div>
      <div className="bg-neutral-800 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-primary">{countdown?.formatted.minute || "00"}</div>
        <div className="text-xs text-neutral-400">Min</div>
      </div>
      <div className="bg-neutral-800 rounded-lg p-3 text-center">
        <div className="text-2xl font-bold text-primary">{countdown?.formatted.second || "00"}</div>
        <div className="text-xs text-neutral-400">Sec</div>
      </div>
    </div>
  );
}
