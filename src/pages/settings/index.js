function Setting() {
  return (
    <div className="p-4">
      <div class="h-[70px] flex flex-col border-b">
        <div class="font-bold text-xl">Settings</div>
        <div class="text-sm text-muted-foreground">Settings and options for your project.</div>
      </div>
      <div className="border border-color flex flex-row px-1.5 gap-1">
        <div class="py-2.5 px-2 flex flex-row items-center gap-2 border-b-primary cursor-pointer box-border hover:border-b-2 hover:-mb-[2px] border-b-2 -mb-[2px] text-primary">
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
            class="lucide lucide-settings w-4 h-4"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span class="text-sm font-semibold">General</span>
        </div>
        <div class="py-2.5 px-2 flex flex-row items-center gap-2 border-b-primary cursor-pointer box-border hover:border-b-2 hover:-mb-[2px] text-muted-foreground">
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
            class="lucide lucide-cable w-4 h-4"
          >
            <path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1"></path>
            <path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9"></path>
            <path d="M21 21v-2h-4"></path>
            <path d="M3 5h4V3"></path>
            <path d="M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3"></path>
          </svg>
          <span class="text-sm font-semibold">Providers</span>
        </div>
        <div class="py-2.5 px-2 flex flex-row items-center gap-2 border-b-primary cursor-pointer box-border hover:border-b-2 hover:-mb-[2px] text-muted-foreground">
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
            class="lucide lucide-shield-alert w-4 h-4"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            <path d="M12 8v4"></path>
            <path d="M12 16h.01"></path>
          </svg>
          <span class="text-sm font-semibold">Danger zone</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div className="flex flex-col gap-2">
            <div class="w-[300px]">
              <p class="text-sm font-bold">Project code</p>
              <p class="text-sm text-muted-foreground">Can view and edit project information.</p>
            </div>
            <div className="flex items-center w-full">
              <input className="flex h-9 w-full rounded-md border border-color px-3 py-2 text-sm background-primary uppercase" />
            </div>
            <div class="w-[300px]">
              <p class="text-sm font-bold">Project name</p>
              <p class="text-sm text-muted-foreground">Can view and edit project information.</p>
            </div>
            <div className="flex items-center w-full">
              <input className="flex h-9 w-full rounded-md border border-color px-3 py-2 text-sm background-primary uppercase" />
            </div>
            <div class="w-[300px]">
              <p class="text-sm font-bold">Project description</p>
              <p class="text-sm text-muted-foreground">Can view and edit project information.</p>
            </div>
            <div className="flex items-center w-full">
              <input className="flex h-9 w-full rounded-md border border-color px-3 py-2 text-sm background-primary uppercase" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
