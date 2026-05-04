import Navbar from "../components/layout/Navbar"
import Hero from "../components/sections/Hero"
import Features from "../components/sections/Features"
import Ecommerce from "../components/sections/Ecommerce"
import TechStack from "../components/sections/TechStack"
import Included from "../components/sections/Included"
import FAQ from "../components/sections/FAQ"
import Pricing from "../components/sections/Pricing"
import Footer from "../components/layout/Footer"
import Demos from "../components/sections/Demos"
import BackToTop from "../components/layout/BackToTop"

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Demos />
      <Features />
      <Ecommerce />
      <TechStack />
      <Included />
      <FAQ />
      <Pricing />
      <Footer />
      {/* <StickyCTA /> */}
      <BackToTop />
    </>
  )
}