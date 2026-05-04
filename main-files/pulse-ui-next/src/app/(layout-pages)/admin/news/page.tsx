"use client"

import { CRUDPage } from "@/components/admin/crud-page"

const newsData = [
  { id: 1, title: "New Product Launch", author: "Admin", date: "2024-03-01", summary: "We are excited to announce..." },
  { id: 2, title: "Quarterly Results", author: "Finance", date: "2024-03-05", summary: "Our performance this quarter..." },
]

const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "author", header: "Author" },
  { accessorKey: "date", header: "Date" },
  { accessorKey: "summary", header: "Summary" },
]

const formFields = [
  { id: "title", label: "Title" },
  { id: "author", label: "Author" },
  { id: "date", label: "Date", type: "date" },
  { id: "summary", label: "Summary" },
]

export default function NewsPage() {
  return (
    <CRUDPage
      title="News Management"
      entityName="News"
      initialData={newsData}
      columns={columns}
      formFields={formFields}
    />
  )
}
