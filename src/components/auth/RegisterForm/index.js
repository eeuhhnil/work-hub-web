import banner5 from "~/assets/images/landingpage/img5.png";

function RegiterForm() {
  return (
    <div className="background-primary min-h-screen relative">
      <div className=" grid min-h-screen">
        <a href="login" className=" text-[17px] absolute right-4 top-6 px-4 py-2 hover:bg-accent cursor-pointer">
          Login
        </a>
        <div className=" flex w-full justify-center items-center gap-3">
          <div className="flex-1 container border-r">
            <h2 className="text-[40px] font-bold mb-3"> All New Workloads</h2>
            <p className="text-muted-foreground text-[16px] mb-4">
              Our all-new Workloads screen brings enhanced control and flexibility to help manage your team’s workload and resource capacity more effectively.
            </p>
            <img src={banner5} />
          </div>
          <div className="flex flex-1 w-full flex-col container gap-4 space-y-6">
            <div className="flex flex-col text-center space-y-2">
              <h1 className="text-2xl font-bold">Create account </h1>
              <p className="text-muted-foreground text-sm">Stable helps you connect people moving on a same direction...</p>
            </div>
            <form className="flex-1 flex flex-col gap-4">
              <div className="grid gap-4">
                <div className="grid gap-1 space-y-2">
                  <label className=" text-[16px] font-medium">Full Name</label>
                  <input className="px-3 py-2  border border-color  background-primary placeholder: text-[15px] rounded-md" placeholder="Full Name" />
                </div>
                <div className="grid gap-1 space-y-2">
                  <label className=" text-[16px] font-medium">Email</label>
                  <input className="px-3 py-2  border  border-color  background-primary placeholder: text-[15px] rounded-md" placeholder="Email" />
                </div>
                <div className="grid gap-1 space-y-2">
                  <label className=" text-[16px]">Password</label>
                  <input className="px-3 py-2  border  border-color  background-primary placeholder: text-[15px] rounded-md" placeholder="Passowrd" />
                </div>
                <div>
                  <button className=" text-[12px] border  border-color  background-primary w-full h-full px-3 py-3 rounded-md ">Create account</button>
                </div>
                <div className="bg-white text-[12px] text-black border  border-color  w-full h-full px-3 py-3 rounded-md text-center">Sign in with Email</div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegiterForm;
