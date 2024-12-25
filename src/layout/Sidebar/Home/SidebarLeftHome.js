import Calendar from "~/pages/calender";

function SidebarLeftHome() {
  return (
    <div className="max-w-[280px] w-full border-r border-color">
      <div className=" flex flex-col items-center p-4">
        <span className="relative flex shrink-0 rounded-full w-[66px] h-[66px] cursor-pointer">
          <img class="aspect-square h-full w-full rounded-full" src="https://lh3.googleusercontent.com/a/ACg8ocLqoP1Ry1bS2-3--afGlto9uzglhr2WPhbEH44xp29J5hVvGwU=s96-c"></img>
        </span>
        <p className="mt-2">Duong Thi Hue Linh</p>
        <p className="text-gray-400 text-[1rem]">k60duongthihuelinh@gmail.com</p>
      </div>
      <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-muted"></div>
      <Calendar />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>Upcoming Events</div>
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
            class="lucide lucide-calendar w-4 h-4"
          >
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <path d="M3 10h18"></path>
          </svg>
        </div>
        <div class="text-muted-foreground text-sm">All events for the next 7 days.</div>
      </div>
    </div>
  );
}

export default SidebarLeftHome;
