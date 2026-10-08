export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Architecture & Engines" | "Web Applications" | "Leadership & Community";
  description: string;
  longDescription?: string;
  impact: string[];
  techStack: string[];
  year: string;
  featured: boolean;
  demoUrl?: string;
  githubUrl?: string;
  role: string;
  highlights: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  location: string;
  period: string;
  type: "Full-time" | "Internship" | "Freelance";
  current: boolean;
  summary: string;
  achievements: string[];
  techStack: string[];
  keyArchitecture: string[];
}

export interface SkillCategory {
  title: string;
  icon: string;
  description: string;
  skills: { name: string; level: string; highlight?: boolean }[];
}

export interface MetricItem {
  value: string;
  label: string;
  sublabel: string;
  icon: string;
}

export const personalInfo = {
  name: "Rishabh Jain",
  title: "Senior Frontend Engineer (WDE-2)",
  tagline: "Architecting scalable, config-driven UI platforms & high-performance web applications.",
  bio: "Frontend Developer with 4.5+ years of experience building enterprise-grade user interfaces, config-driven schema rendering engines, and micro-frontend architectures. Passionate about UI performance, design systems, and developer ergonomics.",
  location: "India",
  email: "rishabh2401jain@gmail.com",
  github: "https://github.com/Rishabh2324",
  linkedin: "https://www.linkedin.com/in/rishabhjain2324",
  status: "Open for high-impact frontend roles & technical consulting",
  availableForHire: true,
  yearsOfExperience: "4.5+",
};

export const metricsData: MetricItem[] = [
  {
    value: "4.5+",
    label: "Years Experience",
    sublabel: "Specialized in Modern Frontend",
    icon: "clock",
  },
  {
    value: "70%",
    label: "Authoring Time Cut",
    sublabel: "Via Config-Driven Form Engines",
    icon: "zap",
  },
  {
    value: "100k+",
    label: "Users Impacted",
    sublabel: "Across Enterprise & Web Apps",
    icon: "users",
  },
  {
    value: "99+",
    label: "Lighthouse Performance",
    sublabel: "Optimized Core Web Vitals",
    icon: "gauge",
  },
];

export const experienceData: ExperienceItem[] = [
  {
    id: "corevalue-tech",
    role: "Frontend Developer (WDE-2)",
    company: "Corevalue Tech",
    companyUrl: "https://corevalue.tech",
    location: "India",
    period: "2021 - Present",
    type: "Full-time",
    current: true,
    summary: "Leading frontend architectural initiatives, enterprise UI re-platforming, and building core declarative UI systems.",
    achievements: [
      "Architected and maintained a declarative config/JSON-driven dynamic form rendering engine, reducing repetitive UI development cycles and form authoring time by ~70%.",
      "Led end-to-end tech re-platforming from legacy codebase to Vue 3 (Composition API, Pinia, TypeScript), cutting bundle sizes by 35% and drastically improving runtime performance.",
      "Designed and implemented monorepo architectures (Turborepo / Nx) for domain-specific applications, standardizing shared UI component libraries, linting rules, and build pipelines.",
      "Engineered micro-frontend integration patterns enabling independent deployments across cross-functional teams with zero downtime.",
      "Mentored junior and mid-level engineers on modern TypeScript patterns, state management strategies, and frontend performance profiling.",
    ],
    techStack: ["Vue 3", "TypeScript", "Pinia", "JSON Schema UI", "Vite", "Turborepo", "Micro-frontends", "CSS/SCSS", "REST APIs"],
    keyArchitecture: ["Config-Driven Form Engine", "Monorepo Component Registry", "Vue 3 Re-platforming", "State Machines"],
  },
  {
    id: "mobilize-on",
    role: "Frontend Developer Intern",
    company: "Mobilize On",
    location: "India",
    period: "2020 - 2021",
    type: "Internship",
    current: false,
    summary: "Built high-performance single-page applications and contributed to mobile application features.",
    achievements: [
      "Engineered modular single-page applications using vanilla modern JavaScript and responsive Bootstrap layouts with high cross-browser compatibility.",
      "Contributed to React Native mobile applications, integrating optical character recognition (OCR) camera scanning features for document verification.",
      "Collaborated with backend engineers to streamline RESTful API consumption and error handling mechanisms.",
    ],
    techStack: ["JavaScript (ES6+)", "React Native", "Bootstrap", "OCR API", "HTML5/CSS3", "Git"],
    keyArchitecture: ["Client-side Routing", "OCR Document Scanner", "Responsive Design Patterns"],
  },
  {
    id: "exiliq",
    role: "Full Stack Developer (Freelance)",
    company: "Exiliq",
    location: "Remote",
    period: "2021",
    type: "Freelance",
    current: false,
    summary: "Delivered an end-to-end full-stack event registration and payment system for high-volume virtual events.",
    achievements: [
      "Architected and shipped an event registration web platform using Angular 8 with reactive form validations.",
      "Integrated secure payment gateway workflows (Stripe / Razorpay) backed by Node.js, Express, and MongoDB.",
      "Implemented automated email confirmation services and real-time attendee tracking dashboard for event admins.",
    ],
    techStack: ["Angular 8", "Node.js", "Express", "MongoDB", "Payment Gateway", "TypeScript"],
    keyArchitecture: ["Payment Webhook Handlers", "Reactive Forms Validation", "REST API Service Layer"],
  },
];

