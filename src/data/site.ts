/**
 * Site-wide settings. Everything a visitor reads about you that is not a
 * project or a job lives here or in content.ts.
 */
export const site = {
  name: "Anika Kesavan",
  firstName: "Anika",
  lastName: "Kesavan",
  roles: ["Software developer", "Builder", "Climate advocate"],
  tagline: "Software developer, builder, and climate advocate.",

  /**
   * TODO: add the email address you want public. While this is empty, the
   * contact section points people to LinkedIn instead.
   */
  email: "",
  links: [
    { label: "GitHub", href: "https://github.com/anikakesavan" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/anika-k-4a30b2379" },
  ],

  /**
   * Case studies ship with "notes to self" blocks that list what is still
   * missing (screenshots, stack, results). Set this to true while editing to see them. False hides every
   * one of them at once before you share the site.
   */
  showDrafts: false,
};

export const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "desk", label: "The desk" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;
