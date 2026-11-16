/**
 * Projects. To add one: copy an entry, change the slug, and pick a preview.
 * The homepage list, the desk, the terminal, and the case study page all
 * read from this array, so nothing else needs to change.
 */
export type PreviewKey = "api" | "rank" | "cnn" | "eco" | "space" | "asl";

export type Project = {
  slug: string;
  title: string;
  /** What kind of thing it is, in a few words. */
  kind: string;
  /** One or two sentences for the homepage. */
  summary: string;
  /** Tools and techniques. Leave empty until you can list the real ones. */
  stack: string[];
  /** Which animated preview to show. See components/Previews.tsx. */
  preview: PreviewKey;
  role?: string;
  period?: string;
  recognition?: string;
  /** Paragraphs for the top of the case study. */
  overview: string[];
  /** Screenshots. Put files in /public/work and list them here. */
  images?: { src: string; alt: string }[];
  links?: { label: string; href: string }[];
  /** Notes to self, shown only while site.showDrafts is true. */
  todo?: string[];
};

export const projects: Project[] = [
  {
    slug: "rescuetime",
    title: "RescueTime",
    kind: "Software engineering internship",
    summary:
      "An internship on the engineering team, with my work centered on integrations and APIs.",
    stack: ["APIs", "Integrations"],
    preview: "api",
    role: "Software Engineering Intern",
    overview: [
      "I work as a software engineering intern at RescueTime. My focus is integrations and APIs: the parts of a product that talk to other products.",
    ],
    todo: [
      "Add the languages and frameworks you use here.",
      "Describe one integration or endpoint you worked on, as far as you are allowed to share.",
      "Add dates, and a screenshot or diagram if the company is fine with it.",
    ],
  },
  {
    slug: "resumeiq",
    title: "ResumeIQ",
    kind: "AI resume screening platform",
    summary:
      "A screening tool on Azure that reads resumes, scores each candidate against the real job description, and shows recruiters why.",
    stack: [
      "Azure OpenAI",
      "Azure Document Intelligence",
      "Azure AI Search",
      "Blob Storage",
      "Service Bus",
      "Terraform",
      "CI/CD",
      "React",
      "TypeScript",
    ],
    preview: "rank",
    role: "UI/UX and data design, built during my Quadrant Technologies internship",
    period: "July to August 2026",
    recognition: "400 backend tests across 4 CI/CD pipelines",
    links: [{ label: "Code on GitHub", href: "https://github.com/anikakesavan/resume-iq" }],
    overview: [
      "Keyword-matching ATS software rejects good candidates because it cannot tell that \"led a team of 5\" and \"managed a small team\" mean the same thing. ResumeIQ reads the resume, scores the candidate against the actual job description, and shows the recruiter why the score came out that way.",
      "My part was UI/UX and data design: recruiter workflows, wireframes, the ERD, and the database schema behind the dashboard. Candidates are scored on skills, experience, education, and certifications, and a recruiter can change how much each one counts for a given role.",
      "On the back end, resumes are parsed with Azure Document Intelligence and Azure OpenAI. The results are split between Blob Storage and Azure AI Search depending on the kind of data, and Service Bus handles the queue.",
      "A recruiter copilot answers questions about candidates. It can only call 9 predefined tools, which keeps it from making things up. The infrastructure is all Terraform, and nothing ships without passing 400 backend tests across 4 CI/CD pipelines.",
    ],
    todo: ["Add screenshots of the recruiter dashboard and the copilot."],
  },
  {
    slug: "colorectal-cancer-cnn",
    title: "Colorectal Cancer CNN",
    kind: "Deep learning image classification",
    summary:
      "A convolutional neural network in Python that detects colorectal cancer in biopsy images with 97% accuracy.",
    stack: ["Python", "Convolutional neural networks", "Computer vision", "Machine learning"],
    preview: "cnn",
    period: "July 2025",
    recognition: "97% accuracy",
    overview: [
      "I built a convolutional neural network in Python to detect colorectal cancer from biopsy images. It reached a 97% accuracy score.",
      "I handled the full pipeline: preprocessing the medical imaging data, training the model, and evaluating it. The goal was to apply computer vision to earlier cancer detection.",
    ],
    todo: [
      "Name the dataset and the framework, and say how the 97% was measured.",
      "Add a confusion matrix or sample predictions as images.",
      "Link the repo if it is public.",
    ],
  },
  {
    slug: "ecocrafts",
    title: "EcoCrafts",
    kind: "Sustainability app",
    summary:
      "A mobile app for reducing plastic pollution, built with an international team. Technovation global quarterfinalist.",
    stack: ["Java", "Mobile app design", "Business planning", "Pitch development"],
    preview: "eco",
    role: "Team lead",
    period: "2020 to 2022",
    recognition: "Technovation global quarterfinalist",
    overview: [
      "EcoCrafts is a mobile app focused on reducing plastic pollution. I led an international team that took it to the quarterfinals of the Technovation competition.",
      "I oversaw the idea, the app design, the business plan, and the pitch, and worked with outside companies and with teammates in other countries.",
    ],
    todo: [
      "Describe what a user does in the app.",
      "Add screens from the app or the pitch video link.",
    ],
  },
  {
    slug: "bizzbloom",
    title: "BizzBloom",
    kind: "Marketplace",
    summary:
      "A two-sided marketplace that connects owners of underused workspaces with people who need a space for a short time.",
    stack: [],
    preview: "space",
    overview: [
      "BizzBloom is a marketplace for underused workspaces. One side lists space that sits empty. The other side rents it short-term.",
    ],
    todo: [
      "Add your role and who you built it with.",
      "Add the stack, or say that this was product and market work if no code shipped.",
      "Add mockups, research findings, or the pitch.",
    ],
  },
  {
    slug: "asl-flashcards",
    title: "ASL Flashcards",
    kind: "Learning app",
    summary:
      "An interactive application for learning American Sign Language with flashcards.",
    stack: [],
    preview: "asl",
    overview: [
      "ASL Flashcards is an interactive application for learning American Sign Language.",
    ],
    todo: [
      "Describe how a study session works (flip, quiz, progress).",
      "Add the stack and a link to the app or repo.",
      "Add screenshots.",
    ],
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);
