// projects.js -- edit this array with your real projects.
// Each project needs: title, description, tags (array), and optionally a link.

const PROJECTS = [
  {
    title: "Project Title One",
    description: "One or two sentences on what it does and what you used to build it.",
    tags: ["Python", "React"],
    link: "https://github.com/your-username/project-one",
  },
  {
    title: "Project Title Two",
    description: "Same here -- the problem it solves and your role in building it.",
    tags: ["TypeScript", "Node.js"],
    link: "https://github.com/your-username/project-two",
  },
  {
    title: "Project Title Three",
    description: "A third project slot -- delete or duplicate this block as needed.",
    tags: ["SQL", "Azure"],
    link: "https://github.com/your-username/project-three",
  },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PROJECTS };
}
