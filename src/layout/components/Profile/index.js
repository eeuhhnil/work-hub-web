function Profile() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl  p-6 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Preferences</h2>
          <p className="text-muted-foreground">Manage your account settings and set e-mail preferences.</p>
        </div>

        <div className="mt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold">Profile</h3>
            <p className="text-muted-foreground">This is how others will see you on this site</p>
          </div>

          <div className="flex flex-col items-center mt-4">
            <span className="w-24 h-24">
              <img src="https://lh3.googleusercontent.com/a/ACg8ocLqoP1Ry1bS2-3--afGlto9uzglhr2WPhbEH44xp29J5hVvGwU=s96-c" className="w-full h-full rounded-full object-cover" />
            </span>
            <div className="mt-2">
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
                className="text-muted-foreground"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
            </div>
          </div>

          <form className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Full Name</label>
              <input className="w-full mt-1 p-2 border border-color bg-transparent rounded-md" />
              <p className="text-xs text-muted-foreground">This is your public display name. It can be your real name or a pseudonym. You can only change this once every 30 days.</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <input className="w-full mt-1 p-2 border border-color bg-transparent rounded-md" />
              <p className="text-xs text-muted-foreground">This is your email address..</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Bio</label>
              <input className="w-full mt-1 p-2 border border-color bg-transparent rounded-md" />
              <p className="text-xs text-muted-foreground">Describe yourself...</p>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Password</label>
              <input className="w-full mt-1 p-2 border border-color bg-transparent rounded-md" />
              <p className="text-xs text-muted-foreground">You can only change this once every 30 days.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
