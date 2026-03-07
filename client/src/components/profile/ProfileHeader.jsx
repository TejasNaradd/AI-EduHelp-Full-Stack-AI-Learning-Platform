import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ProfileHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/user/me");
      setUser(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl px-4 sm:px-8 py-5 sm:py-7 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">

      {/* Avatar */}
      <div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden border border-gray-700">
        <img
          src={
            user.profileImage?.url ||
            `https://ui-avatars.com/api/?name=${user.fullname}`
          }
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5 sm:gap-2 text-sm sm:text-base text-center sm:text-left">
        <p>
          <span className="text-gray-400 font-medium">Username :</span>{" "}
          <span className="text-white font-semibold">{user.username}</span>
        </p>
        <p>
          <span className="text-gray-400 font-medium">Full Name :</span>{" "}
          <span className="text-white font-semibold">{user.fullname}</span>
        </p>
        <p>
          <span className="text-gray-400 font-medium">Email :</span>{" "}
          <span className="text-white font-semibold">{user.email}</span>
        </p>
      </div>

    </div>
  );
}