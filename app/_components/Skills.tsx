"use client";

import { techCardsItems } from "@/app/_lib/constants";
import TechCard from "./TechCard";
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    title: "Backend",
    description: "I love problem-solving and building complex systems...",
  },
  {
    id: 2,
    title: "Frontend & Design",
    description: "I'm passionate about design, animation, and interactions...",
  },
  {
    id: 3,
    title: "Cloud & DevOps",
    description: "I have managed AWS, GCP, and other cloud services...",
  },
  {
    id: 4,
    title: "Management",
    description: "I have worked with multiple clients and stakeholders...",
  },
];

const Skills = () => {
  return (
    <div className="relative z-10 py-16 sm:py-24" id="about">
      <div className="space-y-4 mb-10">
        <motion.h1
          initial={{ opacity: 0, x: -75 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-3xl min-[430px]:text-4xl md:text-5xl font-bold dark:text-stone-200"
        >
          Current technologies
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -90 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-lg min-[430px]:text-xl max-w-lg md:max-w-3xl text-dark-200 dark:text-stone-200"
        >
          I have expertise in various modern technologies that enable me to
          develop highly functional solutions. Here are some of the key
          technologies I work with.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 75 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="p-4 rounded-xl border border-transparent dark:border-transparent"
          >
            <h2 className="text-xl font-bold mb-2">{category.title}</h2>
            <p className="text-sm mb-4">{category.description}</p>
            <div className="flex flex-wrap gap-4">
              {techCardsItems
                .filter((item) => item.id === category.id)
                .map((item) => (
                  <TechCard key={item.name} cardInfo={item} />
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
