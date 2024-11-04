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
    logo: "/imgs/logos/csulb-logo.png",
    position: "Research Assistant",
    dates: "Jul 2023 - Present",
    description: [
      "Developed the Java backend for a bank account servicing process with multiple channel integrations using Activiti workflow",
      "Built a custom database migration tool using Python and MariaDB and facilitated the migration of 1000+ processes from a vendor platform",
    ],
  },
  // Add more experiences as needed
];

export const educationData: Education[] = [
  {
    id: 1,
    institution: "Digipen Institute of Technology Singapore",
    logo: "/path/to/digipen-logo.png",
    degree: "BS in Computer Science in Real-Time Interactive Simulation",
    dates: "Sep 2019 - Apr 2023",
    description: [
      "Graduated with a Minor in Mathematics",
      "President of Digipen Student Management Committee for freshman year",
      "3-time recipient of the Dean's Honor List",
    ],
    tags: ["Final Year Project", "2nd Year Project"],
  },
  // Add more entries as needed
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
    description: "AI Model",
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
