import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng
import banner5 from "~/assets/images/landingpage/img5.png";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3002/auth/login/local", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      const { access_token, refresh_token } = data.access_token ? data : data.data;

      console.log("Access Token:", access_token);
      console.log("Refresh Token:", refresh_token);

      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại!");
      }
      alert("Dang nhap thanh cong")

      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      navigate("/boarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="background-primary min-h-screen relative">
        <div className="grid min-h-screen">
          <a href="/register" className="text-[17px] absolute right-4 top-6 px-4 py-2 hover:bg-accent cursor-pointer">
            Create account
          </a>
          <div className="flex w-full justify-center items-center gap-3">
            <div className="flex-1 container">
              <h2 className="text-[40px] font-bold mb-3">All New Workloads</h2>
              <p className="text-muted-foreground text-[16px] mb-4">
                Our all-new Workloads screen brings enhanced control and flexibility to help manage your team’s workload and resource capacity more effectively.
              </p>
              <img src={banner5} alt="Banner" />
            </div>
            <div className="flex flex-1 w-full flex-col container gap-4 space-y-6">
              <div className="flex flex-col text-center space-y-2">
                <h1 className="text-2xl font-bold">Login to WorkHub</h1>
                <p className="text-muted-foreground text-sm">
                  Login to manage connected extension and explore a lot of social network utilities...
                </p>
              </div>
              <div>
                <button className="w-full border border-color px-3 py-3 text-[14px] font-medium rounded-md inline-flex justify-center items-center">
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-6 w-6">
                    <path
                        fill="currentColor"
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    ></path>
                  </svg>
                  Continue with Google
                </button>
              </div>
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
                <div className="grid gap-4">
                  {/* Email */}
                  <div className="grid gap-1 space-y-2">
                    <label className="text-[16px] font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="px-3 py-2 background-primary border border-color placeholder:text-[15px] rounded-md"
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
                        className="px-3 py-2 background-primary border border-color placeholder:text-[15px] rounded-md"
                        placeholder="Password"
                        required
                    />
                  </div>
                  {/* Forgot Password */}
                  <div>
                    <button className="text-[12px] border border-color w-full h-full px-3 py-3 rounded-md">
                      Forgot your password?
                    </button>
                  </div>
                  {/* Submit Button */}
                  <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                      {loading ? "Logging in..." : "Sign in"}
                    </button>
                  </div>
                  {/* Hiển thị lỗi */}
                  {error && <p className="text-red-500 text-center">{error}</p>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default LoginForm;
