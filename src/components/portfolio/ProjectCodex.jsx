import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";

function ProjectPlate({ project, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const mouseX = useSpring(0, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="group relative"
    >
      <Link to={`/project/${project.id}`} className="block">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden glass">
          {project.cover_image ? (
            <Image
              src={project.cover_image}
              alt={project.title}
              className="w-full h-full"
              fittingType="fill"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary flex items-center justify-center">
              <span className="font-display text-4xl text-muted-foreground/40">
                {project.title?.[0] || "·"}
              </span>
            </div>
          )}

          {/* Glass overlay that slides away on hover */}
          <motion.div
            animate={{ y: hovered ? "100%" : "0%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 glass-strong flex flex-col justify-end p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">
                {project.project_role || "Project"}
              </span>
              {project.featured && (
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Featured
                </span>
              )}
            </div>
            <h3 className="font-display text-xl font-medium text-foreground">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{project.subtitle}</p>
            )}
          </motion.div>

          {/* Revealed content on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 20 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none"
          >
            <div className="flex justify-end">
              <div className="h-10 w-10 rounded-full glass-strong flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-foreground" />
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-medium text-foreground mb-2">
                {project.title}
              </h3>
              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-1 rounded-full glass text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProjectCodex({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="work" className="relative py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
              Project Codex
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-medium tracking-tight text-foreground">
            Selected Work
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            A curated selection of projects spanning architecture, product engineering, and
            interactive experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <ProjectPlate key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}