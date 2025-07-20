export type TNavConfig = {
  id: string;
  label: string;
  href: string;
};

export const navConfig: TNavConfig[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
  },
  {
    id: "create-token",
    label: "Create Token",
    href: "/create-token",
  },
  {
    id: "create-launchpad",
    label: "Create Launchpad",
    href: "/create-launchpad",
  },
];
