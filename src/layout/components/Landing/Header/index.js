import { Link } from "react-router-dom";
function Header() {
  return (
    <div className=" h-[74px] background-primary wrapper border-b flex justify-between items-center sticky top-0 left-0 right-0 z-[999]">
      <div className="flex justify-between items-center container">
        <div className="flex gap-3">
          <a href="#solution" className=" p-3 text-[14px] text-primary cursor-pointer text-muted-foreground hover:text-[#fafafa]">
            Solution
          </a>
          <a href="#features" className="p-3 text-[14px] text-primary cursor-pointer text-muted-foreground hover:text-[#fafafa]">
            Features
          </a>
          <a href="#product" className="p-3 text-[14px] text-primary cursor-pointer text-muted-foreground hover:text-[#fafafa]">
            Product
          </a>
        </div>
        <div className="flex gap-3">
          <Link to="/login">
            <button className="text-[14px]  border border-color px-4 py-2">Sign in</button>
          </Link>
          <button className="text-[14px] bg-white px-4 py-2 text-black">Start for free</button>
        </div>
      </div>
    </div>
  );
}

export default Header;
