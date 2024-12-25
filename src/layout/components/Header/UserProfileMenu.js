import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";

function UserProfileMenu() {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger>
        <button className="h-[32px] w-[32px]">
          <img className="rounded-full" src="https://lh3.googleusercontent.com/a/ACg8ocLqoP1Ry1bS2-3--afGlto9uzglhr2WPhbEH44xp29J5hVvGwU=s96-c" />
        </button>
      </RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Content className="background-primary border border-color border-color rounded-md w-56 transform -translate-x-4">
        <div>
          <div className="px-2 py-1.5">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Duong Thi Hue Linh</p>
              <p className="text-xs leading-none">k60duongthihuelinh@gmail.com</p>
            </div>
          </div>
          <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-muted"></div>
          <div className="flex items-center px-2 py-1.5">Profile</div>
          <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-muted"></div>
          <div className="flex items-center px-2 py-1.5">Account Setting</div>
          <div className="flex items-center px-2 py-1.5">Switch Space</div>
          <div role="separator" aria-orientation="horizontal" class="-mx-1 my-1 h-px bg-muted"></div>
          <div className="flex items-center px-2 py-1.5">Log Out</div>
        </div>
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Root>
  );
}

export default UserProfileMenu;
