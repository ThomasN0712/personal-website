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
      "Assisted in data collection, analysis, and software development to support ongoing research projects."
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
      "Developed and maintained spreadsheets to track media guest appearances and their schedules."
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
    imageUrl: "/imgs/projects/portfolio-mockup2.png",
    techStack: [
      "React",
      "Golang",
      "Vite",
      "Ionic",
      "Capacitor",
      "MongoDB",
      "Redis",
      "SCSS"
    ],
    liveDemoUrl: "not-found",
    sourceCodeUrl: "not-found",
  }
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
