import Link from "next/link";
import { portfolioProjects, researchPapers } from "@/app/_lib/constants";
import ProjectCard from "./ProjectCard";
import ResearchCard from "./ResearchCard";
import ShinyButton from "./ui/ShinyButton";
import { ChevronRight } from "lucide-react";

const ProjectsSection = () => {
  return (
    <div className="py-32" id="work">
      <div className="flex gap-4 flex-col sm:flex-row sm:items-center justify-between">
        <h2 className="text-3xl min-[430px]:text-4xl md:text-5xl font-bold dark:text-stone-200">
          My portfolio
        </h2>

        <ShinyButton icon={<ChevronRight />}>
          <Link href="https://github.com/ThomasN0712" target="_blank">
            All Projects
          </Link>
        </ShinyButton>
      </div>

      {/* Projects Section */}
      <div className="mt-12">
        <h3 className="text-2xl md:text-3xl font-semibold dark:text-stone-200">
          Projects
        </h3>
        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          {portfolioProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Research Papers Section */}
      <div className="mt-12">
        <h3 className="text-2xl md:text-3xl font-semibold dark:text-stone-200">
          Research Papers
        </h3>
        <div className="grid lg:grid-cols-2 gap-4 mt-4">
          {researchPapers.map((paper) => (
            <ResearchCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
