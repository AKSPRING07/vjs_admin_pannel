"use client"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Upload } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function AddProduct() {
// State for published status
  const [published, setPublished] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("about")

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Add New Content</h2>
          <p className="text-sm text-muted-foreground">
            Create and manage your website content
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline">Clear</Button>
          <Button variant="secondary">Save Draft</Button>
          <Button>Publish Content</Button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* LEFT COLUMN */}
        <div className="space-y-6 lg:col-span-2">

          {/* GENERAL INFO */}
          <Card>
            <CardHeader>
              <CardTitle>Content Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Title</Label>
                <Input placeholder="Enter content title" />
              </div>

              <div className="space-y-2">
                <Label>Page</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="home">Home</SelectItem>
                    <SelectItem value="about">About Us</SelectItem>
                    <SelectItem value="journey">Our Journey</SelectItem>
                    <SelectItem value="groups">Our Groups</SelectItem>
                    <SelectItem value="advisors">Advisors</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="sustainability">Sustainability</SelectItem>
                    <SelectItem value="foundation">Foundation</SelectItem>
                    <SelectItem value="news">News Room</SelectItem>
                    <SelectItem value="blog">Blog</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Section</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory === "about" ? (
                      <>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="overview">Overview</SelectItem>
                        <SelectItem value="mission">Mission</SelectItem>
                        <SelectItem value="team">Team</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="hero">Hero</SelectItem>
                        <SelectItem value="content">Main Content</SelectItem>
                        <SelectItem value="footer">Footer Info</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Textarea rows={6} placeholder="Enter content description..." />
              </div>
            </CardContent>
          </Card>

          {/* DYNAMIC FIELDS */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input placeholder="e.g. Learn More" />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input placeholder="https://..." />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MEDIA */}
          <ProductImageUploader />

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
                  onCheckedChange={setPublished} 
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {published ? "Content is live on the website." : "Content is saved as a draft."}
              </p>
            </CardContent>
          </Card>

          {/* SETTINGS */}
          <Card>
            <CardHeader>
              <CardTitle>CMS Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Author</Label>
                <Input placeholder="Admin" />
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input placeholder="news, update, journey" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Separate component for image uploading and preview
function ProductImageUploader() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [images, setImages] = useState<string[]>([])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    )

    setImages((prev) => [...prev, ...newImages])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFiles(e.dataTransfer.files)
          }}
          className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground hover:bg-muted/40"
        >
          <Upload className="mb-2 h-6 w-6" />
          <p>
            Drag & drop images here or{" "}
            <span className="font-medium text-primary">
              click to upload
            </span>
          </p>

          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((src, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-md border"
              >
                <img
                  src={src}
                  alt="Product"
                  className="h-full w-full object-cover"
                />

                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute right-2 top-2 h-7 w-7 opacity-0 group-hover:opacity-100"
                  onClick={() =>
                    setImages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

