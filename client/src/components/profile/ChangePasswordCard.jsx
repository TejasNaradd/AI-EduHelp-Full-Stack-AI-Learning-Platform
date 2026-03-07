import { useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function ChangePasswordCard() {
  const [form, setForm] = useState({
    oldpassword: "",
    newpassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updatePassword = async () => {
    try {
      await api.patch("/user/update-password", form);
      toast.success("Password updated");
      setForm({ oldpassword: "", newpassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6">
      <h2 className="text-base sm:text-lg font-semibold text-white">Change Password</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="text-xs sm:text-sm text-gray-400">Current Password</label>
          <input
            type="password"
            name="oldpassword"
            value={form.oldpassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 sm:p-2.5 text-sm rounded bg-[#020617] border border-gray-700"
          />
        </div>

        <div>
          <label className="text-xs sm:text-sm text-gray-400">New Password</label>
          <input
            type="password"
            name="newpassword"
            value={form.newpassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 sm:p-2.5 text-sm rounded bg-[#020617] border border-gray-700"
          />
        </div>
      </div>

      <button
        onClick={updatePassword}
        className="w-full sm:w-auto px-5 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors"
      >
        Update Password
      </button>
    </div>
  );
}