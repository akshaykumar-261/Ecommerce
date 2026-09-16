import React, { useEffect, useRef, useState } from "react";
import { Camera, User, Mail, Phone, MapPin } from "lucide-react";
import { useGetUser, useUpdateUser } from "../../api/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function Profile() {
  const { data, isLoading, isError } = useGetUser();
  const navigate = useNavigate();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const user = data?.data;
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLastname(user.lastname || "");
      setEmail(user.email || "");
      setPhoneNo(user.phoneNo || "");
      setAddress(user.address || "");
      setPreview(user.avtar || user.avatar || "");
    }
  }, [user]);
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("phoneNo", phoneNo);
    formData.append("address", address);
    if (avatar) {
      formData.append("avtar", avatar);
    }
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    updateUser(formData, {
      onSuccess: (response) => {
        console.log("User updated successfully:", response);
        toast.success(response?.message || "Profile updated successfully");
        navigate("/vendor/dashboard");
      },
      onError: (error) => {
        console.error("Update error:", error.response?.data);
        toast.error(error.response?.data?.message || "Profile update failed");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
          Failed to load profile.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 lg:p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold text-gray-800">My Profile</h1>

        {/* Profile Image */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#4c2ed8] to-[#368de8] text-3xl font-semibold text-white">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md"
            >
              <Camera size={17} className="text-gray-600" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>

            <div className="relative">
              <User
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Last Name
            </label>

            <div className="relative">
              <User
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Phone Number
            </label>

            <div className="relative">
              <Phone
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Address
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className="absolute left-3 top-3 text-gray-400"
              />

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Update */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-[#4c2ed8] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3f25b8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
