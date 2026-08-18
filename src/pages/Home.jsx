import { getProfile, getProjects, getDocuments, getLinks, getStatement } from "@/lib/content";
import NavigationRay from "@/components/portfolio/NavigationRay";
import Hero from "@/components/portfolio/Hero";
import StatementCallout from "@/components/portfolio/StatementCallout";
import ProjectCodex from "@/components/portfolio/ProjectCodex";
import DocumentHub from "@/components/portfolio/DocumentHub";
import LinkHub from "@/components/portfolio/LinkHub";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  // Content is imported at build time, so it is available on first render —
  // no fetch, no loading state.
  const profile = getProfile();
  const projects = getProjects();
  const documents = getDocuments();
  const links = getLinks();
  const statement = getStatement();

  const cvDoc = documents.find((d) => d.type === "cv");

  return (
    <div className="min-h-screen">
      <NavigationRay profile={profile} cvUrl={cvDoc?.file_url} />
      <main id="main">
        <Hero profile={profile} hasProjects={projects.length > 0} />
        {/* Required coursework leads: statement, then documents. The work grid
            is optional to the brief, so it follows them — and disappears
            entirely while projects.json is empty, rather than showing a
            heading with nothing under it. Add a project back and it returns. */}
        <StatementCallout statement={statement} />
        <DocumentHub documents={documents} />
        {projects.length > 0 && <ProjectCodex projects={projects} />}
        <LinkHub links={links} profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
