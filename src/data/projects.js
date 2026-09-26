export const WORK_PROJECTS = [
  {
    id: "erp-trans-continent",
    title: "Enterprise Resource Planning (ERP)",
    company: "Trans Continent",
    year: null,
    description:
      "Integrated ERP web application streamlining end-to-end logistics—shipment management, container tracking, operational reporting, customer services, and admin processes. The core operational backbone improving visibility, efficiency, and data accuracy.",
    tags: ["Enterprise Systems", "Logistics", "Web Application"],
    link: null,
  },
  {
    id: "ctms",
    title: "Container Tracking Management System",
    company: "Trans Continent",
    year: null,
    description:
      "Real-time visibility into container movements throughout the logistics lifecycle. Enables teams and customers to track status, locations, and movement history—reducing manual tracking and improving transparency.",
    tags: ["Tracking", "Real-time", "Logistics"],
    link: null,
  },
  {
    id: "wms",
    title: "Warehouse Management System",
    company: "Trans Continent",
    year: null,
    description:
      "Warehouse management solution optimizing inventory control, inbound/outbound operations, stock monitoring, and warehouse utilization for improved accuracy and operational productivity.",
    tags: ["WMS", "Inventory", "Operations"],
    link: null,
  },
  {
    id: "ai-customer-service",
    title: "AI-Powered Customer Service Automation",
    company: "Trans Continent",
    year: null,
    description:
      "Intelligent customer service platform leveraging Agentic AI to assist logistics and support teams—automating inquiries, operational requests, and knowledge retrieval for faster, consistent responses.",
    tags: ["Agentic AI", "Automation", "Customer Service"],
    link: null,
  },
  {
    id: "dsas",
    title: "Dynamic Scheduling Automation System",
    company: "Semesta Energy Services",
    year: null,
    description:
      "AI/ML-powered planning platform for petroleum distribution—optimizing scheduling and transportation for crude oil, LPG, fuel, and intermediates with predictive scenarios and route recommendations.",
    tags: ["AI", "ML", "Energy Supply Chain"],
    link: null,
  },
  {
    id: "gms",
    title: "General Management System",
    company: "KB Insurance",
    year: null,
    description:
      "Comprehensive operational platform supporting procurement, warehouse management, asset management, and general affairs—centralizing workflows and improving organizational efficiency.",
    tags: ["Enterprise", "Insurance", "Operations"],
    link: null,
  },
  {
    id: "pms",
    title: "Policy Management System",
    company: "KB Insurance",
    year: null,
    description:
      "Insurance policy management platform for lifecycle management, issuance, endorsements, customer data, and operational reporting—with data integrity and regulatory compliance built in.",
    tags: ["Insurance", "Policy Lifecycle", "Compliance"],
    link: null,
  },
  {
    id: "bpk-education",
    title: "International Education & Assessment",
    company: "BPK PENABUR",
    year: null,
    description:
      "Delivered IGCSE curriculum instruction and facilitated academic assessments for international students—creating engaging learning environments and supporting achievement of global academic standards.",
    tags: ["IGCSE", "Education", "Assessment"],
    link: null,
  },
  {
    id: "lepkom-lms",
    title: "Learning Management System",
    company: "LEPKOM Gunadarma",
    year: null,
    description:
      "Implemented and supported LMS solutions for higher education—deploying digital learning platforms, supporting academic operations, and enhancing ed-tech adoption across campus stakeholders.",
    tags: ["LMS", "Higher Education", "Ed-Tech"],
    link: null,
  },
];

export const BUILT_PROJECTS = [
  {
    id: "dierhaul",
    title: "Dierhaul",
    company: null,
    year: null,
    description: "One-stop solution system for logistic operational management.",
    tags: ["Logistics"],
    link: "https://www.dierhaul.my.id/",
  },
  {
    id: "tcontinent",
    title: "Landing Page for Trans Continent",
    company: null,
    year: null,
    description: "Landing page for Trans Continent, a logistics company.",
    tags: ["Logistics", "Web"],
    link: "https://tcontinent.com/",
  },
  {
    id: "maleo-aviation",
    title: "Maleo Aviation",
    company: null,
    year: null,
    description: "Ground handling company profile website.",
    tags: ["Aviation", "Web"],
    link: "https://maleoaviation.com/",
  },
  {
    id: "eprocurement",
    title: "eProcurement",
    company: null,
    year: null,
    description: "Procurement management system for vendor and purchasing workflows.",
    tags: ["Procurement", "Enterprise"],
    link: "https://ebusiness.kbinsure.co.id/vendor/user/login",
  },
  {
    id: "loja-app",
    title: "Loja App",
    company: null,
    year: null,
    description: "Blogging and personal writing website for sharing thoughts, experiences, and insights.",
    tags: ["Mobile", "Personal"],
    link: "https://loja.my.id",
  },
];

export const ALL_PROJECTS = [...WORK_PROJECTS, ...BUILT_PROJECTS];

export function getProjectById(id) {
  return ALL_PROJECTS.find((p) => p.id === id) ?? null;
}

export function getYearRange(projects) {
  const years = projects.map((p) => p.year).filter((y) => y != null);
  if (years.length === 0) return "—";
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min} — ${max}`;
}
