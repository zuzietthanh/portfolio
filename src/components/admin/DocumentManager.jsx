import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Loader2, FileText, Mail, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from "./FileUpload";

const emptyForm = {
  title: "",
  type: "cv",
  file_url: "",
  description: "",
  sort_order: 0,
  is_published: true,
};

const typeIcons = { cv: FileText, cover_letter: Mail, other: FileSpreadsheet };

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Document.list("sort_order", 100);
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const startNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (doc) => {
    setForm({ ...emptyForm, ...doc });
    setEditingId(doc.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
      if (editingId) {
        await base44.entities.Document.update(editingId, payload);
      } else {
        await base44.entities.Document.create(payload);
      }
      setShowForm(false);
      fetchDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this document?")) return;
    await base44.entities.Document.delete(id);
    fetchDocs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{documents.length} document{documents.length !== 1 ? "s" : ""}</p>
        <Button onClick={startNew} className="gap-2 rounded-full">
          <Plus className="h-4 w-4" /> New Document
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : showForm ? (
        <form onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-medium">{editingId ? "Edit Document" : "New Document"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="h-8 w-8 rounded-full glass flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cv">CV</SelectItem>
                  <SelectItem value="cover_letter">Cover Letter</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="mt-1" />
          </div>

          <div>
            <Label className="text-xs">File</Label>
            <div className="mt-1">
              <FileUpload
                value={form.file_url}
                onChange={(v) => setForm({ ...form, file_url: v })}
                accept=".pdf,.doc,.docx,.txt"
                label="Upload Document (PDF, DOC)"
                isImage={false}
              />
            </div>
            {form.file_url && (
              <Input
                value={form.file_url}
                onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                placeholder="or paste a URL"
                className="mt-2 text-xs"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <Label className="text-xs">Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="mt-1" />
            </div>
            <div className="flex items-center justify-between glass rounded-lg px-4 py-2.5">
              <Label className="text-xs">Published</Label>
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editingId ? "Save Changes" : "Create Document"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      ) : documents.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">No documents yet. Upload your CV or cover letter.</p>
          <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> New Document</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const Icon = typeIcons[doc.type] || FileText;
            return (
              <div key={doc.id} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl glass-primary flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {doc.is_published ? <Eye className="h-3.5 w-3.5 text-muted-foreground" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground/50" />}
                </div>
                <h3 className="font-display font-medium text-foreground mb-1">{doc.title}</h3>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-4">{doc.type.replace("_", " ")}</p>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEdit(doc)} className="gap-1.5 rounded-full text-xs">
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(doc.id)} className="text-destructive hover:text-destructive ml-auto">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}