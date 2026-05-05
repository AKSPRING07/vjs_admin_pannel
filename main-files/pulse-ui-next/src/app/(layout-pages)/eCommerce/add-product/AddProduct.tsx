"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash2, Save, Send, Upload, X } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"

const FIELD_CONFIG: any = {
  hero: [
    { id: "title", label: "Hero Title", type: "text" },
    { id: "subtitle", label: "Subtitle", type: "text" },
    { id: "image_url", label: "Background Image", type: "image" },
  ],
  cards: [
    { id: "heading", label: "Section Heading", type: "text" },
    { 
        id: "items", 
        label: "Cards", 
        type: "repeatable", 
        fields: [
            { id: "title", label: "Card Title", type: "text" },
            { id: "description", label: "Description", type: "textarea" },
            { id: "image_url", label: "Card Image", type: "image" },
        ] 
    },
  ],
  text: [
    { id: "heading", label: "Heading", type: "text" },
    { id: "content", label: "Content", type: "textarea" },
  ]
}

export default function AddProduct() {
  const router = useRouter()
  const [selectedPage, setSelectedPage] = useState("")
  const [sections, setSections] = useState<any[]>([])
  const [selectedSectionName, setSelectedSectionName] = useState("")
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [published, setPublished] = useState(false)

  // Fetch sections when page changes
  useEffect(() => {
    if (selectedPage) {
      api.get(`/admin/cms/sections?page=${selectedPage}`)
        .then(setSections)
        .catch((err) => {
          console.error("Section Load Error:", err);
          toast.error("Failed to load sections");
        })
    } else {
      setSections([])
      setSelectedSectionName("")
      setSelectedSection(null)
    }
  }, [selectedPage])

  // Fetch content when section changes
  useEffect(() => {
    if (selectedPage && selectedSectionName) {
      const section = sections.find(s => s.name === selectedSectionName)
      setSelectedSection(section)
      
      setIsLoading(true)
      api.get(`/admin/cms/content?page=${selectedPage}&section=${selectedSectionName}`)
        .then(res => {
          if (res) {
            setFormData(res.content || {})
            setPublished(res.status === "published")
          } else {
            setFormData({})
            setPublished(false)
          }
        })
        .finally(() => setIsLoading(false))
    }
  }, [selectedPage, selectedSectionName, sections])

  const handleFieldChange = (id: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleRepeatableChange = (fieldId: string, index: number, subFieldId: string, value: any) => {
    const newList = [...(formData[fieldId] || [])]
    newList[index] = { ...newList[index], [subFieldId]: value }
    handleFieldChange(fieldId, newList)
  }

  const addRepeatableItem = (fieldId: string) => {
    const newList = [...(formData[fieldId] || []), {}]
    handleFieldChange(fieldId, newList)
  }

  const removeRepeatableItem = (fieldId: string, index: number) => {
    const newList = (formData[fieldId] || []).filter((_: any, i: number) => i !== index)
    handleFieldChange(fieldId, newList)
  }

  const handleSave = async (status: string = "draft") => {
    if (!selectedPage || !selectedSectionName) {
      toast.error("Please select a page and section")
      return
    }
    
    setIsSaving(true)
    try {
      const payload = {
        page: selectedPage,
        section: selectedSectionName,
        type: selectedSection.type,
        content: formData,
        status: status
      }
      await api.put("/admin/cms/content", payload)
      toast.success(status === "published" ? "Content Published!" : "Draft Saved")
      
      if (status === "published") {
        router.push(`/dashboard/crm`) // Or specific page mapping
      }
    } catch (error: any) {
      toast.error("Failed to save: " + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Dynamic Content Editor</h2>
          <p className="text-sm text-muted-foreground">
            Manage your website content by page and section
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setSelectedPage(""); setSelectedSectionName(""); setFormData({}) }}>Clear</Button>
          <Button variant="secondary" onClick={() => handleSave("draft")} disabled={isSaving || !selectedSection}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button onClick={() => handleSave("published")} disabled={isSaving || !selectedSection}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Send className="mr-2 h-4 w-4" /> Publish Content
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">
          {/* SELECTION CARD */}
          <Card>
            <CardHeader>
              <CardTitle>Page & Section Selection</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Select Page</Label>
                <Select value={selectedPage} onValueChange={setSelectedPage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="about">About Us</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="news">News Room</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Section</Label>
                <Select value={selectedSectionName} onValueChange={setSelectedSectionName} disabled={!selectedPage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.map(s => (
                      <SelectItem key={s.name} value={s.name}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="flex justify-center p-12 border rounded-xl bg-card">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* DYNAMIC FORM FIELDS */}
          {!isLoading && selectedSection && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSection.label} Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(FIELD_CONFIG[selectedSection.type] || []).map((field: any) => (
                    <div key={field.id} className="space-y-3">
                      <Label className="text-sm font-medium">{field.label}</Label>
                      
                      {field.type === "text" && (
                        <Input 
                          value={formData[field.id] || ""} 
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                      )}

                      {field.type === "textarea" && (
                        <Textarea 
                          rows={4}
                          value={formData[field.id] || ""} 
                          onChange={(e) => handleFieldChange(field.id, e.target.value)}
                          placeholder={`Enter ${field.label.toLowerCase()}...`}
                        />
                      )}

                      {field.type === "image" && (
                        <ImageUploader 
                           value={formData[field.id]} 
                           onChange={(url) => handleFieldChange(field.id, url)} 
                        />
                      )}

                      {field.type === "repeatable" && (
                        <div className="space-y-4">
                          {(formData[field.id] || []).map((item: any, idx: number) => (
                            <div key={idx} className="p-4 border rounded-lg bg-muted/20 relative group">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-2 right-2 text-destructive h-8 w-8"
                                onClick={() => removeRepeatableItem(field.id, idx)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <div className="grid gap-4 mt-2">
                                  {field.fields.map((f: any) => (
                                      <div key={f.id} className="space-y-1">
                                          <Label className="text-xs">{f.label}</Label>
                                          {f.type === "text" && <Input value={item[f.id] || ""} onChange={(e) => handleRepeatableChange(field.id, idx, f.id, e.target.value)} />}
                                          {f.type === "textarea" && <Textarea rows={3} value={item[f.id] || ""} onChange={(e) => handleRepeatableChange(field.id, idx, f.id, e.target.value)} />}
                                          {f.type === "image" && (
                                               <ImageUploader value={item[f.id]} onChange={(url) => handleRepeatableChange(field.id, idx, f.id, url)} />
                                          )}
                                      </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                          <Button type="button" variant="outline" className="w-full border-dashed" onClick={() => addRepeatableItem(field.id)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Item to {field.label}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* STATUS */}
          <Card>
            <CardHeader>
              <CardTitle>Status & Visibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Published</Label>
                <Switch 
                  checked={published} 
                  onCheckedChange={(val) => {
                    setPublished(val)
                    handleSave(val ? "published" : "draft")
                  }} 
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {published ? "This section is live on the website." : "This section is currently a draft."}
              </p>
            </CardContent>
          </Card>

          {/* HELP INFO */}
          {!selectedSection && (
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm text-center text-muted-foreground italic">
                  Select a page and section to start editing content.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        const res = await api.upload(file)
        onChange(res.url)
        toast.success("Image uploaded")
      } catch (err) {
        toast.error("Upload failed")
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
           <img src={value} className="w-full h-full object-cover" />
           <Button 
             variant="destructive" 
             size="icon" 
             className="absolute top-2 right-2 h-8 w-8" 
             onClick={() => onChange("")}
           >
             <X className="h-4 w-4" />
           </Button>
        </div>
      ) : (
        <div 
          className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="animate-spin h-6 w-6" /> : <Upload className="h-6 w-6 text-muted-foreground mb-2" />}
          <p className="text-xs text-muted-foreground">Click to upload image</p>
        </div>
      )}
      <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={handleUpload} />
    </div>
  )
}
