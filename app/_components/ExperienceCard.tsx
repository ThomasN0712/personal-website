import Image from "next/image";
import { motion } from "framer-motion";
import { Experience } from "@/app/_lib/constants";

interface ExperienceCardProps {
  experience: Experience;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3 }}
    className="flex items-start space-x-4"
  >
    {/* Timeline circle */}
    <div className="relative w-4 h-4 bg-gray-800 rounded-full mt-2.5 -ml-10"></div>

    {/* Experience box */}
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 w-full">
      <div className="flex items-center space-x-3">
        <Image src={experience.logo} alt={`${experience.company} logo`} width={40} height={40} className="rounded" />
        <div>
          <h3 className="text-lg font-bold">{experience.company}</h3>
          <p className="text-sm text-gray-500">{experience.dates}</p>
          <p className="text-sm font-semibold">{experience.position}</p>
        </div>
      </div>
      <ul className="list-disc ml-8 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
        {experience.description.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </motion.div>
);

export default ExperienceCard;
