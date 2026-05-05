"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gauge, ShieldCheck, Zap, Globe, LayoutDashboard, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="px-6 h-20 flex items-center justify-between border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-xl">
            V
          </div>
          <span className="text-xl font-bold tracking-tight">VJS Admin</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <Link href="/login" className="text-primary hover:underline underline-offset-4">Sign In</Link>
          <Button asChild>
             <Link href="/dashboard/crm">Live Preview</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 animate-bounce">
            <Zap className="h-3 w-3" />
            Next.js 16.1.6 Powered
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent">
            Modern Management for <br />
            <span className="text-primary">Dynamic Content</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            Control your website's soul with our powerful CMS. Real-time updates, 
            rich media management, and intuitive section editing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="h-12 px-8 text-md font-semibold gap-2" asChild>
              <Link href="/dashboard/crm">
                Live Preview <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-md font-semibold" asChild>
               <Link href="/login">Explore Demos</Link>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 py-24 bg-card/30 border-y">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Dynamic CMS</h3>
              <p className="text-muted-foreground">Manage every section of your website dynamically without touching the code.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Secure Access</h3>
              <p className="text-muted-foreground">JWT-based authentication ensures only authorized admins can modify content.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <Gauge className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Performance</h3>
              <p className="text-muted-foreground">Built with Next.js and Turbopack for lightning-fast administration experience.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t flex flex-col md:flex-row items-center justify-between gap-6 bg-card/50">
        <p className="text-sm text-muted-foreground">© 2026 VJS Groups. All rights reserved.</p>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground">Privacy Policy</a>
          <a href="#" className="hover:text-foreground">Terms of Service</a>
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4" />
            <span>English (US)</span>
          </div>
        </div>
      </footer>
    </div>
  )
}