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
    position: "Research Assistant",
    dates: "Jul 2023 - Present",
    description: [
      "Conducted research on data structures and algorithms to optimize performance in large datasets.",
      "Collaborated with professors to develop new approaches for database indexing and querying.",
    ],
  },
  {
    id: 2,
    company: "Tech Solutions Inc.",
    logo: "/imgs/logos/tech-solutions-logo.svg",
    position: "Software Engineer",
    dates: "Jan 2022 - Jun 2023",
    description: [
      "Developed a RESTful API for managing client data using Node.js and Express.",
      "Improved application performance by 30% through code optimization and refactoring.",
      "Led a small team in migrating a legacy system to a modern cloud infrastructure using AWS.",
    ],
  },
  {
    id: 3,
    company: "Innovative Labs",
    logo: "/imgs/logos/innovative-labs-logo.svg",
    position: "Frontend Developer",
    dates: "Jun 2021 - Dec 2021",
    description: [
      "Built responsive and interactive UI components using React and TypeScript.",
      "Integrated third-party APIs to enhance user experience and data accessibility.",
      "Collaborated with UX designers to improve user flows and create a cohesive design system.",
    ],
  },
  {
    id: 4,
    company: "Global Solutions",
    logo: "/imgs/logos/global-solutions-logo.svg",
    position: "Intern - Data Analyst",
    dates: "May 2020 - Aug 2020",
    description: [
      "Assisted in cleaning and processing large datasets for data analysis projects.",
      "Created visualizations using Python and Tableau to represent key insights.",
      "Prepared reports summarizing data trends for stakeholders and decision-makers.",
    ],
  },
];


export const educationData: Education[] = [
  {
    id: 1,
    institution: "Digipen Institute of Technology Singapore",
    logo: "/imgs/logos/digipen-logo.svg",
    degree: "BS in Computer Science in Real-Time Interactive Simulation",
    dates: "Sep 2019 - Apr 2023",
    description: [
      "Graduated with a Minor in Mathematics.",
      "President of Digipen Student Management Committee for freshman year.",
      "3-time recipient of the Dean's Honor List.",
    ],
    tags: ["Final Year Project", "2nd Year Project"],
  },
  {
    id: 2,
    institution: "University of California, Berkeley",
    logo: "/imgs/logos/ucb-logo.svg",
    degree: "MS in Artificial Intelligence",
    dates: "Aug 2023 - Present",
    description: [
      "Conducting research on neural network optimization.",
      "Member of the Artificial Intelligence Student Association.",
      "Completed coursework in machine learning, deep learning, and data visualization.",
    ],
    tags: ["Research Project", "AI Club"],
  },
  {
    id: 3,
    institution: "Stanford University",
    logo: "/imgs/logos/stanford-logo.svg",
    degree: "Graduate Certificate in Data Science",
    dates: "Jan 2022 - Dec 2022",
    description: [
      "Specialized in data analysis and machine learning techniques.",
      "Completed a capstone project on predictive modeling in Python.",
    ],
    tags: ["Capstone Project"],
  },
  {
    id: 4,
    institution: "California State University, Long Beach",
    logo: "/imgs/logos/csulb-logo.svg",
    degree: "Bachelor of Science in Computer Engineering",
    dates: "Aug 2015 - May 2019",
    description: [
      "Graduated with honors, maintaining a GPA of 3.8.",
      "Actively involved in the Computer Engineering Club.",
      "Completed a senior design project on autonomous vehicles.",
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
