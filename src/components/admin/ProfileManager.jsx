import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FileUpload from "./FileUpload";

export default function ProfileManager() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: "",
    role: "",
    tagline: "",
    years_experience: 0,
    specialty: "",
    summary: "",
    email: "",
    location: "",
    avatar_url: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await base44.entities.Profile.list();
        if (data.length > 0) {
          setProfile(data[0]);
          setForm({ ...form, ...data[0] });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const payload = { ...form, years_experience: Number(form.years_experience) || 0 };
      if (profile?.id) {
        await base44.entities.Profile.update(profile.id, payload);
      } else {
        const created = await base44.entities.Profile.create(payload);
        setProfile(created);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="glass rounded-2xl p-6 space-y-5 max-w-2xl">
      <h3 className="font-display text-lg font-medium mb-2">Your Profile</h3>

      <div>
        <Label className="text-xs">Avatar</Label>
        <div className="mt-1">
          <FileUpload value={form.avatar_url} onChange={(v) => setForm({ ...form, avatar_url: v })} label="Upload Avatar" isImage />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs">Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Role / Title</Label>
          <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Senior Software Engineer" className="mt-1" />
        </div>
      </div>

      <div>
        <Label className="text-xs">Tagline (shown in hero badge)</Label>
        <Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Available for new opportunities" className="mt-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-xs">Years of Experience</Label>
          <Input type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Specialty</Label>
          <Input value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} placeholder="Full-Stack" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs">Location</Label>
          <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Remote · UTC" className="mt-1" />
        </div>
      </div>

      <div>
        <Label className="text-xs">Summary</Label>
        <Textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} rows={4} placeholder="A short professional summary..." className="mt-1" />
      </div>

      <div>
        <Label className="text-xs">Email</Label>
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="mt-1" />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save Profile
        </Button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
      </div>
    </form>
  );
}