import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

export default function About({ description }: { description: string }) {
  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">About</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-line text-neutral-300 text-sm leading-relaxed">{description}</div>
      </CardContent>
    </Card>
  );
}
