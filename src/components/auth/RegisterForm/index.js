import { useState } from "react";
import banner5 from "~/assets/images/landingpage/img5.png";
import {useNavigate} from "react-router-dom";
import { apiRequest } from "~/config/api";
import API_CONFIG from "~/config/api";

function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setSuccess("Registration successful!");
      setTimeout(()=>{
        navigate("/login");
      }, 2000)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="background-primary min-h-screen relative">
        <div className="grid min-h-screen">
          <a href="/login" className="text-[17px] absolute right-4 top-6 px-4 py-2 hover:bg-accent cursor-pointer">
            Login
          </a>
          <div className="flex w-full justify-center items-center gap-3">
            <div className="flex-1 container border-r">
              <h2 className="text-[40px] font-bold mb-3">All New Workloads</h2>
              <p className="text-muted-foreground text-[16px] mb-4">
                Our all-new Workloads screen brings enhanced control and flexibility to help manage your team’s workload and resource capacity more effectively.
              </p>
              <img src={banner5} alt="Banner" />
            </div>
            <div className="flex flex-1 w-full flex-col container gap-4 space-y-6">
              <div className="flex flex-col text-center space-y-2">
                <h1 className="text-2xl font-bold">Create Account</h1>
                <p className="text-muted-foreground text-sm">
                  Stable helps you connect people moving in the same direction...
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                <div className="grid gap-4">
                  {/* Full Name */}
                  <div className="grid gap-1 space-y-2">
                    <label className="text-[16px] font-medium">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="px-3 py-2 border border-color background-primary placeholder:text-[15px] rounded-md"
                        placeholder="Full Name"
                        required
                    />
                  </div>
                  {/* Email */}
                  <div className="grid gap-1 space-y-2">
                    <label className="text-[16px] font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="px-3 py-2 border border-color background-primary placeholder:text-[15px] rounded-md"
                        placeholder="Email"
                        required
                    />
                  </div>
                  {/* Password */}
                  <div className="grid gap-1 space-y-2">
                    <label className="text-[16px]">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="px-3 py-2 border border-color background-primary placeholder:text-[15px] rounded-md"
                        placeholder="Password"
                        required
                    />
                  </div>
                  {/* Submit Button */}
                  <div>
                    <button
                        type="submit"
                        className="text-[14px] bg-blue-600 text-white w-full h-full px-3 py-3 rounded-md hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                      {loading ? "Processing..." : "Create Account"}
                    </button>
                  </div>
                  {/* Login Alternative */}
                  <div className="bg-white text-[14px] text-black border border-color w-full h-full px-3 py-3 rounded-md text-center">
                    Sign in with Email
                  </div>
                  {error && <p className="text-red-500 text-center">{error}</p>}
                  {success && <p className="text-green-500 text-center">{success}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default RegisterForm;
