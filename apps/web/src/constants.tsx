export const LANDING_FEATURES = [
  {
    id: "capture",
    title: "Lightning Fast Capture",
    description:
      "Save any article, resource, or tweet in milliseconds with a keyboard shortcut.",
    icon: "IconBolt",
    className: "md:col-span-2 lg:col-span-1",
  },
  {
    id: "search",
    title: "Universal Search",
    description:
      "Find what you're looking for instantly. Full-text indexing makes sure nothing is lost.",
    icon: "IconSearch",
    className: "md:col-span-1 lg:col-span-2",
  },
  {
    id: "tagging",
    title: "Smart Tagging",
    description:
      "Organize dynamically. Use multi-dimensional tags to surface content when you need it.",
    icon: "IconTags",
    className: "md:col-span-1 lg:col-span-2",
  },
  {
    id: "interface",
    title: "Clutter-Free Interface",
    description:
      "Designed strictly for focus. Say goodbye to the bloated bookmark bars of the past.",
    icon: "IconLayoutSidebar",
    className: "md:col-span-2 lg:col-span-1",
  },
] as const;

export const LANDING_NAV_LINKS = [
  {
    label: "Features",
    items: [
      {
        title: "Platform",
        links: LANDING_FEATURES.map((f) => ({
          href: `#${f.id}`,
          label: f.title,
          description: f.description,
        })),
      },
      {
        title: "More",
        links: [
          {
            href: "#",
            label: "Integrations",
            description: "Connect Tome with your favorite tools.",
          },
          {
            href: "#",
            label: "API Docs",
            description: "Build on top of the Tome platform.",
          },
        ],
      },
    ],
  },
  { to: "#docs", label: "Docs" },
  { to: "/about", label: "About" },
] as const;
