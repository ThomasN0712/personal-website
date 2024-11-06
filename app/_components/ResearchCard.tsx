"use client";

import { MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ResearchPaperProps {
  id: string;
  title: string;
  description: string;
  authors: string;
  publicationDate: string;
  imageUrl: string;
  link: string;
}

const ResearchCard = ({ paper }: { paper: ResearchPaperProps }) => {
  const { id, title, description, authors, publicationDate, imageUrl, link } =
    paper;

  return (
    <motion.div
      initial={{ opacity: 0, y: 75 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="bg-[#F3F4F3] dark:bg-dark-200 rounded-lg p-4 sm:p-8 space-y-8"
    >
      <Link
        href={link}
        target="_blank"
        className="rounded-lg overflow-hidden block"
      >
        <Image
          src={imageUrl}
          width={1000}
          height={1000}
          alt={title}
          className="hover:scale-110 transition-transform duration-700"
        />
      </Link>
      <div>
        <h3 className="text-2xl sm:text-3xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {authors} - {publicationDate}
        </p>
        <p className="mt-4 text-base">{description}</p>
        <div className="mt-4 flex justify-between">
          <Link
            href={link}
            target="_blank"
            className="p-3 bg-primary hover:bg-primary/80 transition-colors duration-200 rounded-lg"
          >
            <MoveUpRight className="size-5 sm:size-8 text-[#F3F4F3] dark:text-dark-200" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ResearchCard;
