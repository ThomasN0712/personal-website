import ExperienceCard from "./ExperienceCard";
import { experienceData } from "../_lib/constants/experienceData";

const WorkExperience: React.FC = () => (
  <div className="space-y-8">
    {experienceData.map((experience) => (
      <ExperienceCard key={experience.id} experience={experience} />
    ))}
  </div>
);

export default WorkExperience;
