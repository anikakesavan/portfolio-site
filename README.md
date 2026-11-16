# Anika Kesavan, portfolio

Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and Three.js through React Three Fiber. Exports to plain static files.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # writes the finished site to ./out
```

## Before you share it

1. `src/data/site.ts`: add the email address you want public. Until then the contact button opens LinkedIn.
2. `src/data/projects.ts`: each project has a `todo` list of what is missing. Fill in stack, role, screenshots, links.
3. `src/data/content.ts`: add RescueTime dates and details, and check the personal interests.
4. Set `showDrafts: true` in `site.ts` while editing to see each page's "Still to add" box. Keep it false on the live site.

## Where things live

| You want to change        | Edit                                   |
| ------------------------- | -------------------------------------- |
| Name, email, links, menu  | `src/data/site.ts`                     |
| Projects and case studies | `src/data/projects.ts`                 |
| About, experience, skills | `src/data/content.ts`                  |
| Colors and fonts          | `src/app/globals.css` (`@theme` block) |
| Section order             | `src/app/page.tsx`                     |

### Add a project

Copy an entry in `projects.ts`, give it a new `slug`, and pick a `preview`. It then shows up in the work list, the desk's file window, the terminal (`ls`, `open <slug>`), and gets its own page at `/work/<slug>/`.

For screenshots, put files in `public/work/` and list them under `images`. For a new animated preview, add a component to `src/components/Previews.tsx`.

## Components

- `Scene3D.tsx`: the contour terrain in the hero (custom shader) and the draggable globe. Both stop rendering when off screen.
- `Desk.tsx`: draggable windows and the working terminal.
- `Previews.tsx`: one animated scene per project.
- `Sections.tsx`: statement, work, about, experience, skills, achievements, contact.
- `Providers.tsx`: smooth scrolling (Lenis) and the page-transition curtain.
- `Cursor.tsx`, `Nav.tsx`, `ui.tsx`: cursor, menu, and shared pieces (`TLink`, `Magnetic`, `Letters`).

## Accessibility and motion

Keyboard works throughout: skip link, focus rings, a menu that traps focus and closes on Escape, and a terminal that is a normal text input. With "reduce motion" turned on, smooth scrolling, the cursor, page transitions, and looping animations switch off, and the 3D scenes hold still.

## Deploy

GitHub Pages: `.github/workflows/deploy.yml` builds and publishes on every push to `main`. One-time setup: repo Settings, Pages, set Source to "GitHub Actions". Vercel also works: import the repo, no settings needed.
