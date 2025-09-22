"use client"
import { Brain } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-black py-4 rounded-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 text-white">
        {/* Logo / Brand */}
        <Link href="/" className="font-bold text-orange-500 flex items-center">
          <Brain className="w-4 h-4 text-orange-500" />
          <h3>WhyTMI</h3>
        </Link>

        {/* Navigation */}
        <nav className="flex gap-6 text-sm">
          <Link href="/about" className="hover:text-orange-500 transition-colors">
            About
          </Link>
          <Link href="/posts" className="hover:text-orange-500 transition-colors">
            Posts
          </Link>
          <Link href="https://linkedin.com/in/younes-aouka-4ra" target="_blank" className="hover:text-orange-500 transition-colors">
            Contact
          </Link>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} WhyTMI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
