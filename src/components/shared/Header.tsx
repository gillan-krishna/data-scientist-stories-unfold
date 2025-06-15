
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `text-lg font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <header className="py-8 px-4 md:px-6">
      <nav className="container mx-auto flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold">
          My Portfolio
        </NavLink>
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/" className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/blog" className={navLinkClasses}>
            Blog
          </NavLink>
          <NavLink to="/now-playing" className={navLinkClasses}>
            Music
          </NavLink>
        </div>
        <Button className="hidden md:block" variant="secondary">Contact Me</Button>
      </nav>
    </header>
  );
};

export default Header;
