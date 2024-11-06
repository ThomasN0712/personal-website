export interface Experience {
  id: number;
  company: string;
  logo: string;
  position: string;
  dates: string;
  description: string[];
  tags?: string[];
}

export interface Education {
  id: number;
  institution: string;
  logo: string;
  degree: string;
  dates: string;
  description: string[];
  tags?: string[];
}

export const experienceData: Experience[] = [
  {
    id: 1,
    company: "Cal State Long Beach",
    logo: "/imgs/logos/csulb-logo.svg",
    position: "Teaching Assistant",
    dates: "Jul 2023 - Present",
    description: [
      "Developed and deployed machine learning models for side-channel analysis, achieving a 98% accuracy rate in detecting Hardware Trojan attacks.",
      "Analyzed Large Language Models (LLMs) such as ChatGPT and Google Gemini for applications in Computer Science and Cybersecurity education, leading to a conference publication.",
      "Assisted in data collection, analysis, and software development to support ongoing research projects.",
    ],
  },
  {
    id: 2,
    company: "Office of Research Development at CSULB",
    logo: "/imgs/logos/csulb-logo.svg",
    position: "Research Assistant",
    dates: "Nov 2023 - Aug 2024",
    description: [
      "Conducted in-depth literature reviews and comparative analysis for Large Language Models.",
      "Published paper about comparative analysis of ChatGPT for Education in Computer Science.",
      "Worked collaboratively with team members to achieve research objectives and project milestones.",
    ],
  },
  {
    id: 3,
    company: "Team Disney Anaheim",
    logo: "/imgs/logos/disneyland-logo.svg",
    position: "Media Event Technical Intern",
    dates: "May 2019 - September 2019",
    description: [
      "Assisted in coordinating media reporters, guests, and celebrities for Star Wars: Galaxy's Edge 2019 grand opening.",
      "Conducted research on potential media contacts and celebrities, assisting in maintaining a comprehensive database.",
      "Developed and maintained spreadsheets to track media guest appearances and their schedules.",
    ],
  },
  {
    id: 4,
    company: "Au Lac Plant Base Cuisine",
    logo: "/imgs/logos/aulac-logo.svg",
    position: "Manager",
    dates: "September 2020 - July 2024",
    description: [
      "Improved performance of floor staff by supporting front and back team communication, allowing the kitchen team to halves ticket reading time.",
      "Developed a new program for writing and calculating cash reports, payroll and tip distribution.",
      "Ensure customer and employee satisfaction daily through food quality control and maintaining cleanliness standards.",
      "Contact and support with customer online review, order and questions.",
    ],
  },
];

export const educationData: Education[] = [
  {
    id: 1,
    institution: "California State University, Long Beach",
    logo: "/imgs/logos/csulb-logo.svg",
    degree: "Bachelor of Science in Computer Science",
    dates: "Aug 2022 - Dec 2024",
    description: [
      "GPA: 4.0",
      "Completed a senior design project on E2EE chat app.",
    ],
    tags: ["Dean's List", "Senior Design Project"],
  },
  {
    id: 2,
    institution: "Cypress college",
    logo: "/imgs/logos/cypress-logo.svg",
    degree: "Associate of Science in Computer Science",
    dates: "Aug 2020 - May 2022",
    description: [
      "Graduated with honors, maintaining a GPA of 3.8.",
      "Completed BlockChain Project with professor Penn Wu",
    ],
    tags: ["Dean's List", "Senior Design Project"],
  },
];

export const techCardsItems = [
  {
    name: "Python",
    description: "Programming Language",
    imageUrl: "/imgs/logos/python.svg",
    bgColor: "bg-[#3776AB]/20",
  },
  {
    name: "C++",
    description: "Programming Language",
    imageUrl: "/imgs/logos/cpp.svg",
    bgColor: "bg-[#00599C]/20",
  },
  {
    name: "Java",
    description: "Programming Language",
    imageUrl: "/imgs/logos/java.svg",
    bgColor: "bg-[#00599C]/20",
  },
  {
    name: "React",
    description: "JavaScript Library",
    imageUrl: "/imgs/logos/react.svg",
    bgColor: "bg-[#61DAFB]/20",
  },
  {
    name: "TypeScript",
    description: "JavaScript but better",
    imageUrl: "/imgs/logos/typescript.svg",
    bgColor: "bg-[#3178C6]/20",
  },
  {
    name: "Git",
    description: "Version control",
    imageUrl: "/imgs/logos/git.svg",
    bgColor: "bg-[#F1502F]/20",
  },
  {
    name: "ChatGPT",
    description: "Large Language Model",
    imageUrl: "/imgs/logos/chatgpt.svg",
    bgColor: "bg-[#00A67E]/20",
  },
  {
    name: "Figma",
    description: "Design Tool",
    imageUrl: "/imgs/logos/figma-logo.svg",
    bgColor: "bg-[#0ACF83]/20",
  },
];

