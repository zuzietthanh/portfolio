import { getProfile, getProjects, getDocuments, getLinks } from "@/lib/content";
import NavigationRay from "@/components/portfolio/NavigationRay";
import Hero from "@/components/portfolio/Hero";
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

  const cvDoc = documents.find((d) => d.type === "cv");

  return (
    <div className="min-h-screen">
      <NavigationRay profile={profile} cvUrl={cvDoc?.file_url} />
      <main id="main">
        <Hero profile={profile} />
        <ProjectCodex projects={projects} />
        <DocumentHub documents={documents} />
        <LinkHub links={links} profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}
