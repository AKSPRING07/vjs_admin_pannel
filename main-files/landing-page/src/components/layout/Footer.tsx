export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container-custom grid md:grid-cols-3 gap-12">

        <div>
          <h3 className="text-xl font-bold mb-4">Pulse UI</h3>
          <p className="text-gray-400">
            Modern ShadCN eCommerce Admin Template built for
            developers and SaaS founders.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#features">Features</a></li>
            <li><a href="#ecommerce">eCommerce</a></li>
            <li><a href="#tech">Tech Stack</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li>Email Support</li>
            <li>Documentation</li>
            <li>Free Updates</li>
          </ul>
        </div>

      </div>

      <div className="container-custom mt-12 border-t border-gray-800 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Pulse UI. All rights reserved.
      </div>
    </footer>
  )
}