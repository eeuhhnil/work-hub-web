import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="container py-16">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className=" text-muted-foreground text-[16px]">Duong Thi Hue Linh</p>
          <a className=" text-muted-foreground text-[16px] hover:text-[#fafafa] cursor-pointer">Contact Us</a>
          <a className="text-muted-foreground text-[16px] hover:text-[#fafafa]cursor-pointer">Privacy Policy</a>
          <a className="text-muted-foreground  text-[16px] hover:text-[#fafafa] cursor-pointer">Terms of use</a>
        </div>
        <div className="flex gap-3 items-center">
            <Link to="https://github.com/eeuhhnil"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FontAwesomeIcon
                    icon={faGithub}
                    className="text-white w-[25px] h-[25px]"
                />
            </Link>
            <Link
                to="https://www.linkedin.com/in/eeuhhnil/"
                target="_blank"
                rel="noopener noreferrer"
            >
                <FontAwesomeIcon
                    icon={faLinkedin}
                    className="text-white w-[25px] h-[25px]"
                />
            </Link>
        </div>
      </div>
      <p className="text-muted-foreground text-[14px] mt-5">
        With powerful features tailored to meet the needs of modern teams, WorkHub ensures you can manage tasks, team members, and documents with ease. Choose Stable for an efficient, collaborative,
        and organized work environment that helps your team reach its full potential.
      </p>
    </div>
  );
}

export default Footer;
