import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "",
          label: "Posts",
          icon: SquarePen,
          submenus: [
            {
              href: "/resource/posts",
              label: "All Posts"
            },
            /*{
              href: "/posts/new",
              label: "New Post"
            }*/
          ]
        },
        {
          href: "/resource/categories",
          label: "Categories",
          icon: Bookmark
        },
        {
          href: "/resource/posts",
          label: "Posts",
          icon: Bookmark
        },
        {
          href: "/resource/events",
          label: "Events",
          icon: Bookmark
        },
        {
          href: "/resource/venues",
          label: "Venues",
          icon: Bookmark
        },
        {
          href: "/resource/tags",
          label: "Tags",
          icon: Tag
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          icon: Users
        },
        {
          href: "/account",
          label: "Account",
          icon: Settings
        }
      ]
    }
  ];
}
