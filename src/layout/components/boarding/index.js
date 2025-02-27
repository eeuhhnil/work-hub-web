import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SpaceCard from "~/components/SpaceCard";

function Boarding() {
  const [listSpaces, setListSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:3002/spaces", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch spaces");
        }

        setListSpaces(data.data.map(space => ({ id: space._id, name: space.name })));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const handleSelectSpace = (space) => {
    localStorage.setItem("selectedSpace", JSON.stringify(space));
    navigate(`/space/${space.id}`);
  };

  return (
      <div className="w-full min-h-screen flex flex-col background-primary">
        <div className="w-full max-w-[500px] m-auto space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">Select space</h3>
            <Link to="/boarding/new">
              <button className="text-[#18181b] text-[14px] items-center rounded-md inline-flex bg-white py-2 px-4">
                + Create space
              </button>
            </Link>
          </div>
          <p className="text-[#a1a1aa] text-[14px]">Select space to continue...</p>
          <div className="flex flex-col space-y-6">
            {loading ? (
                <p className="text-white text-[16px]">Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : listSpaces.length === 0 ? (
                <p className="text-white text-[16px]">No space created</p>
            ) : (
                listSpaces.map((space) => (
                    <div
                        key={space.id}
                        className="border border-color rounded-md cursor-pointer hover:bg-gray-700 transition"
                        onClick={() => handleSelectSpace(space)}
                    >
                      <SpaceCard space={space} />
                    </div>
                ))
            )}
          </div>
        </div>
      </div>
  );
}

export default Boarding;
