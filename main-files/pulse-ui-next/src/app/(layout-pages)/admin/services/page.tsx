"use client"

import { CRUDPage } from "@/components/admin/crud-page"

const servicesData = [
  { id: 1, name: "Web Development", description: "Building responsive websites", status: "Active" },
  { id: 2, name: "SEO Optimization", description: "Improving search rankings", status: "Active" },
]

const columns = [
  { accessorKey: "name", header: "Service Name" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "status", header: "Status" },
]

const formFields = [
  { id: "name", label: "Service Name" },
  { id: "description", label: "Description" },
  { id: "status", label: "Status" },
]

export default function ServicesPage() {
  return (
    <CRUDPage
      title="Services Management"
      entityName="Service"
      initialData={servicesData}
      columns={columns}
      formFields={formFields}
    />
  )
}
