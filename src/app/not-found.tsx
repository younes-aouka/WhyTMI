'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-screen text-center gap-6">
      <h1 className="text-7xl font-extrabold text-orange-500">404</h1>
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="text-gray-600 max-w-md">
        Oops! The page you are looking for doesn’t exist.
      </p>
      <div className="flex gap-4 mt-4">
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/posts">Browse posts</Link>
        </Button>
      </div>
    </main>
  )
}
