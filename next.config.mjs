/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export: deploys to Vercel, Netlify, or GitHub Pages with no server.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // GitHub Pages serves a project site from /<repo-name>. The deploy workflow
  // sets NEXT_PUBLIC_BASE_PATH for that. Locally and on Vercel it stays empty.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};
export default nextConfig;
