import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // Old Gatsby-era paths, still in search indexes. Post slugs that exist on
      // the Hashnode blog redirect to the post; the rest go to the blog home.
      { source: "/blog", destination: "https://blog.idrisolubisi.com/", permanent: true },
      { source: "/blog/:path*", destination: "https://blog.idrisolubisi.com/:path*", permanent: true },
      { source: "/page-2", destination: "/", permanent: true },
      {
        source: "/How-to-add-a-ReadMe-file-to-your-github-profile",
        destination: "https://blog.idrisolubisi.com/how-to-add-a-readme-file-to-your-github-profile",
        permanent: true,
      },
      {
        source: "/Setting-up-your-Development-Environment",
        destination: "https://blog.idrisolubisi.com/setting-up-your-development-environment",
        permanent: true,
      },
      {
        source: "/Deploy-Your-Front-End-App-To-Netlify-in-4-minutes",
        destination: "https://blog.idrisolubisi.com/",
        permanent: true,
      },
      { source: "/how-to-create-react-app", destination: "https://blog.idrisolubisi.com/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
