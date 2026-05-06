"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Save, 
  Send, 
  Upload, 
  X, 
  Edit2, 
  Layers,
  AlertCircle,
  CheckCircle2,
  Database,
  ArrowRight
} from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { useRouter, useSearchParams } from "next/navigation"

const FIELD_CONFIG: any = {
  hero: [
    { id: "title", label: "Hero Title", type: "text" },
    { id: "subtitle", label: "Subtitle", type: "text" },
    { id: "cta_text", label: "Button Text", type: "text" },
    { id: "video_url", label: "Video Background (URL)", type: "text" },
    { id: "image_url", label: "Image Background", type: "image" },
  ],
  cards: [
    { id: "title", label: "Card Title", type: "text" },
    { id: "description", label: "Description", type: "textarea" },
    { id: "image_url", label: "Card Image", type: "image" },
  ],
  news: [
    { id: "title", label: "News Title", type: "text" },
    { id: "author", label: "Author", type: "text" },
    { id: "date", label: "Date", type: "text" },
    { id: "description", label: "Description", type: "textarea" },
    { id: "image_url", label: "Feature Image", type: "image" },
  ],
  text: [
    { id: "heading", label: "Heading", type: "text" },
    { id: "subtitle", label: "Subheading", type: "text" },
    { id: "content", label: "Content", type: "textarea" },
    { id: "author", label: "Author/Source", type: "text" },
    { id: "role", label: "Role/Tag", type: "text" },
  ]
}

export default function AddProduct() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20"><Loader2 className="animate-spin" /></div>}>
      <AddProductContent />
    </Suspense>
  )
}

function AddProductContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [selectedPage, setSelectedPage] = useState(searchParams.get("page") || "")
  const [selectedSubpage, setSelectedSubpage] = useState(searchParams.get("subpage") || "")
  const [sections, setSections] = useState<any[]>([])
  const [selectedSectionName, setSelectedSectionName] = useState(searchParams.get("section") || "")
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [selectedAction, setSelectedAction] = useState<string>("")
  
  const [formData, setFormData] = useState<any>({})
  const [cardFormData, setCardFormData] = useState<any>({})
  const [editingCardId, setEditingCardId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [published, setPublished] = useState(false)
  const [contentId, setContentId] = useState<string | null>(null)

  // Fetch sections when page or subpage changes
  useEffect(() => {
    if (selectedPage) {
      const url = `/admin/cms/sections?page=${selectedPage}${selectedSubpage ? `&subpage=${selectedSubpage}` : ""}`
      api.get(url).then(setSections).catch(() => toast.error("Failed to load sections"))
    } else {
      setSections([])
    }
  }, [selectedPage, selectedSubpage])

  // Fetch content when section changes
  const fetchCurrentContent = async () => {
    if (selectedPage && selectedSectionName) {
      const section = sections.find(s => s.name === selectedSectionName)
      if (!section) return
      
      setSelectedSection(section)
      setIsLoading(true)
      
      const url = `/admin/cms/content?page=${selectedPage}&section=${selectedSectionName}${selectedSubpage ? `&subpage=${selectedSubpage}` : ""}`
      
      try {
        const res = await api.get(url)
        if (res) {
          setContentId(res._id || res.id)
          let content = res.content || (['cards', 'news'].includes(section.type) ? [] : {})
          
          // Robustness: Handle legacy object structures {'items': [...]}
          if (['cards', 'news'].includes(section.type) && !Array.isArray(content) && content && typeof content === 'object' && content.items) {
            content = content.items
          }
          
          setFormData(content)
          setPublished(res.status === "published")
        } else {
          setContentId(null)
          setFormData(['cards', 'news'].includes(section.type) ? [] : {})
          setPublished(false)
        }
      } catch (err) {
        toast.error("Failed to load content")
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchCurrentContent()
  }, [selectedPage, selectedSectionName, sections, selectedSubpage])

  const handleFieldChange = (id: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleSaveAll = async (status: "draft" | "published") => {
    if (!selectedPage || !selectedSectionName) {
      toast.error("Selection required")
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        page: selectedPage,
        subpage: selectedSubpage,
        section: selectedSectionName,
        type: selectedSection.type,
        content: formData,
        status
      }
      const res = await api.put("/admin/cms/content", payload)
      if (status === "published") {
        await api.put(`/admin/cms/content/${res._id || res.id}/publish`, {})
        toast.success("Published Successfully")
      } else {
        toast.success("Draft Saved Successfully")
      }
      fetchCurrentContent()
    } catch (error: any) {
      toast.error("Action failed")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCardAction = async (action: "create_card" | "update_card" | "delete_card", cardId?: string, data?: any) => {
    setIsSaving(true)
    try {
      const payload: any = {
        page: selectedPage,
        subpage: selectedSubpage,
        section: selectedSectionName,
        type: selectedSection.type,
        action,
        card_id: cardId,
        data: data,
        status: published ? "published" : "draft"
      }
      
      await api.put("/admin/cms/content", payload)
      toast.success("Database Updated Successfully")
      setEditingCardId(null)
      setCardFormData({})
      if (action === 'create_card') setSelectedAction('update') // Switch to update to see the new card
      fetchCurrentContent()
    } catch (error: any) {
      toast.error("Card action failed")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* GLOBAL ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm sticky top-0 z-[100] backdrop-blur-md bg-white/80">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
             <Database className="text-indigo-600 h-8 w-8" />
             Content Controller
          </h2>
          <p className="text-slate-500 font-medium">Manage hierarchical business content and card sections.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-200" onClick={handleSaveAll.bind(null, "draft")} disabled={isSaving || !selectedSection}>
             Save Draft
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200" onClick={handleSaveAll.bind(null, "published")} disabled={isSaving || !selectedSection}>
            {isSaving ? <Loader2 className="mr-2 animate-spin h-4 w-4" /> : <Send className="mr-2 h-4 w-4" />}
            Publish to Website
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* LEFT NAV - SELECTION */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-700">Target Location</CardTitle>
            </div>
            <CardContent className="p-6 space-y-6">
              {/* PAGE */}
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Main Page</Label>
                <Select value={selectedPage} onValueChange={(v) => { setSelectedPage(v); setSelectedSubpage(""); setSelectedSectionName(""); setSelectedAction("") }}>
                  <SelectTrigger className="h-12 border-slate-200">
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="about">About Us</SelectItem>
                    <SelectItem value="business">Business Verticals</SelectItem>
                    <SelectItem value="newsroom">Newsroom</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SUBPAGE */}
              {selectedPage && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Sub-Section</Label>
                  <Select value={selectedSubpage} onValueChange={(v) => { setSelectedSubpage(v); setSelectedSectionName(""); setSelectedAction("") }}>
                    <SelectTrigger className="h-12 border-slate-200">
                      <SelectValue placeholder="Select sub-section" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedPage === "about" && (
                        <>
                          <SelectItem value="about-group">About Group</SelectItem>
                          <SelectItem value="journey">Our Journey</SelectItem>
                          <SelectItem value="leadership">Leadership</SelectItem>
                          <SelectItem value="awards">Awards</SelectItem>
                        </>
                      )}
                      {selectedPage === "business" && (
                        <>
                          <SelectItem value="it-consulting">IT Consulting</SelectItem>
                          <SelectItem value="data-centers">Enterprise Data Centers & Hosting Services</SelectItem>
                          <SelectItem value="export-import">Export & Import</SelectItem>
                          <SelectItem value="plantations">Plantations & Exotic Trees</SelectItem>
                          <SelectItem value="it-training">IT Training</SelectItem>
                          <SelectItem value="yoga-wellness">Yoga & Wellness</SelectItem>
                          <SelectItem value="property-services">Property Services</SelectItem>
                          <SelectItem value="green-energy">Green Energy & Solar Manufacturing</SelectItem>
                          <SelectItem value="logistics">Logistics Services</SelectItem>
                          <SelectItem value="travel-rentals">Travel & Rentals</SelectItem>
                        </>
                      )}
                      {selectedPage === "newsroom" && <SelectItem value="media-release">Media Release</SelectItem>}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* SECTION / CATEGORY */}
              {selectedSubpage && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Category</Label>
                  <Select value={selectedSectionName} onValueChange={(v) => { setSelectedSectionName(v); setSelectedAction("") }}>
                    <SelectTrigger className="h-12 border-slate-200">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map(s => (
                        <SelectItem key={s.name} value={s.name}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* ACTION SELECTION */}
              {selectedSection && (selectedSection.type === 'cards' || selectedSection.type === 'news') && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Action Mode</Label>
                  <Select value={selectedAction} onValueChange={(v) => { setSelectedAction(v); setEditingCardId(null); setCardFormData({}) }}>
                    <SelectTrigger className="h-12 border-indigo-200 bg-indigo-50/30 text-indigo-700 font-bold">
                      <SelectValue placeholder="What do you want to do?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="update">Update Existing Items</SelectItem>
                      <SelectItem value="delete">Delete Items</SelectItem>
                      <SelectItem value="create">Create New Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {selectedSection && (
             <div className={`p-4 rounded-2xl border flex items-center justify-between ${published ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                   {published ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                   {published ? 'Live on Site' : 'Draft Mode'}
                </div>
                <div className="h-2 w-2 rounded-full animate-pulse bg-current"></div>
             </div>
          )}
        </div>

        {/* RIGHT AREA - DYNAMIC WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-32 bg-white rounded-3xl border border-dashed">
              <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing Database...</p>
            </div>
          ) : !selectedSection ? (
            <div className="flex flex-col items-center justify-center p-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-8">
                 <ArrowRight className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Configure Location</h3>
              <p className="text-slate-500 text-center mt-3 max-w-sm font-medium">Select a page, sub-section, and category from the left to unlock management tools.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* SINGLE FORMS (Hero, Text) */}
              {(selectedSection.type === "hero" || selectedSection.type === "text") && (
                <Card className="border-slate-100 shadow-xl rounded-3xl overflow-hidden">
                  <div className="px-8 py-6 border-b bg-slate-50/50">
                    <CardTitle className="text-xl font-black text-slate-900">{selectedSection.label} Editor</CardTitle>
                  </div>
                  <CardContent className="p-10 space-y-10">
                    {FIELD_CONFIG[selectedSection.type].map((field: any) => (
                      <div key={field.id} className="space-y-4">
                        <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">{field.label}</Label>
                        {field.type === "text" && <Input className="h-14 border-slate-200 focus:ring-indigo-500" value={formData[field.id] || ""} onChange={(e) => handleFieldChange(field.id, e.target.value)} />}
                        {field.type === "textarea" && <Textarea rows={8} className="text-lg border-slate-200 focus:ring-indigo-500" value={formData[field.id] || ""} onChange={(e) => handleFieldChange(field.id, e.target.value)} />}
                        {field.type === "image" && <ImageUploader value={formData[field.id]} onChange={(url) => handleFieldChange(field.id, url)} />}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* CARD MANAGEMENT MODES */}
              {(selectedSection.type === "cards" || selectedSection.type === "news") && (
                <div className="space-y-8">
                  {/* UPDATE / DELETE LIST */}
                  {(selectedAction === "update" || selectedAction === "delete") && (
                    <Card className="border-slate-100 shadow-xl rounded-3xl overflow-hidden">
                      <div className="px-8 py-6 border-b bg-slate-50/50 flex items-center justify-between">
                         <CardTitle className="text-xl font-black text-slate-900">
                           {selectedAction === 'update' ? 'All Items (Edit Mode)' : 'Danger Zone (Delete Mode)'}
                         </CardTitle>
                         <Badge className={selectedAction === 'update' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-rose-50 text-rose-700 border-rose-100'}>
                           {formData.length || 0} Items Found
                         </Badge>
                      </div>
                      <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                          {(!formData || !Array.isArray(formData) || formData.length === 0) ? (
                            <div className="p-20 text-center">
                               <p className="text-slate-400 font-bold">No items currently stored in this category.</p>
                            </div>
                          ) : (
                            formData.map((card: any, idx: number) => (
                              <div key={card._card_id || idx} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-6">
                                  {card.image_url && (
                                    <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                                       <img src={card.image_url} className="h-full w-full object-cover" />
                                    </div>
                                  )}
                                  <div>
                                    <h4 className="font-black text-slate-900 text-lg leading-tight">{card.title || 'Untitled Item'}</h4>
                                    <p className="text-slate-500 text-sm mt-1 max-w-lg line-clamp-1">{card.description || 'No description provided.'}</p>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  {selectedAction === "update" ? (
                                    <Button 
                                      variant="outline" 
                                      className="rounded-full border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 px-6"
                                      onClick={() => { setEditingCardId(card._card_id); setCardFormData(card); setSelectedAction("edit_single") }}
                                    >
                                      Edit Details
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="destructive" 
                                      className="rounded-full px-6"
                                      onClick={() => handleCardAction("delete_card", card._card_id)}
                                    >
                                      Confirm Delete
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* CREATE OR EDIT SINGLE FORM */}
                  {(selectedAction === "create" || selectedAction === "edit_single") && (
                    <Card className="border-slate-100 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95">
                      <div className="px-8 py-6 border-b bg-indigo-600 flex items-center justify-between text-white">
                        <CardTitle className="text-xl font-black">
                          {selectedAction === 'edit_single' ? 'Refine Item Details' : 'New Item Creation'}
                        </CardTitle>
                        <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full" onClick={() => setSelectedAction("update")}>
                           <X className="h-5 w-5" />
                        </Button>
                      </div>
                      <CardContent className="p-10 space-y-8">
                        {FIELD_CONFIG[selectedSection.type].map((field: any) => (
                          <div key={field.id} className="space-y-3">
                            <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">{field.label}</Label>
                            {field.type === "text" && <Input className="h-12 border-slate-200" value={cardFormData[field.id] || ""} onChange={(e) => setCardFormData({ ...cardFormData, [field.id]: e.target.value })} />}
                            {field.type === "textarea" && <Textarea rows={5} className="border-slate-200" value={cardFormData[field.id] || ""} onChange={(e) => setCardFormData({ ...cardFormData, [field.id]: e.target.value })} />}
                            {field.type === "image" && <ImageUploader value={cardFormData[field.id]} onChange={(url) => setCardFormData({ ...cardFormData, [field.id]: url })} />}
                          </div>
                        ))}
                        <div className="flex justify-end gap-4 pt-6">
                          <Button variant="ghost" className="rounded-full px-8" onClick={() => setSelectedAction("update")}>Discard</Button>
                          <Button 
                            className="bg-indigo-600 hover:bg-indigo-700 rounded-full px-10 shadow-lg shadow-indigo-100" 
                            onClick={() => handleCardAction(editingCardId ? "update_card" : "create_card", editingCardId || undefined, cardFormData)}
                            disabled={isSaving}
                          >
                            {isSaving && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
                            {editingCardId ? 'Save Database Updates' : 'Add to Collection'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* NO ACTION SELECTED FALLBACK */}
                  {!selectedAction && (
                     <div className="flex flex-col items-center justify-center p-20 bg-indigo-50/30 rounded-3xl border border-indigo-100 border-dashed">
                        <ArrowRight className="h-12 w-12 text-indigo-200 mb-6" />
                        <h4 className="text-indigo-900 font-black text-xl">Select an Action</h4>
                        <p className="text-indigo-600/60 font-medium mt-2">Choose "Update", "Delete", or "Create" from the left sidebar to proceed.</p>
                     </div>
                  )}
                </div>
              )}
            </div>
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
        toast.success("Image Stored")
      } catch (err) {
        toast.error("Upload failed")
      } finally {
        setIsUploading(false)
      }
    }
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative group w-full aspect-video rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
          <img src={value} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <Button variant="destructive" className="rounded-full" size="sm" onClick={() => onChange("")}><Trash2 className="mr-2 h-4 w-4" /> Replace Image</Button>
          </div>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center border-4 border-dashed border-slate-100 rounded-3xl p-16 cursor-pointer hover:bg-slate-50 hover:border-indigo-200 transition-all"
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? <Loader2 className="animate-spin h-10 w-10 text-indigo-600" /> : <Upload className="h-10 w-10 text-slate-200 mb-6" />}
          <p className="text-lg font-black text-slate-400">Media Portal</p>
          <p className="text-slate-400 font-medium text-sm mt-1">Click to browse your local files</p>
        </div>
      )}
      <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={handleUpload} />
    </div>
  )
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${className}`}>
      {children}
    </span>
  )
}
