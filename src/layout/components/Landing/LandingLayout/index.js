import Header from "~/layout/components/Landing/Header";
import Container from "~/layout/components/Landing/Container";
import Footer from "~/layout/components/Landing/Footer";
import classNames from "classnames/bind";
import styles from "./LandingLayout.module.scss";

const cx = classNames.bind(styles);

function LandingLayout() {
  return (
    <div className={cx("wrapper", "min-h-screen")}>
      <Header />
      <Container />
      <Footer />
    </div>
  );
}

export default LandingLayout;
