import { useEffect, useRef, useState } from "react";
import { Camera, User, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
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
    updateUser(formData, {
      onSuccess: (response) => {
        toast.success(response?.message || "Profile updated successfully");
        navigate("/vendor/dashboard");
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Profile update failed");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f5f7fb] p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-center text-red-500">Failed to load profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] p-4 lg:p-6">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/vendor/dashboard")}
          className="mb-5 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-gray-900 hover:shadow-sm"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-[#4630d8] via-[#365fe0] to-[#2e8ee8]"></div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar Section */}
            <div className="-mt-16 mb-6 flex items-end gap-5">
              <div className="relative">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-r from-[#4c2ed8] to-[#368de8] text-3xl font-semibold text-white shadow-lg">
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
                  className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#4c2ed8] text-white shadow-md transition hover:bg-[#3f25b8]"
                >
                  <Camera size={15} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-bold text-gray-900">
                  {name || "Your Name"} {lastname}
                </h1>
                <p className="text-sm text-gray-500">{email || "your@email.com"}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    First Name
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
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10"
                      placeholder="Enter first name"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email Address
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
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
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10"
                    placeholder="Enter your address"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/vendor/dashboard")}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl bg-[#4c2ed8] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#3f25b8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Updating...
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
