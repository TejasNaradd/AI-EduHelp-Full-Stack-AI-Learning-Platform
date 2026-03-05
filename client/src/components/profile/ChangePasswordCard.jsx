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

      setForm({
        oldpassword: "",
        newpassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl p-6 space-y-6">
      <h2 className="text-lg font-semibold text-white">Change Password</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-400">Current Password</label>

          <input
            type="password"
            name="oldpassword"
            value={form.oldpassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-[#020617] border border-gray-700"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">New Password</label>

          <input
            type="password"
            name="newpassword"
            value={form.newpassword}
            onChange={handleChange}
            className="w-full mt-1 p-2 rounded bg-[#020617] border border-gray-700"
          />
        </div>
      </div>

      <button
        onClick={updatePassword}
        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
      >
        Update Password
      </button>
    </div>
  );
}
