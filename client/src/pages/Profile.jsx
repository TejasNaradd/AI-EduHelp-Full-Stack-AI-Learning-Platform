import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileForm from "../components/profile/ProfileForm";
import ChangePasswordCard from "../components/profile/ChangePasswordCard";

export default function Profile() {

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">

      <h1 className="text-2xl font-semibold text-white">
        Profile Settings
      </h1>

      <ProfileHeader />

      <ProfileForm />

      <ChangePasswordCard />

    </div>
  );

}