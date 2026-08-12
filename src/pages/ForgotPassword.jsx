import { useState } from "react";
import { Link } from "react-router-dom";
import { FolderKanban, FileText, Link2, User, ExternalLink, LogOut } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ProjectManager from "@/components/admin/ProjectManager";
import DocumentManager from "@/components/admin/DocumentManager";
import LinkManager from "@/components/admin/LinkManager";
import ProfileManager from "@/components/admin/ProfileManager";

const tabs = [
  { id: "projects", label: "Projects", icon: FolderKanban, component: ProjectManager },
  { id: "documents", label: "Documents", icon: FileText, component: DocumentManager },
  { id: "links", label: "Links", icon: Link2, component: LinkManager },
  { id: "profile", label: "Profile", icon: User, component: ProfileManager },
];

export default function Admin() {
  const [tab, setTab] = useState("projects");
  const ActiveComponent = tabs.find((t) => t.id === tab)?.component || ProjectManager;

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-nav sticky top-0 z-40 border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-lg font-medium">Command Center</h1>
            <span className="text-[10px] uppercase tracking-wider text-primary font-semibold px-2 py-0.5 rounded-full glass-primary">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> View Site
            </Link>
            <button onClick={() => base44.auth.logout("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  tab === t.id ? "bg-primary text-primary-foreground" : "glass hover:glass-strong"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </div>
        <ActiveComponent />
      </div>
    </div>
  );
}