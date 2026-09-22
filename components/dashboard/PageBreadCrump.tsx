import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbProps = {
  items: BreadcrumbItem[];
};

export default function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-8 flex flex-wrap items-center gap-2 text-sm text-slate-500"
    >
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 && <span className="text-slate-300">/</span>}

          {item.href ? (
            <Link
              href={item.href}
              className="font-medium transition hover:text-blue-600"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-700">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
