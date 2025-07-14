"use client";

import Link from "next/link";
import { Zap, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getGitHubStars } from "@/utils/github";

export default function Navbar() {
  const [stars, setStars] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const repo = "idee8/shipfree";

  useEffect(() => {
    getGitHubStars(repo).then(setStars);
  }, []);

  const formatStars = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#212121]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Zap
              className="h-10 w-10"
              fill="#FFBE18"
              stroke="black"
              strokeWidth={1.4}
            />
            <span className="text-lg font-semibold text-white">Atmet</span>
          </Link>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="#pricing"
            className="text-base text-white/90 transition hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-base text-white/90 transition hover:text-white"
          >
            FAQ
          </Link>
          <Link
            href="#wall-of-love"
            className="text-base text-white/90 transition hover:text-white"
          >
            Wall of love
          </Link>
          <Link
            href="/affiliates/signup"
            className="text-base text-white/90 transition hover:text-white"
          >
            Affiliate
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 rounded-md bg-[#2C2C2C] px-4 py-2 text-sm text-white/90 transition hover:bg-[#3C3C3C]"
          >
            Log in
          </Link>
        </div>

        <div className="flex md:hidden">
          <button
            type="button"
            onClick={toggleMenu}
            className="inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:text-white"
          >
            <span className="sr-only">Toggle menu</span>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {/* Search Bar - Mobile */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-md bg-[#2C2C2C] px-4 py-3 pl-10 text-sm text-white/90 placeholder-white/60 outline-none focus:bg-[#3C3C3C]"
                />
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <Link
              href="#pricing"
              className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:bg-[#3C3C3C] hover:text-white"
              onClick={toggleMenu}
            >
              Pricing
            </Link>
            <Link
              href="#faq"
              className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:bg-[#3C3C3C] hover:text-white"
              onClick={toggleMenu}
            >
              FAQ
            </Link>
            <Link
              href="#wall-of-love"
              className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:bg-[#3C3C3C] hover:text-white"
              onClick={toggleMenu}
            >
              Wall of love
            </Link>
            <Link
              href="/affiliates/signup"
              className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:bg-[#3C3C3C] hover:text-white"
              onClick={toggleMenu}
            >
              Affiliate
            </Link>
            <Link
              href="/auth/login"
              className="block rounded-md bg-[#2C2C2C] px-3 py-2 text-base font-medium text-white/90 hover:bg-[#3C3C3C] hover:text-white mt-4"
              onClick={toggleMenu}
            >
              Log in
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
