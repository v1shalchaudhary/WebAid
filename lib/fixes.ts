import type { Issue } from "./scanner";

export type FixStep = {
  title: string;
  description: string;
};

export type Fix = {
  issue: string;
  severity: string;
  steps: FixStep[];
};

function fixForIssue(issue: Issue): FixStep[] {
  const msg = issue.message.toLowerCase();

  if (msg.includes("https")) {
    return [
      {
        title: "Get an SSL/TLS certificate",
        description:
          "Most hosts (Vercel, Netlify, Cloudflare) issue free certificates automatically. If self-hosting, use Let's Encrypt via Certbot.",
      },
      {
        title: "Force HTTP to redirect to HTTPS",
        description:
          "Configure your host, reverse proxy, or server config to redirect any http:// request to the https:// version permanently (301 redirect).",
      },
      {
        title: "Update internal links",
        description:
          "Make sure any hardcoded http:// links in your own code are updated to https:// so you're not relying on the redirect for every request.",
      },
    ];
  }

  if (msg.includes("title")) {
    return [
      {
        title: "Add a <title> tag",
        description:
          "Inside your page's <head>, add a <title>Your Page Name</title> tag. Keep it under 60 characters so it doesn't get cut off in search results.",
      },
      {
        title: "Make it unique per page",
        description:
          "If you have multiple pages, give each one a distinct, descriptive title rather than reusing the same one everywhere — this matters a lot for SEO.",
      },
    ];
  }

  if (msg.includes("meta description")) {
    return [
      {
        title: "Add a meta description tag",
        description:
          'In your <head>, add: <meta name="description" content="A short summary of this page, under 155 characters.">',
      },
      {
        title: "Write it for humans, not keywords",
        description:
          "This text often shows directly in Google search results — write a natural sentence that makes someone want to click, not a list of keywords.",
      },
    ];
  }

  if (msg.includes("alt text")) {
    return [
      {
        title: "Add alt attributes to every image",
        description:
          'Change <img src="photo.jpg"> to <img src="photo.jpg" alt="Description of what the image shows">.',
      },
      {
        title: "Use empty alt for purely decorative images",
        description:
          'If an image is just decoration and conveys no information, use alt="" rather than leaving it off entirely — this tells screen readers to skip it cleanly.',
      },
    ];
  }

  if (msg.includes("slow") || msg.includes("respond")) {
    return [
      {
        title: "Compress and resize images",
        description:
          "Large, uncompressed images are the most common cause of slow load times. Use modern formats (WebP/AVIF) and resize images to the dimensions they're actually displayed at.",
      },
      {
        title: "Enable caching and a CDN",
        description:
          "Serve static assets through a CDN (Cloudflare, Vercel's built-in CDN) and set cache headers so repeat visitors don't re-download everything.",
      },
      {
        title: "Audit third-party scripts",
        description:
          "Analytics, chat widgets, and ad scripts often block rendering. Load non-essential scripts with the defer or async attribute.",
      },
    ];
  }

  if (msg.includes("error status")) {
    return [
      {
        title: "Check your server logs",
        description:
          "An error status code means your server itself reported a problem. Check your hosting dashboard's logs for the exact error at the time of the request.",
      },
      {
        title: "Verify the route actually exists",
        description:
          "Confirm the URL being requested matches an actual page or API route in your deployed code — a common cause is a typo or a page that was removed.",
      },
    ];
  }

  // Fallback for any issue type not explicitly covered yet
  return [
    {
      title: "Investigate this issue",
      description:
        "This issue doesn't have a specific automated fix yet — review the message above and check relevant documentation for your framework or host.",
    },
  ];
}

export function generateFixes(issues: Issue[]): Fix[] {
  return issues.map((issue) => ({
    issue: issue.message,
    severity: issue.severity,
    steps: fixForIssue(issue),
  }));
}