export const projectsData: ProjectItem[] = [
  {
    id: "config-driven-ui",
    title: "JSON-Driven Form Engine",
    subtitle: "Enterprise Declarative UI Architecture",
    category: "Architecture & Engines",
    description: "A declarative, schema-based UI rendering engine that generates dynamic, highly responsive forms with complex cross-field validation, conditional branching, and custom widgets entirely from JSON.",
    longDescription: "Engineered to eliminate boilerplate in data-heavy enterprise applications. The engine dynamically maps arbitrary JSON schemas into reactive UI controls, supporting complex dependencies, asynchronous field validations, and custom theme overrides.",
    impact: [
      "Reduced form implementation time from days to minutes",
      "Standardized validation rules across 30+ enterprise workflows",
      "Zero dependencies on heavy third-party form libraries",
    ],
    techStack: ["TypeScript", "Vue 3", "JSON Schema", "Reactive Core", "Vite", "CSS Modules"],
    year: "2023 - 2024",
    featured: true,
    demoUrl: "#interactive-demo",
    role: "Lead Architect",
    highlights: ["Dynamic Field Dependencies", "Runtime Schema Validation", "Extensible Custom Field Registry"],
  },
  {
    id: "ipatc",
    title: "IPATC Education & Mentorship Platform",
    subtitle: "Course Marketplace & Real-time Mentorship Hub",
    category: "Web Applications",
    description: "Comprehensive online education platform enabling students to discover courses, book 1-on-1 mentorship sessions, and manage their career trajectories through an intuitive dashboard.",
    longDescription: "Built with React.js and Node.js microservices. Features real-time schedule matching, interactive course modules, payment checkout, and an administrative dashboard for mentors to manage their offerings.",
    impact: [
      "Scaled to hundreds of concurrent student learners",
      "Sub-second page transitions via optimized bundle code splitting",
      "Integrated full billing and mentorship scheduling lifecycle",
    ],
    techStack: ["React.js", "Node.js", "Express", "REST APIs", "Tailwind CSS", "JWT Auth"],
    year: "2023",
    featured: true,
    demoUrl: "https://github.com/Rishabh2324",
    githubUrl: "https://github.com/Rishabh2324",
    role: "Full-Stack Engineer",
    highlights: ["Interactive Course Player", "Mentor Booking System", "Role-based Dashboards"],
  },
  {
    id: "sae-akgec",
    title: "SAE-AKGEC Workshop Portal & IoT Hub",
    subtitle: "Collegiate Tech Community & Registration System",
    category: "Leadership & Community",
    description: "Workshop registration and resource portal built in Angular; served as the digital foundation for a 25-member collegiate technical society conducting hands-on IoT workshops.",
    longDescription: "Led a cross-functional team of 25 student organizers and developers. Built a responsive registration portal with dynamic QR attendance tracking, hands-on lab resources, and automated participant certification.",
    impact: [
      "Managed registrations and live workshop operations for 200+ engineering students",
      "Led 25-member technical team across event execution and software delivery",
      "Achieved 100% on-time event check-ins via digital passes",
    ],
    techStack: ["Angular 8", "TypeScript", "Node.js", "Bootstrap", "MongoDB"],
    year: "2020",
    featured: true,
    githubUrl: "https://github.com/Rishabh2324",
    role: "Team Lead & Lead Developer",
    highlights: ["200+ Student Attendees", "25-Member Team Leadership", "Automated Certification"],
  },
  {
    id: "microfrontend-workbench",
    title: "Micro-Frontend Shell & Component Library",
    subtitle: "Composable Monorepo Architecture",
    category: "Architecture & Engines",
    description: "A high-performance monorepo template containing a shared design system token package, independent domain micro-frontends, and isolated build pipelines using Vite and Turborepo.",
    impact: [
      "Independent team CI/CD deployment pipelines",
      "Centralized design tokens and zero-runtime CSS variables",
      "Shared auth and navigation context",
    ],
    techStack: ["Vue 3", "React", "TypeScript", "Turborepo", "Vite", "Module Federation"],
    year: "2024",
    featured: false,
    githubUrl: "https://github.com/Rishabh2324",
    role: "Architect",
    highlights: ["Shared State Bus", "Zero-downtime Releases", "Universal Design Tokens"],
  },
];

