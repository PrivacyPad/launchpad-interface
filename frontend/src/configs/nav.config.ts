import { Home, Plus, Rocket } from "lucide-react";

export type TNavConfig = {
  id: string;
  label: string;
  href: string;
  Icon?: React.ElementType; // Optional: Add icon property if needed
};

export const navConfig: TNavConfig[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    Icon: Home,
  },
  {
    id: "create-token",
    label: "Create Token",
    href: "/create-token",
    Icon: Plus,
  },
  {
    id: "create-launchpad",
    label: "Create Launchpad",
    href: "/create-launchpad",
    Icon: Rocket,
  },
];
