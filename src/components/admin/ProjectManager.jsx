import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, X, Star, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Image } from "@/components/ui/image";
import FileUpload from "./FileUpload";

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  cover_image: "",
  tech_stack: "",
  project_role: "",
  github_url: "",
  live_url: "",
  featured: false,
  sort_order: 0,
  is_published: false,
};

export default function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.Project.list("sort_order", 100);
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const startNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const startEdit = (project) => {
    setForm({
      ...emptyForm,
      ...project,
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(", ") : "",
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        tech_stack: form.tech_stack
          ? form.tech_stack.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        sort_order: Number(form.sort_order) || 0,
      };
      if (editingId) {
        await base44.entities.Project.update(editingId, payload);
      } else {
        await base44.entities.Project.create(payload);
      }
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    await base44.entities.Project.delete(id);
    fetchProjects();
  };

  const togglePublish = async (project) => {
    await base44.entities.Project.update(project.id, { is_published: !project.is_published });
    fetchProjects();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        <Button onClick={startNew} className="gap-2 rounded-full">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : showForm ? (
        <form onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-medium">
              {editingId ? "Edit Project" : "New Project"}
            </h3>
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
              <Label className="text-xs">Subtitle</Label>
              <Input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="mt-1" />
            </div>
          </div>

          <div>
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} className="mt-1" />
          </div>

          <div>
            <Label className="text-xs">Cover Image</Label>
            <div className="mt-1">
              <FileUpload value={form.cover_image} onChange={(v) => setForm({ ...form, cover_image: v })} label="Upload Image" isImage />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">Tech Stack (comma-separated)</Label>
              <Input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} placeholder="React, Node.js, PostgreSQL" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Role</Label>
              <Input value={form.project_role} onChange={(e) => setForm({ ...form, project_role: e.target.value })} className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">GitHub URL</Label>
              <Input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Live URL</Label>
              <Input value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className="mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label className="text-xs">Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="mt-1" />
            </div>
            <div className="flex items-center justify-between glass rounded-lg px-4 py-2.5">
              <Label className="text-xs">Featured</Label>
              <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
            </div>
            <div className="flex items-center justify-between glass rounded-lg px-4 py-2.5">
              <Label className="text-xs">Published</Label>
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editingId ? "Save Changes" : "Create Project"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      ) : projects.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-muted-foreground mb-4">No projects yet. Create your first one.</p>
          <Button onClick={startNew} className="gap-2"><Plus className="h-4 w-4" /> New Project</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="glass rounded-2xl overflow-hidden flex flex-col">
              {project.cover_image ? (
                <Image src={project.cover_image} alt={project.title} className="w-full h-32" fittingType="fill" />
              ) : (
                <div className="w-full h-32 bg-secondary flex items-center justify-center">
                  <span className="text-muted-foreground/30 font-display text-3xl">{project.title?.[0]}</span>
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-medium text-foreground">{project.title}</h3>
                  <div className="flex items-center gap-1 shrink-0">
                    {project.featured && <Star className="h-3.5 w-3.5 text-primary fill-primary" />}
                    {project.is_published ? (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground/50" />
                    )}
                  </div>
                </div>
                {project.subtitle && <p className="text-xs text-muted-foreground mb-3">{project.subtitle}</p>}
                <div className="flex items-center gap-2 mt-auto">
                  <Button size="sm" variant="outline" onClick={() => startEdit(project)} className="gap-1.5 rounded-full text-xs">
                    <Pencil className="h-3 w-3" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => togglePublish(project)} className="text-xs rounded-full">
                    {project.is_published ? "Unpublish" : "Publish"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(project.id)} className="text-destructive hover:text-destructive ml-auto">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}