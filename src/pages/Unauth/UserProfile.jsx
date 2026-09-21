import { useEffect, useRef, useState } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  ArrowLeft,
  Save,
  Shield,
  CheckCircle2,
  Pencil,
  Package,
  Heart,
  LogOut,
  Settings,
} from "lucide-react";
import { useGetUser, useUpdateUser, useLogout } from "../../api/useAuth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const { data, isLoading, isError } = useGetUser();
  const navigate = useNavigate();
  const { mutate: updateUser, isPending } = useUpdateUser();
  const logoutMutation = useLogout();
  const user = data?.data;
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

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
        setIsEditing(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Profile update failed");
      },
    });
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSettled: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/home", { replace: true });
      },
    });
  };

  const filledFields = [name, lastname, email, phoneNo, address].filter(
    Boolean
  ).length;
  const completionPercent = Math.round((filledFields / 5) * 100);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent"></div>
            <p className="text-sm text-gray-500">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f8f9fc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-center text-red-500">Failed to load profile.</p>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc]">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            Back
          </button>
          <h1 className="text-lg font-bold text-gray-900">My Profile</h1>
          <div className="w-[80px]"></div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Profile Header Card */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          {/* Cover Banner */}
          <div className="relative h-36 bg-gradient-to-r from-[#4630d8] via-[#365fe0] to-[#2e8ee8] sm:h-44">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDJ2Mmgydi0yek0yNiAyNGgtMnYyaDJ2LTJ6bTAgNGgtMnY0aDJ2LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6 sm:px-8">
            <div className="-mt-14 mb-4 flex flex-col items-center gap-4 sm:-mt-16 sm:flex-row sm:items-end">
              {/* Avatar */}
              <div className="relative group">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-[#4c2ed8] to-[#2e8ee8] text-4xl font-bold text-white shadow-xl transition-transform duration-300 group-hover:scale-[1.02] sm:h-32 sm:w-32">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="select-none">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#4c2ed8] text-white shadow-lg transition-all hover:bg-[#3f25b8] hover:scale-110"
                >
                  <Camera size={16} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="text-center sm:mb-1 sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {name || "Your"} {lastname || "Name"}
                </h1>
                <p className="text-sm text-gray-500">
                  {email || "your@email.com"}
                </p>
              </div>
            </div>

            {/* Completion Bar */}
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  Profile Completion
                </span>
                <span className="text-xs font-bold text-[#4c2ed8]">
                  {completionPercent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#4c2ed8] to-[#2e8ee8] transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto rounded-xl bg-white p-1.5 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#4c2ed8] text-white shadow-md shadow-[#4c2ed8]/25"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left Column - Quick Info Cards */}
            <div className="space-y-6">
              {/* Personal Info Card */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">
                    Personal Info
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[#4c2ed8] transition hover:bg-[#4c2ed8]/5"
                  >
                    <Pencil size={13} />
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4c2ed8]/10">
                      <User size={18} className="text-[#4c2ed8]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Full Name
                      </p>
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {name} {lastname || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                      <Mail size={18} className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Email
                      </p>
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {email || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50">
                      <Phone size={18} className="text-purple-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Phone
                      </p>
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {phoneNo || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50">
                      <MapPin size={18} className="text-amber-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Address
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {address || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Card */}
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-gray-900">
                  Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl bg-[#4c2ed8]/10 p-3">
                    <Shield size={18} className="text-[#4c2ed8]" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">
                        Account Verified
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Your account is secure
                      </p>
                    </div>
                    <CheckCircle2
                      size={16}
                      className="ml-auto text-[#4c2ed8]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Edit Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">
                    Edit Profile
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your personal information and settings
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* First Name */}
                    <div className="group">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                        First Name
                      </label>
                      <div className="relative">
                        <User
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#4c2ed8]"
                        />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={!isEditing}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10 disabled:cursor-not-allowed disabled:opacity-70"
                          placeholder="Enter first name"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="group">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                        Last Name
                      </label>
                      <div className="relative">
                        <User
                          size={17}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#4c2ed8]"
                        />
                        <input
                          type="text"
                          value={lastname}
                          onChange={(e) => setLastname(e.target.value)}
                          disabled={!isEditing}
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10 disabled:cursor-not-allowed disabled:opacity-70"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#4c2ed8]"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10 disabled:cursor-not-allowed disabled:opacity-70"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#4c2ed8]"
                      />
                      <input
                        type="text"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        disabled={!isEditing}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10 disabled:cursor-not-allowed disabled:opacity-70"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="group">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin
                        size={17}
                        className="absolute left-3.5 top-3.5 text-gray-400 transition-colors group-focus-within:text-[#4c2ed8]"
                      />
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-800 outline-none transition-all focus:border-[#4c2ed8] focus:bg-white focus:ring-2 focus:ring-[#4c2ed8]/10 disabled:cursor-not-allowed disabled:opacity-70"
                        placeholder="Enter your address"
                      />
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={isPending || !isEditing}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4c2ed8] to-[#365fe0] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#4c2ed8]/25 transition-all hover:from-[#3f25b8] hover:to-[#2d50c8] hover:shadow-xl hover:shadow-[#4c2ed8]/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                    >
                      {isPending ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Quick Links */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-900">
                Quick Links
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/orders")}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <Package size={18} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      My Orders
                    </p>
                    <p className="text-xs text-gray-500">
                      View and track your orders
                    </p>
                  </div>
                </button>
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-gray-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50">
                    <Heart size={18} className="text-rose-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Wishlist
                    </p>
                    <p className="text-xs text-gray-500">
                      Your saved products
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Account */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-900">Account</h3>
              <div className="space-y-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-red-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                    <LogOut size={18} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-600">
                      Logout
                    </p>
                    <p className="text-xs text-gray-500">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserProfile;
