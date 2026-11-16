/**
 * Everything on the homepage that is not a project: the intro statement,
 * interests, experience, skills, achievements, and personal interests.
 * Edit the text here. Components pick it up automatically.
 */

export const statement =
  "I build software people can put to use: an AI screening dashboard for recruiters, a neural network that reads colorectal biopsy images, a marketplace for empty workspaces. Away from the keyboard I organize young people in Washington around climate policy with Citizens' Climate Lobby.";

export type Interest = { title: string; body: string; related?: string[] };

export const interests: Interest[] = [
  {
    title: "Computer science",
    body: "Software internships at RescueTime and Quadrant Technologies, and a steady run of side projects in between. I also tutor computer science and math.",
    related: ["rescuetime"],
  },
  {
    title: "AI",
    body: "ResumeIQ reads resumes with Azure OpenAI and explains every score it gives. My colorectal cancer CNN detects cancer in biopsy images at 97% accuracy.",
    related: ["resumeiq", "colorectal-cancer-cnn"],
  },
  {
    title: "Entrepreneurship",
    body: "BizzBloom is a marketplace that matches underused workspaces with people who need one for a short time.",
    related: ["bizzbloom"],
  },
  {
    title: "Sustainability",
    body: "EcoCrafts, an app for cutting plastic pollution, reached the Technovation global quarterfinals. With Citizens' Climate Lobby I lead 50+ advocates and worked with my school district on electric buses and solar.",
    related: ["ecocrafts"],
  },
  {
    title: "Real-world impact",
    body: "I pick projects where somebody outside the team is better off when the thing works. ASL Flashcards is one of them.",
    related: ["asl-flashcards"],
  },
];

export type Role = {
  org: string;
  title: string;
  /** Optional. Leave out until you have the exact dates. */
  period?: string;
  points: string[];
};

export const experience: Role[] = [
  {
    org: "RescueTime",
    title: "Software Engineering Intern",
    // TODO: add dates and one or two specifics you are allowed to share.
    points: ["Engineering work focused on integrations and APIs."],
  },
  {
    org: "Quadrant Technologies",
    title: "Technology Intern",
    period: "July to August 2026",
    points: [
      "Built an AI resume screening platform on Azure that parses, scores, and ranks candidates against job requirements, with scoring weights a recruiter can adjust.",
      "Designed and shipped a recruiter copilot that surfaces top candidates and explains every score with evidence cited from the resume.",
      "Set up the cloud infrastructure in Terraform, with CI/CD pipelines that run a 400-case test suite before anything deploys.",
    ],
  },
  {
    org: "RevArt",
    title: "Digital Marketing Intern",
    period: "September 2025 to January 2026",
    points: [
      "Built a marketing AI tool that analyzes content and spots engagement trends, then used it to set KPIs.",
      "Ran RevArt's Instagram: created and scheduled posts and tracked reach, engagement, and shares, contributing to 50K+ total views and 250 new followers.",
      "Launched an open call campaign and a giveaway campaign aimed at new users.",
      "Designed and organized a digital art catalog.",
    ],
  },
  {
    org: "Citizens' Climate Lobby",
    title: "Washington Youth Leadership",
    period: "August 2025 to present",
    points: [
      "Lead a team of 50+ advocates pushing for federal climate policy, and train them to speak with lawmakers.",
      "Meet with legislators and congressional staff to make the case with climate science, economics, and constituent priorities.",
      "As district coordinator, worked with my school district on electric school buses, solar panels, and energy efficiency.",
      "Ran social media campaigns to bring more people into advocacy.",
    ],
  },
];

/** TODO: check this list. It only includes tools tied to work listed on this site. */
export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "TypeScript", "Java", "HTML", "CSS"] },
  {
    group: "Front end",
    items: ["React", "Tailwind CSS", "TanStack Router", "Recharts", "shadcn/ui"],
  },
  {
    group: "AI and data",
    items: ["Azure OpenAI", "Convolutional neural networks", "Computer vision", "Azure AI Search"],
  },
  { group: "Cloud and DevOps", items: ["Azure", "Terraform", "CI/CD pipelines", "API integrations"] },
  {
    group: "Beyond code",
    items: ["Legislative outreach", "Team leadership", "Digital marketing", "UI/UX design"],
  },
];

export const achievements: { big: string; detail: string }[] = [
  { big: "97%", detail: "Accuracy of my colorectal cancer CNN on biopsy images." },
  {
    big: "Global quarterfinalist",
    detail: "Technovation, leading the international team behind EcoCrafts.",
  },
  { big: "50+ advocates", detail: "The climate team I lead with Citizens' Climate Lobby." },
  { big: "50K+ views", detail: "On RevArt's Instagram during my internship, plus 250 new followers." },
  { big: "120 hours", detail: "Mentoring kids at Camp Invention." },
];

/** TODO: check these. Remove any you would rather not publish. */
export const personal: string[] = [
  "Lacrosse",
  "Music, most of the day",
  "Side projects with no deadline",
  "Tacos",
];

/** Pins on the globe. lat and lon are rough country positions. */
export const places: { name: string; lat: number; lon: number }[] = [
  { name: "Ireland", lat: 53.3, lon: -7.7 },
  { name: "Canada", lat: 54, lon: -105 },
  { name: "United States", lat: 44, lon: -120 },
];
