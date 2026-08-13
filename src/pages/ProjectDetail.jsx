import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Github, ExternalLink, ArrowDownToLine } from "lucide-react";
import { getProfile, getProject, getDocuments } from "@/lib/content";
import { Image } from "@/components/ui/image";
import NavigationRay from "@/components/portfolio/NavigationRay";
import Footer from "@/components/portfolio/Footer";

export default function ProjectDetail() {
  const { id } = useParams();

  // Content is imported at build time — resolved synchronously on first render.
  const project = getProject(id);
  const profile = getProfile();
  const documents = getDocuments();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const cvDoc = documents.find((d) => d.type === "cv");

  if (!project) {
    return (
      <div className="min-h-screen">
        <NavigationRay profile={profile} cvUrl={cvDoc?.file_url} />
        <main
          id="main"
          className="flex min-h-svh flex-col items-center justify-center gap-5 px-6 text-center"
        >
          <h1 className="font-display text-3xl font-medium text-foreground">Project not found</h1>
          <p className="max-w-md text-muted-foreground">
            This project may have been renamed or removed from your content files.
          </p>
          <Link
            to="/#work"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All work
          </Link>
        </main>
        <Footer profile={profile} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavigationRay profile={profile} cvUrl={cvDoc?.file_url} />

      <main id="main" className="px-4 pb-20 pt-28 sm:px-6 md:pt-36">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/#work"
            className="mb-8 inline-flex items-center gap-2 rounded-lg py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to all work
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Sticky metadata sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 lg:sticky lg:top-28 lg:self-start space-y-6"
            >
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">
                  {project.project_role || "Project"}
                </span>
                <h1 className="font-display text-3xl md:text-4xl font-medium tracking-tight mt-2 text-foreground">
                  {project.title}
                </h1>
                {project.subtitle && (
                  <p className="text-muted-foreground mt-2">{project.subtitle}</p>
                )}
              </div>

              {project.cover_image && (
                <div className="rounded-2xl overflow-hidden glass">
                  <Image src={project.cover_image} alt={project.title} className="w-full aspect-[4/3]" fittingType="fill" />
                </div>
              )}

              <div className="glass rounded-2xl p-5 space-y-4">
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground mb-2">Tools &amp; Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack.map((tech, i) => (
                        <span key={i} className="text-xs font-medium px-2.5 py-1 rounded-full glass-primary text-primary">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 pt-2 border-t border-border/40">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Github className="h-4 w-4" /> View Source
                    </a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink className="h-4 w-4" /> View project
                    </a>
                  )}
                </div>

                {cvDoc && (
                  <a
                    href={cvDoc.file_url}
                    download
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold py-3 px-4 hover:scale-[1.02] transition-transform"
                  >
                    <ArrowDownToLine className="h-4 w-4" /> Download CV
                  </a>
                )}
              </div>
            </motion.aside>

            {/* Scrolling narrative */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-3"
            >
              {project.description && (
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div
                    className="text-foreground/90 leading-relaxed space-y-4 [&_a]:text-primary [&_a]:underline [&_h2]:font-display [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_code]:text-primary [&_code]:font-mono [&_code]:text-sm [&_pre]:glass [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
              )}

              {!project.description && (
                <p className="text-muted-foreground italic">
                  More details coming soon. In the meantime, check out the links on the left.
                </p>
              )}

              <div className="mt-12 border-t border-border/40 pt-8">
                <Link
                  to="/#work"
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-lg text-sm font-medium text-primary"
                >
                  <ArrowLeft
                    className="h-4 w-4 transition-transform group-hover:-translate-x-1 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                  Back to all work
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
}