export interface DocPage {
  title: string;
  href: string;
}

export interface DocSection {
  title: string;
  href: string;
  pages: DocPage[];
}

export const docsNavigation: DocSection[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    pages: [
      { title: "Installation", href: "/docs/getting-started/installation" },
      { title: "Account API", href: "/docs/getting-started/account-api" },
      { title: "Wallet Setup", href: "/docs/getting-started/wallet-setup" },
      { title: "First Session", href: "/docs/getting-started/first-session" },
      { title: "Migration", href: "/docs/getting-started/migration" },
    ],
  },
  {
    title: "User Guide",
    href: "/docs/user-guide",
    pages: [
      { title: "Smart Router", href: "/docs/user-guide/smart-router" },
      { title: "Models", href: "/docs/user-guide/models" },
      { title: "Tools", href: "/docs/user-guide/tools" },
      { title: "Sessions", href: "/docs/user-guide/sessions" },
      { title: "Self-Evolution", href: "/docs/user-guide/self-evolution" },
      { title: "Long Term Memory", href: "/docs/user-guide/long-term-memory" },
      { title: "Trading", href: "/docs/user-guide/trading" },
      { title: "Social", href: "/docs/user-guide/social" },
      { title: "Slash Commands", href: "/docs/user-guide/slash-commands" },
      { title: "Proxy Mode", href: "/docs/user-guide/proxy-mode" },
    ],
  },
  {
    title: "Developer Guide",
    href: "/docs/developer-guide",
    pages: [
      { title: "Architecture", href: "/docs/developer-guide/architecture" },
      { title: "Plugin SDK", href: "/docs/developer-guide/plugin-sdk" },
      { title: "MCP Integration", href: "/docs/developer-guide/mcp" },
      { title: "Contributing", href: "/docs/developer-guide/contributing" },
    ],
  },
  {
    title: "Reference",
    href: "/docs/reference",
    pages: [
      { title: "CLI", href: "/docs/reference/cli" },
      { title: "Configuration", href: "/docs/reference/configuration" },
      { title: "Pricing", href: "/docs/reference/pricing" },
      { title: "FAQ", href: "/docs/reference/faq" },
    ],
  },
];

export function getAllPages(): DocPage[] {
  const pages: DocPage[] = [];
  for (const section of docsNavigation) {
    pages.push({ title: section.title, href: section.href });
    for (const page of section.pages) {
      pages.push(page);
    }
  }
  return pages;
}

export function getPageNavigation(pathname: string): { prev?: DocPage; next?: DocPage } {
  const pages = getAllPages();
  const index = pages.findIndex((page) => page.href === pathname);

  if (index === -1) {
    return {};
  }

  return {
    prev: index > 0 ? pages[index - 1] : undefined,
    next: index < pages.length - 1 ? pages[index + 1] : undefined,
  };
}

export function getBreadcrumbs(pathname: string): { title: string; href: string }[] {
  const breadcrumbs: { title: string; href: string }[] = [
    { title: "Docs", href: "/docs" },
  ];

  for (const section of docsNavigation) {
    if (pathname === section.href) {
      breadcrumbs.push({ title: section.title, href: section.href });
      return breadcrumbs;
    }

    for (const page of section.pages) {
      if (pathname === page.href) {
        breadcrumbs.push({ title: section.title, href: section.href });
        breadcrumbs.push({ title: page.title, href: page.href });
        return breadcrumbs;
      }
    }
  }

  return breadcrumbs;
}
