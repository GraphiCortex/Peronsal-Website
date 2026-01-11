import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  meta,
  starbucks,
  tesla,
  shopify,
  images, 
  carrent,
  jobit,
  tripguide,
  threejs,
  neuron,
  dna,
  ai, 
  python,
  c_sharp,
  matlab,
  cplusplus,
  c,
  java,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "Orientation",
  },
  {
    id: "work",
    title: "Research",
  },
  {
    id: "bookportal",
    title: "Contact/CV",
  },
];

 const services = [
  {
    title: "Computational neuroscience",
    description: "Models of neural structure, dynamics, and inference",
    icon: web,
  },
  {
    title: "Data analysis & modeling",
    description: "From raw data to validated, interpretable structure",
    icon: mobile,
  },
  {
    title: "Machine learning & AI",
    description: "Representation learning with biological and physical constraints",
    icon: backend,
  },
  {
    title: "Mathematical & theoretical methods",
    description: "Formal tools for structure, symmetry, and semantics",
    icon: creator,
  },
];

const technologies = [
  {
    name: "Python",
    icon: python,
  },
  {
    name: "MATLAB",
    icon: matlab,
  },
  {
    name: "Java",
    icon: java,
  },
  {
    name: "C",
    icon: c,
  },
  {
    name: "C ++",
    icon: cplusplus,
  },
  {
    name: "C#",
    icon: c_sharp,
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
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "From networks to categories",
    company_name: "AUB Department of Philosophy",
    icon: images, // placeholder — swap later
    iconBg: "#a4a4a4ff",
    date: "2024 – Present",
    points: [
      "Formulated a categorical semantics for physically realised networks in which capacities and agency are explicit.",
      "Defined objects, morphisms, and level-linking structure using adjunction-style maps, limits/colimits, and lenses.",
      "Specified preservation and realisation conditions enabling principled comparison beyond graph-only or Markov models.",
    ],
  },
  {
    title: "3D neuron morphology reconstruction",
    company_name: "AUB Neuroscience Program · Daou Lab",
    icon: neuron, // placeholder — swap later
    iconBg: "#2a2a3d",
    date: "2024 – Present",
    points: [
      "Proposed and implemented a hybrid neuron-reconstruction architecture robust to noise and morphological variance.",
      "Combined centreline graph-convolutional representations with skeleton descriptors such as branch order, tortuosity, and Sholl-style counts.",
      "Built a benchmarking suite with controlled corruptions and evaluated node/edge error, branch continuity, and loop artefact rates.",
    ],
  },
  {
    title: "E2F signalling & cell-cycle re-entry",
    company_name: "AUB Biology Department (Dr. Noel Ghanem)",
    icon: dna, // placeholder — swap later
    iconBg: "#2a2a3d",
    date: "2025 – Present",
    points: [
      "Assessed whether E2F activity marks stress and early apoptotic change in post-mitotic neurons.",
      "Linked E2F-family ChIP-seq peak sets to RNA-seq responses and ran differential expression with pathway enrichment.",
      "Cross-verified effect directions across datasets and developed a small Boolean/ODE hybrid to probe early-apoptosis sensitivity.",
    ],
  },
  {
    title: "AI-assisted PSMA PET/CT harmonisation",
    company_name: "AUBMC Urology × AUB AIM Program",
    icon: ai, // placeholder — swap later
    iconBg: "#a4a4a4ff",
    date: "2025 – Present",
    points: [
      "Architected a cross-scanner PET/CT harmonisation workflow producing reproducible lesion-level staging and response metrics.",
      "Designed the pipeline end-to-end, including de-identification, SUV harmonisation, and PET–CT co-registration with config-hash provenance.",
      "Specified transportability evaluation and model-readout tables to ensure validation across devices and readers.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Rick proved me wrong.",
    name: "Sara Lee",
    designation: "CFO",
    company: "Acme Co",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Rick does.",
    name: "Chris Brown",
    designation: "COO",
    company: "DEF Corp",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    testimonial:
      "After Rick optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Lisa Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
  },
];

const projects = [
  {
    name: "Car Rent",
    description:
      "Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: carrent,
    source_code_link: "https://github.com/",
  },
  {
    name: "Job IT",
    description:
      "Web application that enables users to search for job openings, view estimated salary ranges for positions, and locate available jobs based on their current location.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "restapi",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: jobit,
    source_code_link: "https://github.com/",
  },
  {
    name: "Trip Guide",
    description:
      "A comprehensive travel booking platform that allows users to book flights, hotels, and rental cars, and offers curated recommendations for popular destinations.",
    tags: [
      {
        name: "nextjs",
        color: "blue-text-gradient",
      },
      {
        name: "supabase",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: tripguide,
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };