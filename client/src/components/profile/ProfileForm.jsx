import { useState, useEffect } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function ProfileForm() {
  const [avatar, setAvatar] = useState(null);

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await api.get("/user/me");
    const data = res.data.data;
    setForm({
      fullname: data.fullname || "",
      username: data.username || "",
      email: data.email || "",
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setAvatar(e.target.files[0]);
  };

  const updateProfile = async () => {
    try {
      const data = new FormData();
      data.append("fullname", form.fullname);
      data.append("email", form.email);
      if (avatar) data.append("profileImage", avatar);

      await api.patch("/user/update-profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Profile updated");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-base sm:text-lg font-semibold text-white">Edit Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="text-xs sm:text-sm text-gray-400">Full Name</label>
          <input
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className="w-full mt-1 p-2 sm:p-2.5 text-sm rounded bg-[#020617] border border-gray-700"
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm text-gray-400">Username</label>
          <input
            value={form.username}
            disabled
            className="w-full mt-1 p-2 sm:p-2.5 text-sm rounded bg-[#020617] border border-gray-700 opacity-70"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs sm:text-sm text-gray-400">Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full mt-1 p-2 sm:p-2.5 text-sm rounded bg-[#020617] border border-gray-700"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs sm:text-sm text-gray-400">Profile Image</label>
          <input
            type="file"
            onChange={handleFile}
            className="w-full mt-1 text-xs sm:text-sm text-gray-400"
          />
        </div>
      </div>

      <button
        onClick={updateProfile}
        className="w-full sm:w-auto px-5 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors"
      >
        Save Changes
      </button>
    </div>
  );
}