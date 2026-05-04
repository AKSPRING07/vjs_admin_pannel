import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import Button from "@/components/ui/button"

const sections = [
  { id: "hero", label: "Home" },
  { id: "features", label: "Features" },
  { id: "ecommerce", label: "eCommerce" },
  { id: "tech", label: "Tech Stack" },
  { id: "included", label: "Included" },
  { id: "faq", label: "FAQ" },
  { id: "pricing", label: "Pricing" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  // Detect scroll for shadow + background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      sections.forEach((section) => {
        const el = document.getElementById(section.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActive(section.id)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom flex items-center justify-between py-4">

        {/* Logo */}
        <a
          href="#"
          className={`text-xl font-bold transition ${
            scrolled ? "text-black" : "text-black"
          }`}
        >
          Pulse UI
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
          {sections.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`
                  px-4 py-2 rounded-full transition-all duration-300 transform
                  ${
                    active === item.id
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-black hover:scale-105"
                  }
                `}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:block">
          <Button className="px-6 py-2 animate-pulse">
            Buy Now
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="flex flex-col p-6 gap-4 text-sm font-medium">
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 hover:text-black"
              >
                {item.label}
              </a>
            ))}

            <Button className="mt-4 w-full">
              Buy Now
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}