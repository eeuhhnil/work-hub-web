import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SpaceDropdown() {
  const [listSpaces, setListSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
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

        const spaces = data.data.map(space => ({ id: space._id, name: space.name }));
        setListSpaces(spaces);

        // ✅ Lấy `selectedSpace` từ localStorage
        const savedSpace = JSON.parse(localStorage.getItem("selectedSpace"));
        if (savedSpace && spaces.some(space => space.id === savedSpace.id)) {
          setSelectedSpace(savedSpace);
        } else if (spaces.length > 0) {
          setSelectedSpace(spaces[0]);
        }
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
    setSelectedSpace(space);
    navigate(`/space/${space.id}`);
  };

  return (
      <RadixDropdownMenu.Root>
        <RadixDropdownMenu.Trigger className="relative">
          <button className="inline-flex items-center rounded-md border border-input border-color px-4 py-2 w-[180px] hover:bg-accent shadow-md">
            <span className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 mr-2"></span>
            <p className="text-[14px] font-medium">{selectedSpace ? selectedSpace.name : "No Space Selected"}</p>
            <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-auto h-6 w-6 text-gray-300">
              <path
                  d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179Z"
                  fill="currentColor"
              ></path>
            </svg>
          </button>
        </RadixDropdownMenu.Trigger>

        <RadixDropdownMenu.Content
            className="border border-input border-color bg-[#1e1e2e] rounded-md shadow-lg mt-2 min-w-[200px] z-50 absolute right-0"
            align="end"
        >
          <div className="px-2 py-2">
            <p className="text-gray-400 text-sm mb-2">Teams</p>
            {loading ? (
                <p className="text-white text-center">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : listSpaces.length === 0 ? (
                <p className="text-gray-400 text-center">No space available</p>
            ) : (
                listSpaces.map((space) => (
                    <RadixDropdownMenu.Item key={space.id} onClick={() => handleSelectSpace(space)}>
                      <div className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-700 rounded-md transition">
                        <span className="w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-500 mr-2"></span>
                        <span className="text-white">{space.name}</span>
                      </div>
                    </RadixDropdownMenu.Item>
                ))
            )}
          </div>

          <div className="border-t border-gray-600 px-2 py-2">
            <button
                className="flex items-center w-full px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition text-white"
                onClick={() => navigate("/boarding/new")}
            >
              <span className="mr-2">➕</span> Create Space
            </button>
          </div>
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Root>
  );
}

export default SpaceDropdown;
