export type SocialLink = {
  label: string;
  href: string;
  copy?: string;
};

export const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/0xpolarzero",
  },
  {
    label: "Twitter",
    href: "https://x.com/0xpolarzero",
  },
  {
    label: "Email",
    href: "mailto:contact@polarzero.xyz",
    copy: "contact@polarzero.xyz",
  },
] as const satisfies SocialLink[];
