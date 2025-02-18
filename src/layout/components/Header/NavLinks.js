import { Link } from "react-router-dom";

function NavLinks() {
  return (
    <nav className="space-x-4 mx-6">
      <Link to={"/home"} className="text-sm font-medium text-muted-foreground hover:text-[#fafafa] cursor-pointer">
        Home
      </Link>
      <Link to={"/project"} className="text-sm font-medium text-muted-foreground hover:text-[#fafafa] cursor-pointer">
        Project
      </Link>
    </nav>
  );
}

export default NavLinks;
