function SidebarRightHome() {
  return (
    <div className=" max-w-[280px] w-full border-l border-color">
      <div className="flex p-4 border-b border-color flex-col h-fit">
        <div className="font-semibold flex flex-row gap-3 items-center">
          Ongoing project
          <div className="px-2 py-0.5 text-[14px] rounded-lg border items-center flex flex-row gap-1.5">
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
              class="lucide lucide-rocket w-4 h-4"
            >
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
              <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
              <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
            </svg>
            2
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarRightHome;
