import banner1 from "~/assets/images/landingpage/img1.png";
import banner2 from "~/assets/images/landingpage/img2.png";
import banner3 from "~/assets/images/landingpage/img3.png";
import banner4 from "~/assets/images/landingpage/img4.png";
import banner5 from "~/assets/images/landingpage/img6.png";

import { Link } from "react-router-dom";

function Container() {
  return (
    <div className="border-b">
      <div id="solution" className="container pt-16 grid items-center grid-cols-3">
        <div className="col-span-1">
          <h2 className="text-[#fafafa] text-3xl font-bold mb-3">Simplified Product Development</h2>
          <p className="text-muted-foreground  text-[16px] mt-3 mb-8">Centralize all your team abilities and manage your product development at ease.</p>
          <Link to="/login">
            <button className="text-black text-[16px] bg-white py-2 px-4 rounded-md"> Get started</button>
          </Link>
        </div>
        <div className="col-span-2">
          <img className="object-cover h-full w-full" src={banner1} alt="" />
        </div>
      </div>
      <div id="features" className="container pt-16 pb-16">
        <h4 className="text-[#fafafa] text-[30px] font-bold mb-3">Key Features Of WorkHub</h4>
        <p className="text-muted-foreground  text-[16px]">Discover the powerful tools that make team management seamless.</p>
        <div className="pt-16">
          <img src ={banner5} alt=""/>
          {/*<img src="https://stable.vn/assets/feature-dark-do8tzMEc.svg" alt=""></img>*/}
        </div>
      </div>
      <div id="product" className="container">
        <h4 className="text-[#fafafa] text-[30px] font-bold mb-3">How WorkHub Works</h4>
        <p className="text-muted-foreground  text-[16px]">A simple, step-by-step process to get you started and make the most out of WorkHub.</p>
        <div className="flex items-center overflow-hidden">
          <img src={banner2} alt="" />
          <img src={banner3} alt="" />
          <img src={banner4} alt="" />
        </div>
      </div>
    </div>
  );
}
export default Container;