export const skillsData: SkillCategory[] = [
  {
    title: "Architecture & UI Systems",
    icon: "layers",
    description: "Designing resilient, scalable frontend systems that streamline product delivery.",
    skills: [
      { name: "Config-Driven / JSON UI", level: "Expert", highlight: true },
      { name: "Micro-Frontends", level: "Advanced", highlight: true },
      { name: "Monorepo Architecture (Turborepo/Nx)", level: "Advanced", highlight: true },
      { name: "Design Systems & Token Architecture", level: "Expert", highlight: true },
      { name: "Component API Design", level: "Expert" },
      { name: "State Architecture (Pinia / Redux)", level: "Expert" },
    ],
  },
  {
    title: "Frontend Frameworks & Core",
    icon: "code",
    description: "Crafting modern, fluid, and robust user interfaces with cutting-edge web technologies.",
    skills: [
      { name: "Vue 3 (Composition API)", level: "Expert", highlight: true },
      { name: "React.js / Next.js", level: "Advanced", highlight: true },
      { name: "TypeScript / ESNext", level: "Expert", highlight: true },
      { name: "Astro", level: "Advanced" },
      { name: "Angular", level: "Proficient" },
      { name: "HTML5 / Semantic Web", level: "Expert" },
    ],
  },
  {
    title: "Styling & Motion Craft",
    icon: "palette",
    description: "Pixel-perfection, responsive layouts, smooth micro-interactions, and accessible CSS.",
    skills: [
      { name: "Modern CSS / CSS Variables", level: "Expert", highlight: true },
      { name: "Tailwind CSS", level: "Expert" },
      { name: "SCSS / CSS Modules", level: "Advanced" },
      { name: "Responsive & Adaptive Layouts", level: "Expert" },
      { name: "Micro-animations & Transitions", level: "Advanced" },
      { name: "Web Accessibility (a11y / WCAG)", level: "Advanced" },
    ],
  },
  {
    title: "Tooling, Performance & Ops",
    icon: "cpu",
    description: "Optimizing bundle sizes, developer ergonomics, and rock-solid deployment pipelines.",
    skills: [
      { name: "Vite / Webpack", level: "Advanced", highlight: true },
      { name: "Core Web Vitals & Lighthouse", level: "Expert", highlight: true },
      { name: "Git / GitHub Actions CI/CD", level: "Advanced" },
      { name: "Unit & Integration Testing", level: "Proficient" },
      { name: "REST / GraphQL APIs", level: "Advanced" },
      { name: "Performance Profiling", level: "Advanced" },
    ],
  },
];

/**
 * Schemas for the live config-driven UI engine on the home page.
 * Supported field types: text, email, select, range, checkbox, output.
 * `visibleWhen` adds conditional branching; `output` fields are computed
 * declaratively from other fields (base + Σ value × coefficient).
 */
export const demoSchemas = [
  {
    id: "user-onboarding",
    name: "Onboarding",
    description: "Conditional branching and real-time validation.",
    schema: {
      title: "Create workspace account",
      fields: [
        {
          id: "fullName",
          label: "Full name",
          type: "text",
          placeholder: "Alex Rivera",
          required: true,
          validation: { minLength: 3 },
        },
        {
          id: "workEmail",
          label: "Work email",
          type: "email",
          placeholder: "alex@company.com",
          required: true,
        },
        {
          id: "roleType",
          label: "Primary role",
          type: "select",
          options: ["Frontend Architect", "Product Designer", "Engineering Manager"],
          defaultValue: "Frontend Architect",
        },
        {
          id: "reports",
          label: "Direct reports",
          type: "range",
          min: 1,
          max: 30,
          defaultValue: 6,
          visibleWhen: { field: "roleType", equals: "Engineering Manager" },
        },
        {
          id: "releaseAlerts",
          label: "Release alerts",
          type: "checkbox",
          defaultValue: true,
        },
      ],
    },
  },
  {
    id: "pricing-calculator",
    name: "Pricing",
    description: "Declarative computed outputs that react instantly.",
    schema: {
      title: "Configure deployment tier",
      fields: [
        {
          id: "region",
          label: "Cloud region",
          type: "select",
          options: ["ap-south-1 · Mumbai", "us-east-1 · Virginia", "eu-central-1 · Frankfurt"],
          defaultValue: "ap-south-1 · Mumbai",
        },
        {
          id: "seats",
          label: "Developer seats",
          type: "range",
          min: 1,
          max: 50,
          defaultValue: 10,
        },
        {
          id: "prioritySla",
          label: "24/7 priority SLA",
          type: "checkbox",
          defaultValue: true,
        },
        {
          id: "monthly",
          label: "Monthly estimate",
          type: "output",
          format: "currency",
          compute: { base: 49, terms: { seats: 12, prioritySla: 199 } },
        },
      ],
    },
  },
  {
    id: "feature-flags",
    name: "Runtime flags",
    description: "Nested engine settings with dependent toggles.",
    schema: {
      title: "Engine runtime configuration",
      fields: [
        {
          id: "mode",
          label: "Compiler mode",
          type: "select",
          options: ["Production", "Development", "Strict"],
          defaultValue: "Production",
        },
        {
          id: "verboseLogs",
          label: "Verbose schema logs",
          type: "checkbox",
          defaultValue: false,
          visibleWhen: { field: "mode", equals: "Development" },
        },
        {
          id: "cacheTTL",
          label: "Schema cache TTL (min)",
          type: "range",
          min: 5,
          max: 120,
          defaultValue: 30,
        },
        {
          id: "telemetry",
          label: "Stream Web Vitals telemetry",
          type: "checkbox",
          defaultValue: true,
        },
      ],
    },
  },
];
