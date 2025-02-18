import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CreateSpace() {
  const [nameSpace, setNameSpace] = useState("");
  const [message, setMessage] = useState("");
  const [spaces, setSpaces] = useState([]);

  const navigate = useNavigate();

  // Load danh sách spaces từ localStorage khi component mount
  useEffect(() => {
    const savedSpaces = localStorage.getItem("spaces");
    if (savedSpaces) {
      setSpaces(JSON.parse(savedSpaces));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (nameSpace.trim() === "") {
      setMessage("Space name cannot be empty");
      return;
    }

    // Kiểm tra xem space đã tồn tại chưa
    if (spaces.some((space) => space.name.toLowerCase() === nameSpace.toLowerCase())) {
      setMessage("This space name already exists!");
      return;
    }

    const newSpace = { id: Date.now(), name: nameSpace };
    const updatedSpaces = [...spaces, newSpace];

    // Cập nhật localStorage và state
    localStorage.setItem("spaces", JSON.stringify(updatedSpaces));
    setSpaces(updatedSpaces);

    setMessage("");
    alert(`Created space successfully: ${nameSpace}`);
    setNameSpace("");

    navigate(`/space/${nameSpace}`);
  };

  return (
    <div className="w-full min-h-screen flex flex-col background-primary">
      <div className="w-full max-w-[500px] m-auto space-y-4">
        <div className="flex justify-between items-center">
          <span className="cursor-pointer text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </span>
          <button className="text-white inline-flex h-[32px] w-[32px]">
            <img className="rounded-full" src="https://lh3.googleusercontent.com/a/ACg8ocLqoP1Ry1bS2-3--afGlto9uzglhr2WPhbEH44xp29J5hVvGwU=s96-c" alt="User" />
          </button>
        </div>
        <div className="border border-color rounded-md">
          <div className="rounded-xl bg-card text-card-foreground">
            <div className="flex flex-col p-6">
              <div className="font-bold text-2xl">Create new space</div>
            </div>
          </div>
          <div className="p-6 pt-0 space-y-2">
            <div className="text-sm text-muted-foreground">Space is a place where you manage your documents and information. All in one place.</div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-1">
                <div className="space-y-2 px-1">
                  <label className="text-sm font-medium text-[#fafafa]">Name</label>
                  <div className="flex flex-col items-center w-full space-y-4">
                    <input
                      className="flex h-[36px] w-full border border-color bg-transparent rounded-md px-3 py-2 text-card-foreground"
                      placeholder="Space name..."
                      value={nameSpace}
                      onChange={(e) => setNameSpace(e.target.value)}
                    />
                    {message && <div className="text-red-500">{message}</div>}
                  </div>
                </div>
              </div>
              <button className="bg-primary text-black inline-flex items-center justify-center px-4 py-2 h-[36px] font-medium rounded-md" type="submit">
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSpace;
