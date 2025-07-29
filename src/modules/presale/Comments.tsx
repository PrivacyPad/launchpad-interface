import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function Comments() {
  return (
    <Card className="bg-neutral-900 border-neutral-700">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-white">Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-neutral-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-4" />
          <p>No comments yet</p>
          <p className="text-sm">Be the first to share your thoughts!</p>
        </div>
      </CardContent>
    </Card>
  );
}
