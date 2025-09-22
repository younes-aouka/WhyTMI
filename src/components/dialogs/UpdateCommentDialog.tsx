"use client";

import { PutCommentApi } from "@/APIResponseTypes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenSquareIcon } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRef, useState } from "react";
import showToaster from "./ShowToaster";

export function UpdateCommentDialog({
  commentId,
  comment,
  router,
}: {
  commentId: number;
  comment: string;
  router: AppRouterInstance;
}) {
  const [value, setValue] = useState<string>(comment);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const updateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/apis/comment", {
        method: "PUT",
        body: JSON.stringify({ commentId, comment: value }),
        headers: { "Content-Type": "application/json" },
      });
      const serverValidatingResult: PutCommentApi = await res.json();
      if (serverValidatingResult.success === false) {
        if (serverValidatingResult.errors.authorization === true) {
          router.push("/");
        } else {
          setError("Your comment must be between 1 and 200 characters!");
        }
      } else {
        closeRef.current?.click();
        router.refresh();
      }
    } catch (err) {
      showToaster();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-orange-400 cursor-pointer" size="icon">
          <PenSquareIcon />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={updateComment}>
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 mb-4" >
            <div className="grid gap-2">
              <Label htmlFor="comment">Your Comment</Label>
              <Input
                id="comment"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-16"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild ref={closeRef}>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
