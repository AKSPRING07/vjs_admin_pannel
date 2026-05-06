import { Suspense } from "react"
import AddProduct from "./AddProduct"

export default function Page() {
  return (
    <Suspense fallback={<div>Loading editor...</div>}>
      <AddProduct />
    </Suspense>
  )
}
