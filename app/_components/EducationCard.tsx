import { motion } from "framer-motion";
import { Education } from "@/app/_lib/constants";
import Image from "next/image";

interface EducationCardProps {
  education: Education;
}

const EducationCard: React.FC<EducationCardProps> = ({ education }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3 }}
    className="flex items-start space-x-4"
  >
    {/* Timeline circle with logo */}
    <div className="relative w-10 h-10 bg-gray-800 rounded-full overflow-hidden mt-2 -ml-10 flex-shrink-0">
      <Image src={education.logo} alt={`${education.institution} logo`} layout="fill" objectFit="cover" />
    </div>

    {/* Education box */}
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-4 w-full">
      <div>
        <h3 className="text-lg font-bold">{education.institution}</h3>
        <p className="text-sm text-gray-500">{education.dates}</p>
        <p className="text-sm font-semibold">{education.degree}</p>
      </div>
      <ul className="list-disc ml-8 mt-2 space-y-1 text-gray-700 dark:text-gray-300">
        {education.description.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {education.tags && (
        <div className="mt-2 flex space-x-2">
          {education.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm">{tag}</span>
          ))}
        </div>
      )}
    </div>
  </motion.div>
);

export default EducationCard;
