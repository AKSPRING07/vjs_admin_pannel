import Button from "@/components/ui/button"
import FadeIn from "@/components/ui/FadeIn"
import { ArrowUpRight } from "lucide-react"

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-32 overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] -z-10" />

      {/* Decorative Blur Circle */}
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] -z-10" />

      <div className="container-custom text-center">

        <FadeIn>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            Build production-ready  <br />
            <span className="text-black">dashboards in hours — not weeks</span>
          </h1>
        </FadeIn>

        <FadeIn>
          <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Build scalable SaaS dashboards faster using ShadCN UI,
            Tailwind CSS and clean React architecture.
          </p>
        </FadeIn>

        <div className="mt-10 flex justify-center gap-6">
          <Button asChild className="text-lg px-8 py-4">
            <a
              href="http://localhost:3000/dashboard/crm/"
              className="flex items-center gap-2"
            >
              Live Preview
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </Button>

          <Button asChild variant="outline" className="text-lg px-8 py-4">
            <a href="#demos">
              Explore Demos
            </a>
          </Button>
        </div>

      </div>
    </section>
  )
}