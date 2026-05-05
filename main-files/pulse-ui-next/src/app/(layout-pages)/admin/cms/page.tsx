import { CMSEditor } from "@/components/admin/cms-editor"

export default function CMSPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dynamic CMS Editor</h1>
        <p className="text-muted-foreground">Select a page and section to edit dynamic content.</p>
      </div>
      <CMSEditor />
    </div>
  )
}
