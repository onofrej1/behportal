import { FloatingNav } from "@/components/floating-navbar";
import "./page.css";
import { Home, MessageSquare, User } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <MessageSquare className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];

  return (
    <div>
      <FloatingNav navItems={navItems} />
      <section className="relative h-screen flex flex-col items-center justify-center text-center text-white py-0 px-3">
        <div className="video-docker absolute top-0 left-0 w-full h-full overflow-hidden">
          <video
            className="min-w-full min-h-full absolute object-cover"
            src="/test.mp4"
            autoPlay={false}
            muted
            loop
          ></video>
        </div>
        <div className="video-content space-y-2">
          <h1 className="font-light text-6xl">Bežecký portál</h1>
          <h3 className="font-light text-3xl">www.behportal.sk</h3>
        </div>
      </section>
      <div className="container mx-auto">
      {children}
      </div>
    </div>
  );
}
