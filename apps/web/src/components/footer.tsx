import Image from "next/image"
import Link from "next/link"
import { LANDING_NAV_LINKS } from "@/constants"

export function Footer() {
  return (
    <footer className="relative border-x border-border border-t bg-background">
      <div className="container relative mx-auto max-w-7xl border-x border-border px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <Image
                src="/icons/logo-ic-black.svg"
                alt="Tome Logo"
                width={24}
                height={24}
              />
              <span className="text-lg tracking-tight">Tome</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-50">
              Capturing inspiration and organizing your digital world, one link
              at a time.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {LANDING_NAV_LINKS.map((navItem, index) => {
              if ("items" in navItem) {
                return (
                  <div key={navItem.label || index} className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                      {navItem.label}
                    </h4>
                    <ul className="space-y-2">
                      {navItem.items[0].links.slice(0, 4).map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href as any}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              }
              return null
            })}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
                Company
              </h4>
              <ul className="space-y-2">
                {LANDING_NAV_LINKS.filter((item) => "to" in item).map(
                  (item: any, i) => (
                    <li key={i}>
                      <Link
                        href={item.to}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
          <div className="md:col-span-1 space-y-4 md:text-right">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground/80">
              Connect
            </h4>
            <div className="flex flex-col md:items-end gap-2">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Twitter
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/50">
          <p>© {new Date().getFullYear()} Tome</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
