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
    <div className="bg-[#0f172a] border border-gray-800 rounded-xl px-8 py-7 flex items-center gap-6">

      {/* Avatar */}

      <div className="w-28 h-28 rounded-lg overflow-hidden border border-gray-700">
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

      <div className="flex flex-col gap-2 text-base">

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