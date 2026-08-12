import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, X, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const emptyForm = {
  label: "",
  url: "",
  icon: "globe",
  sort_order: 0,
  is_published: true,
};

const iconOptions = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "github", label: "GitHub" },
  { value: "twitter", label: "Twitter" },
  { value: "email", label: "Email" },
  { value: "globe", label: "Website" },
  { value: "dribbble", label: "Dribbble" },
  { value: "medium", label: "Medium" },
];

export default function LinkManager() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.ProfessionalLink.list("sort_order", 100);
      setLinks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const startNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (link) => {
    setForm({ ...emptyForm, ...link });
    setEditingId(link.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
      if (editingId) {
        await base44.entities.ProfessionalLink.update(editingId, payload);
      } else {
        await base44.entities.ProfessionalLink.create(payload);
      }
      setShowForm(false);
      fetchLinks();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this link?")) return;
    await base44.entities.ProfessionalLink.delete(id);
    fetchLinks();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{links.length} link{links.length !== 1 ? "s" : ""}</p>
        <Button onClick={startNew} className="gap-2 rounded-full">
          <Plus className="h-4 w-4" /> New Link
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : showForm ? (
        <form onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-medium">{editingId ? "Edit Link" : "New Link"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="h-8 w-8 rounded-full glass flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Label</Label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required placeholder="LinkedIn" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Icon</Label>
              <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {iconOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-xs">URL</Label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              required
              placeholder={form.icon === "email" ? "you@example.com" : "https://linkedin.com/in/you"}
              className="mt-1"
            />
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
              {editingId ? "Save Changes" : "Create Link"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      ) : links.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">No links yet. Add your LinkedIn, GitHub, and more.</p>
          <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> New Link</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {links.map((link) => (
            <div key={link.id} className="glass rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg glass-primary flex items-center justify-center text-xs font-semibold uppercase text-primary">
                  {link.icon[0]}
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">{link.label}</div>
                  <a href={link.icon === "email" ? `mailto:${link.url}` : link.url} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                    {link.url} <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => startEdit(link)} className="gap-1.5 rounded-full text-xs">
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDelete(link.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}