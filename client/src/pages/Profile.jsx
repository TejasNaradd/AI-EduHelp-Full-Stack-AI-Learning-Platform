import { useState } from "react";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileForm from "../components/profile/ProfileForm";
import ChangePasswordCard from "../components/profile/ChangePasswordCard";

export default function Profile() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => setRefreshKey((k) => k + 1);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-white">
        Profile Settings
      </h1>

      <ProfileHeader key={refreshKey} />

      <ProfileForm onUpdate={handleUpdate} />

      <ChangePasswordCard />
    </div>
  );
}