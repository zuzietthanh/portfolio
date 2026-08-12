import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import NavigationRay from "@/components/portfolio/NavigationRay";
import Hero from "@/components/portfolio/Hero";
import ProjectCodex from "@/components/portfolio/ProjectCodex";
import DocumentHub from "@/components/portfolio/DocumentHub";
import LinkHub from "@/components/portfolio/LinkHub";
import Footer from "@/components/portfolio/Footer";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profiles, projectsData, documentsData, linksData] = await Promise.all([
          base44.entities.Profile.list(),
          base44.entities.Project.list("sort_order", 50),
          base44.entities.Document.list("sort_order", 50),
          base44.entities.ProfessionalLink.list("sort_order", 50),
        ]);
        setProfile(profiles[0] || null);
        setProjects(projectsData);
        setDocuments(documentsData);
        setLinks(linksData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const cvDoc = documents.find((d) => d.type === "cv");

  return (
    <div className="min-h-screen">
      <NavigationRay profile={profile} cvUrl={cvDoc?.file_url} />
      <Hero profile={profile} />
      <ProjectCodex projects={projects} />
      <DocumentHub documents={documents} />
      <LinkHub links={links} profile={profile} />
      <Footer profile={profile} />
    </div>
  );
}