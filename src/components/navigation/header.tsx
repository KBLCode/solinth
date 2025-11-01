"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { MenuToggleIcon } from "@/components/ui/menu-toggle-icon";
import { createPortal } from "react-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { LucideIcon } from "lucide-react";
import {
  BarChart,
  Users,
  Star,
  FileText,
  Shield,
  RotateCcw,
  UserPlus,
  HelpCircle,
  Sparkles,
  Zap,
  TrendingUp,
  Database,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export function Header() {
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn("sticky top-0 z-50 w-full border-b border-transparent", {
        "glass-navbar border-border backdrop-blur-lg": scrolled,
      })}
    >
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="hover:bg-accent flex items-center gap-2 rounded-md p-2"
          >
            <Logo size={32} showText={false} />
            <span className="text-base font-bold text-dusk-slate dark:text-solar-white">
              Solinth
            </span>
          </Link>
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-dusk-slate dark:text-solar-white">
                  Product
                </NavigationMenuTrigger>
                <NavigationMenuContent className="glass-card p-1 pr-1.5">
                  <ul className="w-lg grid grid-cols-2 gap-2 rounded-md border border-dusk-slate/10 p-2 shadow dark:border-sky-mist/10">
                    {productLinks.map((item, i) => (
                      <li key={i}>
                        <ListItem {...item} />
                      </li>
                    ))}
                  </ul>
                  <div className="p-2">
                    <p className="text-muted-foreground text-sm text-dusk-slate/60 dark:text-sky-mist/60">
                      Interested?{" "}
                      <a
                        href="/contact"
                        className="font-medium text-dusk-slate text-foreground hover:underline dark:text-solar-white"
                      >
                        Schedule a demo
                      </a>
                    </p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-dusk-slate dark:text-solar-white">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent className="glass-card p-1 pb-1.5 pr-1.5">
                  <div className="w-lg grid grid-cols-2 gap-2">
                    <ul className="space-y-2 rounded-md border border-dusk-slate/10 p-2 shadow dark:border-sky-mist/10">
                      {companyLinks.map((item, i) => (
                        <li key={i}>
                          <ListItem {...item} />
                        </li>
                      ))}
                    </ul>
                    <ul className="space-y-2 p-3">
                      {companyLinks2.map((item, i) => (
                        <li key={i}>
                          <NavigationMenuLink
                            href={item.href}
                            className="hover:bg-accent flex flex-row items-center gap-x-2 rounded-md p-2 text-dusk-slate dark:text-solar-white"
                          >
                            <item.icon className="size-4 text-foreground" />
                            <span className="font-medium">{item.title}</span>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuLink className="px-4" asChild>
                <Link
                  href="/pricing"
                  className="hover:bg-accent rounded-md p-2 text-dusk-slate dark:text-solar-white"
                >
                  Pricing
                </Link>
              </NavigationMenuLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login">
            <div className="glass-button-wrap">
              <button className="glass-button rounded-full px-6 py-2 text-sm font-semibold">
                <span className="glass-button-text">Sign In</span>
              </button>
              <div className="glass-button-shadow rounded-full"></div>
            </div>
          </Link>
          <Link href="/signup">
            <div className="glass-button-wrap">
              <button className="glass-button rounded-full px-6 py-2 text-sm font-semibold">
                <span className="glass-button-text">Get Started</span>
              </button>
              <div className="glass-button-shadow rounded-full"></div>
            </div>
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-dusk-slate dark:text-solar-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="size-5" duration={300} />
        </button>
      </nav>
      <MobileMenu
        open={open}
        className="flex flex-col justify-between gap-2 overflow-y-auto"
      >
        <NavigationMenu className="max-w-full">
          <div className="flex w-full flex-col gap-y-2">
            <span className="text-sm font-semibold text-dusk-slate dark:text-solar-white">
              Product
            </span>
            {productLinks.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
            <span className="mt-4 text-sm font-semibold text-dusk-slate dark:text-solar-white">
              Company
            </span>
            {companyLinks.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
            {companyLinks2.map((link) => (
              <ListItem key={link.title} {...link} />
            ))}
          </div>
        </NavigationMenu>
        <div className="flex flex-col gap-2">
          <Link href="/login">
            <div className="glass-button-wrap w-full">
              <button className="glass-button w-full rounded-full px-6 py-3 text-sm font-semibold">
                <span className="glass-button-text">Sign In</span>
              </button>
              <div className="glass-button-shadow rounded-full"></div>
            </div>
          </Link>
          <Link href="/signup">
            <div className="glass-button-wrap w-full">
              <button className="glass-button w-full rounded-full px-6 py-3 text-sm font-semibold">
                <span className="glass-button-text">Get Started</span>
              </button>
              <div className="glass-button-shadow rounded-full"></div>
            </div>
          </Link>
        </div>
      </MobileMenu>
    </header>
  );
}

type MobileMenuProps = React.ComponentProps<"div"> & {
  open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
  if (!open || typeof window === "undefined") return null;

  return createPortal(
    <div
      id="mobile-menu"
      className={cn(
        "glass-card",
        "fixed bottom-0 left-0 right-0 top-14 z-40 flex flex-col overflow-hidden border-y md:hidden"
      )}
    >
      <div
        data-slot={open ? "open" : "closed"}
        className={cn(
          "data-[slot=open]:animate-in data-[slot=open]:zoom-in-97 ease-out",
          "size-full p-4",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

function ListItem({
  title,
  description,
  icon: Icon,
  className,
  href,
  ...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem) {
  return (
    <NavigationMenuLink
      className={cn(
        "data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex w-full flex-row gap-x-2 rounded-sm p-2",
        className
      )}
      {...props}
      asChild
    >
      <a href={href}>
        <div className="glass-card flex aspect-square size-12 items-center justify-center rounded-md border border-dusk-slate/10 shadow-sm dark:border-sky-mist/10">
          <Icon className="size-5 text-dusk-slate text-foreground dark:text-solar-white" />
        </div>
        <div className="flex flex-col items-start justify-center">
          <span className="font-medium text-dusk-slate dark:text-solar-white">
            {title}
          </span>
          <span className="text-muted-foreground text-xs text-dusk-slate/60 dark:text-sky-mist/60">
            {description}
          </span>
        </div>
      </a>
    </NavigationMenuLink>
  );
}

const productLinks: LinkItem[] = [
  {
    title: "Business Suite",
    href: "/product/business",
    description: "Track revenue per hour/product",
    icon: TrendingUp,
  },
  {
    title: "AI Assistant",
    href: "/product/ai",
    description: "Natural language queries",
    icon: Sparkles,
  },
  {
    title: "Custom Dashboards",
    href: "/product/dashboards",
    description: "Build your own analytics",
    icon: BarChart,
  },
  {
    title: "Integrations",
    href: "/product/integrations",
    description: "Connect your tools",
    icon: Zap,
  },
  {
    title: "Reporting Suite",
    href: "/product/reporting",
    description: "Automated PDF reports",
    icon: FileText,
  },
  {
    title: "Data Security",
    href: "/product/security",
    description: "Enterprise-grade protection",
    icon: Database,
  },
];

const companyLinks: LinkItem[] = [
  {
    title: "About Us",
    href: "/about",
    description: "Learn more about our story",
    icon: Users,
  },
  {
    title: "Customer Stories",
    href: "/customers",
    description: "See how we helped clients",
    icon: Star,
  },
  {
    title: "Partnerships",
    href: "/partners",
    icon: UserPlus,
    description: "Collaborate with us",
  },
];

const companyLinks2: LinkItem[] = [
  {
    title: "Terms of Service",
    href: "/terms",
    icon: FileText,
  },
  {
    title: "Privacy Policy",
    href: "/privacy",
    icon: Shield,
  },
  {
    title: "Refund Policy",
    href: "/refund",
    icon: RotateCcw,
  },
  {
    title: "Help Center",
    href: "/help",
    icon: HelpCircle,
  },
];
