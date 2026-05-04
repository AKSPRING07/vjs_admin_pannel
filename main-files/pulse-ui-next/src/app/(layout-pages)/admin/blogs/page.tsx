"use client"

import { CRUDPage } from "@/components/admin/crud-page"

const blogData = [
  { id: 1, title: "Modern Web Trends", category: "Technology", author: "John Doe", publishDate: "2024-02-15" },
  { id: 2, title: "Healthy Living Tips", category: "Lifestyle", author: "Jane Smith", publishDate: "2024-02-20" },
]

const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "publishDate", header: "Publish Date" },
]

const formFields = [
  { id: "title", label: "Title" },
  { id: "category", label: "Category" },
  { id: "author", label: "Author" },
  { id: "publishDate", label: "Publish Date", type: "date" },
]

export default function BlogsPage() {
  return (
    <CRUDPage
      title="Blog Management"
      entityName="Blog"
      initialData={blogData}
      columns={columns}
      formFields={formFields}
    />
  )
}
