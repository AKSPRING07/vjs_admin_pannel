"use client"

import React, { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface CRUDPageProps<T> {
  title: string
  entityName: string
  initialData: T[]
  columns: ColumnDef<T>[]
  formFields: { id: string; label: string; type?: string }[]
}

export function CRUDPage<T extends { id: string | number }>({
  title,
  entityName,
  initialData,
  columns,
  formFields,
}: CRUDPageProps<T>) {
  const [data, setData] = useState<T[]>(initialData)
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [formData, setFormData] = useState<any>({})

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({})
    setIsOpen(true)
  }

  const handleEdit = (item: T) => {
    setEditingItem(item)
    setFormData(item)
    setIsOpen(true)
  }

  const handleDelete = (id: string | number) => {
    setData(data.filter((item) => item.id !== id))
    toast.success(`${entityName} deleted successfully`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingItem) {
      setData(data.map((item) => (item.id === editingItem.id ? { ...item, ...formData } : item)))
      toast.success(`${entityName} updated successfully`)
    } else {
      const newItem = { ...formData, id: Math.max(0, ...data.map(i => Number(i.id))) + 1 }
      setData([...data, newItem])
      toast.success(`${entityName} added successfully`)
    }
    setIsOpen(false)
  }

  const actionColumn: ColumnDef<T> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => handleEdit(row.original)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(row.original.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  }

  const allColumns = [...columns, actionColumn]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add {entityName}
        </Button>
      </div>

      <DataTable columns={allColumns} data={data} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? `Edit ${entityName}` : `Add ${entityName}`}</DialogTitle>
            <DialogDescription>
              Fill in the details below to {editingItem ? "update" : "create"} the {entityName.toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id}>{field.label}</Label>
                <Input
                  id={field.id}
                  type={field.type || "text"}
                  value={formData[field.id] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
                  required
                />
              </div>
            ))}
            <DialogFooter>
              <Button type="submit">{editingItem ? "Save Changes" : `Add ${entityName}`}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