export const portfolioProjects = [
  {
    id: "wraith",
    heading: "Project Wraith",
    subheading: "a snap-chat clone + E2EE",
    description:
      "A responsive, high-performance web application built with a modern tech stack. The frontend, developed using React, Vite, and styled with SCSS, provides an interactive and visually appealing user experience. The backend is powered by Golang, MongoDB, and Redis, ensuring efficient data management and fast server-side processing. With Ionic and Capacitor, the app offers seamless functionality across web and mobile platforms.",
    imageUrl: "/imgs/projects/portfolio-wraith.png",
    techStack: [
      "React",
      "Golang",
      "Vite",
      "Ionic",
      "Capacitor",
      "MongoDB",
      "Redis",
      "SCSS",
      "Zustand",
    ],
    liveDemoUrl: "not-found",
    sourceCodeUrl: "not-found",
  },
  {
    id: "personal-website",
    heading: "Personal Website",
    subheading: "A showcase of my projects and skills",
    description:
      "This personal website was built using modern web technologies to create a responsive, clean, and efficient user experience. Developed with Next.js and React, styled using Tailwind CSS, and enhanced with TypeScript for type safety, this site demonstrates my skills in building functional and visually appealing web applications.",
    imageUrl: "/imgs/projects/portfolio-personal-website.png",
    techStack: ["Next.js", "React", "Tailwind CSS", "TypeScript", "Vercel"],
    liveDemoUrl: "not-found",
    sourceCodeUrl: "not-found",
  },
];

export const researchPapers = [
  {
    id: "1",
    title:
      "ChatGPT vs. Gemini: Comparative Evaluation in Cybersecurity Education with Prompt Engineering Impact",
    description: "",
    authors: "Thomas Nguyen, Hossein Sayadi",
    publicationDate: "2024",
    imageUrl: "/images/chatgpt-gemini-paper.jpg",
    link: "https://example.com/paper1",
  },
  {
    id: "2",
    title:
      "The AI Companion in Education: Analyzing the Pedagogical Potential of ChatGPT in Computer Science and Engineering",
    description: "",
    authors:
      "Zhangying He, Thomas Nguyen, Tahereh Miari, Mehrdad Aliasgari, Setareh Rafatirad, Hossein Sayadi",
    publicationDate: "2024",
    imageUrl: "/images/iot-security.jpg",
    link: "https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10578820",
  },
  // {
  //   id: "3",
  //   title: "Bayesian Networks for Predictive Analysis in Healthcare",
  //   description:
  //     "This paper presents the application of Bayesian networks to predict patient outcomes, focusing on probabilistic modeling in health informatics to assist in clinical decision-making.",
  //   authors: "Thomas Nguyen, Emily Zhang",
  //   publicationDate: "2024",
  //   imageUrl: "/images/bayesian-healthcare.jpg",
  //   link: "https://example.com/paper3",
  // },
];

export const testimonialItems = [
  {
    id: 1,
    name: "Dr. Hossein Sayadi",
    proffesion: "Professor at Cal State Long Beach",
    description:
      "“Lorem ipsum odor amet, consectetuer adipiscing elit. Habitasse nullam nullam mauris hendrerit viverra donec parturient fames? Habitasse neque nec viverra lobortis tincidunt morbi. Pulvinar ligula euismod tempus lacinia habitasse ligula platea etiam. Tempor imperdiet bibendum inceptos pellentesque luctus per mi blandit. Congue potenti fusce praesent, erat a habitant erat eget. Tempor pretium malesuada nibh habitant finibus sollicitudin primis. Luctus litora accumsan venenatis nisi et egestas.”",
    image: "/imgs/avatars/Alex.jpg",
  },
];
