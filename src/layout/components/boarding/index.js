import SpaceCard from "~/components/SpaceCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Boarding() {
  const [listSpaces, setListSpaces] = useState([]);

  useEffect(() => {
    const savedSpaces = localStorage.getItem("spaces");
    const spaces = savedSpaces ? JSON.parse(savedSpaces) : [];
    setListSpaces(spaces);
  }, []);

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
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
          </span>
          <button className="text-white inline-flex h-[32px] w-[32px]">
            <span className="">
              <img className="rounded-full" src="https://lh3.googleusercontent.com/a/ACg8ocLqoP1Ry1bS2-3--afGlto9uzglhr2WPhbEH44xp29J5hVvGwU=s96-c" />
            </span>
          </button>
        </div>
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-bold text-lg">Select space</h3>
            <div>
              <Link to="/boarding/new">
                <button className="text-[#18181b] text-[14px] items-center rounded-md inline-flex bg-white py-2 px-4 ">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-1">
                    <path
                      d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z"
                      fill="currentColor"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  Create space
                </button>
              </Link>
            </div>
          </div>
          <p className="text-[#a1a1aa] text-[14px]">Select space to continue...</p>
        </div>
        <div className="flex flex-col space-y-6">
          {listSpaces.length === 0 ? (
            <p className="text-white text-[32px]">No space created</p>
          ) : (
            listSpaces.map((space) => (
              <div key={space.id} className="border border-color rounded-md">
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
