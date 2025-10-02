import { useState, useEffect } from "react";
import { apiRequest, buildApiUrl } from "~/config/api";
import API_CONFIG from "~/config/api";

function Profile() {
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await apiRequest(API_CONFIG.ENDPOINTS.USERS.PROFILE, {
          method: "GET",
        });

        setUser({
          fullName: data.data.fullName,
          email: data.data.email,
          username: data.data.username,
          avatar: data.data.avatar,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // ✅ Xử lý chọn ảnh mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Hiển thị ảnh mới ngay trên giao diện
      const imageUrl = URL.createObjectURL(file);
      setUser((prevUser) => ({ ...prevUser, avatar: imageUrl }));
    }
  };

  // ✅ Xử lý cập nhật profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setError("");

    try {
      const token = localStorage.getItem("access_token");

      // Tạo FormData để gửi `multipart/form-data`
      const formData = new FormData();
      formData.append("fullName", user.fullName);
      formData.append("username", user.username);
      if (user.password) formData.append("password", user.password); // ✅ Nếu có thay đổi mật khẩu
      if (selectedFile) formData.append("file", selectedFile); // ✅ Nếu có ảnh mới

      // Gửi yêu cầu cập nhật profile using fetch (because we need FormData support)
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USERS.PROFILE), {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // ✅ Gửi dưới dạng `multipart/form-data`
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setSuccessMessage("Profile updated successfully!");
      setUser((prevUser) => ({
        ...prevUser,
        avatar: selectedFile ? URL.createObjectURL(selectedFile) : prevUser.avatar,
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl p-6 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Preferences</h2>
            <p className="text-muted-foreground">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>

          {loading ? (
              <p className="text-center text-gray-400">Loading...</p>
          ) : error ? (
              <p className="text-center text-red-500">{error}</p>
          ) : (
              <form className="mt-6 space-y-4" onSubmit={handleUpdateProfile} encType="multipart/form-data">
                <div className="text-center">
                  <h3 className="text-xl font-semibold">Profile</h3>
                  <p className="text-muted-foreground">
                    This is how others will see you on this site
                  </p>
                </div>

                {/* Avatar & Upload */}
                <div className="relative flex flex-col items-center mt-4">
                  <img
                      className="rounded-full object-cover w-24 h-24"
                      src={user?.avatar || "https://via.placeholder.com/150"}
                      alt="User Avatar"
                  />
                  {/* SVG máy ảnh */}
                  <label
                      htmlFor="fileInput"
                      className="bg-gray-800 p-2 rounded-full cursor-pointer"
                  >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                      <circle cx="12" cy="13" r="3"></circle>
                    </svg>
                  </label>
                  {/* Input file */}
                  <input
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Full Name</label>
                  <input
                      name="fullName"
                      value={user.fullName}
                      onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                      className="w-full mt-1 p-2 border border-color bg-transparent rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Username</label>
                  <input
                      name="username"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                      className="w-full mt-1 p-2 border border-color bg-transparent rounded-md"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Email</label>
                  <input
                      name="email"
                      value={user.email}
                      disabled
                      className="w-full mt-1 p-2 border border-color bg-transparent rounded-md cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Password (Optional)</label>
                  <input
                      type="password"
                      name="password"
                      onChange={(e) => setUser({ ...user, password: e.target.value })}
                      className="w-full mt-1 p-2 border border-color bg-transparent rounded-md"
                      placeholder="Enter new password"
                  />
                </div>

                {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
                >
                  Update Profile
                </button>
              </form>
          )}
        </div>
      </div>
  );
}

export default Profile;
