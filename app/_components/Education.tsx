"use client";

import { motion } from "framer-motion";

const Education = () => {
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
          Education
        </motion.h1>
      </div>

      {/* <motion.div
        initial={{ opacity: 0, y: 75 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center justify-between gap-4"
      >
        {techCardsItems.map((cardItem) => (
          <TechCard key={cardItem.name} cardInfo={cardItem} />
        ))}
      </motion.div> */}
    </div>
  );
};

export default Education;
