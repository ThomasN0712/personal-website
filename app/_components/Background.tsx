"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { experienceData, educationData } from "@/app/_lib/constants";
import ExperienceCard from "./ExperienceCard";
import EducationCard from "./EducationCard";

const Background = () => {
  const [activeTab, setActiveTab] = useState("Work");

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
          Experience / Education
        </motion.h1>
      </div>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("Work")}
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === "Work" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
          }`}
        >
          Work
        </button>
        <button
          onClick={() => setActiveTab("Education")}
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === "Education" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
          }`}
        >
          Education
        </button>
      </div>

      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-300"></div> {/* Timeline line */}
        <div className="ml-12 space-y-8">
          {activeTab === "Work" &&
            experienceData.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          {activeTab === "Education" &&
            educationData.map((education) => (
              <EducationCard key={education.id} education={education} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Background;
