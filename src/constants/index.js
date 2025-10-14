import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  html,
  css,
  reactjs,
  tailwind,
  git,
  portfolio,
  threejs,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "Content Creator",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
];

export const certifications = [
  {
    id: "css-nc2",
    title: "CSS NC II (Computer Systems Servicing)",
    issuer: "Technical Education and Skills Development Authority",
    date: "Oct 04, 2025",
    image: "/nc2.jpg",
    file: "/nc2.jpg"
  },
];

const projects = [
  {
    name: "3D Portfolio",
    description:
      "A 3D portfolio website to showcase my skills and projects as a web developer. Developed using React, Three.js, and Framer Motion.",
    tags: [
      {
        name: "r3f",
        color: "blue-text-gradient",
      },
      {
        name: "framer-motion",
        color: "green-text-gradient",
      },
    ],
    image: portfolio,
    source_code_link: "https://github.com/JohnMarkCuya/3d_portfolio-website",
  },
];

export { services, technologies, projects };