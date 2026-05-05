"use client"

import { CRUDPage } from "@/components/admin/crud-page"

const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "created_at", header: "Created At" },
]

const formFields = [
  { id: "title", label: "Title" },
  { id: "category", label: "Category" },
  { id: "author", label: "Author" },
  { id: "content", label: "Content" },
  { id: "image_url", label: "Image URL" },
]

export default function BlogsPage() {
  return (
    <CRUDPage
      title="Blog Management"
      entityName="Blog"
      endpoint="/news"
      columns={columns}
      formFields={formFields}
    />
  )
}

