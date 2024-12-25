import Header from "../components/Header/Header";

function HeaderOnly({ children }) {
  return (
    <div className="w-full min-h-screen">
      <Header />
      <div flex min-h-screen>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default HeaderOnly;
