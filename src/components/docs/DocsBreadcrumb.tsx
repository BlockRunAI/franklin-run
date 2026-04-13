import Link from "next/link";

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface DocsBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function DocsBreadcrumb({ items }: DocsBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-[13px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {index > 0 && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white/20"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              )}
              {isLast ? (
                <span className="text-white/50">{item.title}</span>
              ) : (
                <Link
                  href={item.href}
                  className="text-white/30 transition-colors hover:text-white/60"
                >
                  {item.title}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
