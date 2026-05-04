"use client"

import { CRUDPage } from "@/components/admin/crud-page"

const aboutData = [
  { id: 1, section: "Our Mission", content: "To provide quality solutions...", lastUpdated: "2024-01-10" },
  { id: 2, section: "Our Vision", content: "To lead the industry in innovation...", lastUpdated: "2024-01-12" },
]

const columns = [
  { accessorKey: "section", header: "Section Title" },
  { accessorKey: "content", header: "Content" },
  { accessorKey: "lastUpdated", header: "Last Updated" },
]

const formFields = [
  { id: "section", label: "Section Title" },
  { id: "content", label: "Content" },
  { id: "lastUpdated", label: "Last Updated", type: "date" },
]

export default function AboutPage() {
  return (
    <CRUDPage
      title="About Us Content"
      entityName="Content Section"
      initialData={aboutData}
      columns={columns}
      formFields={formFields}
    />
  )
}
