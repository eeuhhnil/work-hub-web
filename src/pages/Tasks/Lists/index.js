import * as Dialog from "@radix-ui/react-dialog";

function TaskList() {
  return (
    <div>
      <div class="flex flex-col h-full min-h-0">
        <div class="p-4">
          <div class="mb-6">
            <h1 class="font-bold text-xl">Task list</h1>
            <p class="text-sm text-muted-foreground">List of tasks in project</p>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex items-center bg-muted rounded-full h-8">
                <button
                  class="flex items-center px-3 py-0 text-sm font-medium transition-colors rounded-full hover:bg-accent hover:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring"
                  type="button"
                  aria-haspopup="dialog"
                >
                  <svg class="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                  Filter
                </button>
                <div class="h-full border-l"></div>
                <div class="relative flex items-center">
                  <input
                    class="w-20 h-8 px-3 text-sm bg-transparent border-none transition-all duration-300 rounded-md placeholder:text-muted-foreground focus:w-40 focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Search..."
                  />
                  <div class="absolute right-2">
                    <svg class="w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.3-4.3"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div class="flex items-center bg-secondary rounded-full p-1">
                <span class="w-6 h-6 overflow-hidden rounded-full">
                  <img src="https://lh3.googleusercontent.com/a/ACg8ocLqoP1Ry1bS2-3--afGlto9uzglhr2WPhbEH44xp29J5hVvGwU=s96-c" alt="User" />
                </span>
                <span class="hidden px-2 text-sm cursor-pointer group-hover:flex">Set to me</span>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button class="flex items-center px-4 py-2 text-xs font-medium bg-muted rounded-full transition-colors hover:bg-accent hover:text-accent-foreground" type="button">
                <svg class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M8 2v4"></path>
                  <path d="M16 2v4"></path>
                  <rect x="3" y="4" width="18" height="18" rx="2"></rect>
                  <path d="M3 10h18"></path>
                  <path d="m9 16 2 2 4-4"></path>
                </svg>
                Jan 21, 2025 - Jan 21, 2025
              </button>
              <Dialog.Root>
                <Dialog.Trigger className="flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-full transition-colors hover:bg-primary/90">
                  <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="currentColor">
                    <path d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" />
                  </svg>
                  Create Task
                </Dialog.Trigger>

                {/* Dialog chứa form tạo task */}
                <Dialog.Portal>
                  <Dialog.Overlay className="dialog-overlay fixed inset-0 bg-black bg-opacity-50" />
                  <Dialog.Content className="w-full max-w-lg dialog-content fixed border border-color rounded-md shadow-lg p-6 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <Dialog.Title className="mb-2 text-lg font-semibold">Create Task</Dialog.Title>
                    <Dialog.Description className="mb-4 text-sm text-muted-foreground">Enter the details to create a new task.</Dialog.Description>

                    <form className="space-y-4">
                      <div className="mb-4">
                        <label htmlFor="taskTitle" className="block text-sm font-medium text-muted-foreground">
                          Title
                        </label>
                        <input id="taskTitle" className="w-full mt-1 px-3 py-2 border border-color bg-transparent rounded-md" type="text" placeholder="Task title" />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="taskDescription" className="block text-sm font-medium text-muted-foreground">
                          Description
                        </label>
                        <textarea id="taskDescription" className="w-full mt-1 px-3 py-2 border border-color bg-transparent rounded-md" placeholder="Task description" rows="4" />
                      </div>
                      <div className="flex justify-between">
                        <Dialog.Close asChild>
                          <button type="button" className="px-4 py-2 bg-gray-200 text-sm text-primary-foreground rounded-md">
                            Cancel
                          </button>
                        </Dialog.Close>
                        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md">
                          Create
                        </button>
                      </div>
                    </form>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>

          <div class="flex flex-col flex-1 overflow-y-auto">
            <table class="w-full text-sm">
              <thead class="sticky top-0 bg-background z-[20]">
                <tr class="border-b border-color">
                  <th class="px-2 py-3 text-left font-medium text-muted-foreground">Title</th>
                  <th class="px-2 py-3 text-left font-medium text-muted-foreground">Labels</th>
                  <th class="px-2 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th class="px-2 py-3 text-left font-medium text-muted-foreground">Assignees</th>
                  <th class="px-2 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                  <th class="px-2 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="6" class="p-2 text-center text-muted-foreground">
                    No results.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskList;
