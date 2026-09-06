# portfolio-site

A clean, no-framework personal portfolio template: About, Projects, Skills,
and a validated Contact form. Plain HTML/CSS/JS, no build step, no
dependencies. Fill in your own info and it's ready to deploy.

## Running it

Open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customizing

- **Your info**: edit the placeholder text directly in `index.html` (name,
  tagline, About paragraph, GitHub/LinkedIn/email links, skills list).
- **Projects**: edit the `PROJECTS` array in `projects.js` — each entry is a
  `{ title, description, tags, link }` object rendered automatically.
- **Contact form**: validation logic lives in `validation.js` and is unit
  tested. The form currently only validates client-side; wire the `submit`
  handler in `index.html` up to a real email service (e.g. Formspree) or your
  own backend to actually send messages.

## Deploying

This is fully static, so it works as-is on GitHub Pages, Netlify, or Vercel.
For GitHub Pages: Settings → Pages → set the source to the `main` branch.

## Running tests

```bash
node --test
```

## License

MIT
