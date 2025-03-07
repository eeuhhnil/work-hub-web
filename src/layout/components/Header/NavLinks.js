import { Link, useParams } from "react-router-dom";

function NavLinks() {
    const { spaceId } = useParams();
  return (
    <nav className="space-x-4 mx-6">
      <Link to={`/space/${spaceId}`} className="text-sm font-medium text-muted-foreground hover:text-[#fafafa] cursor-pointer">
        Home
      </Link>
      <Link to={`/space/${spaceId}/project`} className="text-sm font-medium text-muted-foreground hover:text-[#fafafa] cursor-pointer">
        Project
      </Link>

        <Link to={`/space/${spaceId}/member`} className="text-sm font-medium text-muted-foreground hover:text-[#fafafa] cursor-pointer">Member</Link>
    </nav>
  );
}

export default NavLinks;
