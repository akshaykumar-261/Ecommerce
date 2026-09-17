import React, { useEffect, useRef, useState } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  Hash,
  Image as ImageIcon,
  FileText,
  Save,
  Trash2,
  AlertTriangle,
  Camera,
  ShieldCheck,
  Link2,
  UploadCloud,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
import { storeSettingsSchema } from "../../validation/venderValidation";
import {
  useGetStore,
  useUpdateStore,
  useDeleteStore,
} from "../../api/useVendorApi";

const tabs = [
  { id: "info", label: "Store Info", icon: Store },
  { id: "contact", label: "Contact & Address", icon: Mail },
  { id: "media", label: "Media", icon: ImageIcon },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle },
];

function StoreSettings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("info");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data: storeData, isLoading, isError } = useGetStore();
  const updateStoreMutation = useUpdateStore();
  const deleteStoreMutation = useDeleteStore();
  const store = storeData?.data?.store;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(storeSettingsSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (store) {
      reset({
        store_name: store.store_name || "",
        description: store.description || "",
        email: store.email || "",
        phoneNo: store.phoneNo || "",
        address: store.address || "",
        city: store.city || "",
        state: store.state || "",
        country: store.country || "",
        zipcode: store.zipcode || "",
      });
    }
  }, [store, reset]);

  useEffect(() => {
    return () => {
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      if (bannerPreview?.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
    };
  }, [logoPreview, bannerPreview]);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
      setLogoPreview(URL.createObjectURL(file));
      setValue("store_logo", file, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      if (bannerPreview?.startsWith("blob:"))
        URL.revokeObjectURL(bannerPreview);
      setBannerPreview(URL.createObjectURL(file));
      setValue("store_banner", file, { shouldValidate: true, shouldDirty: true });
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    if (logoPreview?.startsWith("blob:")) URL.revokeObjectURL(logoPreview);
    setLogoPreview(null);
    setValue("store_logo", undefined, { shouldDirty: true });
  };

  const removeBanner = () => {
    setBannerFile(null);
    if (bannerPreview?.startsWith("blob:")) URL.revokeObjectURL(bannerPreview);
    setBannerPreview(null);
    setValue("store_banner", undefined, { shouldDirty: true });
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("store_name", data.store_name);
    formData.append("description", data.description || "");
    formData.append("email", data.email);
    formData.append("phoneNo", data.phoneNo);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("country", data.country);
    formData.append("zipcode", data.zipcode);
    if (data.store_logo instanceof File) {
      formData.append("store_logo", data.store_logo);
    }
    if (data.store_banner instanceof File) {
      formData.append("store_banner", data.store_banner);
    }

    updateStoreMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Store settings updated successfully");
        setLogoFile(null);
        setBannerFile(null);
        queryClient.invalidateQueries({ queryKey: ["vendor-store"] });
      },
      onError: (error) => {
        const msg =
          error.response?.data?.error || error.response?.data?.message;
        toast.error(msg || "Failed to update store settings");
      },
    });
  };

  const handleDeleteStore = () => {
    deleteStoreMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Store deleted successfully");
        setShowDeleteModal(false);
        navigate("/home");
      },
      onError: (error) => {
        const msg =
          error.response?.data?.error || error.response?.data?.message;
        toast.error(msg || "Failed to delete store");
      },
    });
  };

  const inputBase = `w-full rounded-xl border bg-slate-50/70 px-4 py-2.5 pl-11 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10`;
  const inputCls = (error) =>
    `${inputBase} ${
      error ? "border-red-300 focus:border-red-400 focus:ring-red-500/10" : "border-slate-200"
    }`;
  const textareaCls = (error) =>
    `${inputBase} resize-none ${
      error ? "border-red-300" : "border-slate-200"
    }`;

  const Label = ({ children }) => (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
      {children}
    </label>
  );

  const FieldError = ({ error }) =>
    error && <p className="mt-1 text-xs text-red-500">{error.message}</p>;

  const showHero = !isLoading && !isError && store;

  return (
    <div className="min-h-screen bg-[#f0f2f8]">
      <Sidebar role="vendor" />

      <div className="min-h-screen lg:ml-[270px]">
        <Topbar role="vendor" userName="Vikash Store" />

        <main className="p-5 lg:p-7">
          {/* ================= LOADING ================= */}
          {isLoading && (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
              <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-violet-500 border-t-transparent" />
              <p className="text-sm text-slate-500">Loading store settings...</p>
            </div>
          )}

          {isError && !isLoading && (
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <AlertTriangle size={32} className="mx-auto text-red-400" />
                <p className="mt-3 text-sm text-red-500">
                  Failed to load store settings. Please try again.
                </p>
              </div>
            </div>
          )}

          {showHero && (
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* ================= HERO PROFILE ================= */}
              <div className="relative overflow-hidden rounded-3xl shadow-[0_16px_50px_-12px_rgba(99,102,241,0.35)]">
                {/* Banner */}
                <div className="h-44 w-full sm:h-56">
                  {bannerPreview || store.store_banner ? (
                    <img
                      src={bannerPreview || store.store_banner}
                      alt="Store banner"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-tr from-[#4630d8] via-[#3a55de] to-[#2e8ee8]" />
                  )}
                </div>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />

                {/* Edit banner */}
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/30 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/50"
                >
                  <Camera size={14} />
                  Edit Cover
                </button>

                {/* Banner hidden input */}
                <input
                  type="file"
                  ref={bannerInputRef}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleBannerChange}
                />

                {/* Profile content */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:p-7">
                  <div className="flex items-end gap-4">
                    {/* Logo */}
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white/90 bg-white shadow-xl sm:h-24 sm:w-24"
                    >
                      {logoPreview || store.store_logo ? (
                        <img
                          src={logoPreview || store.store_logo}
                          alt="Store logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500 to-blue-500">
                          <Store size={32} className="text-white/90" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/45 opacity-0 transition group-hover:opacity-100">
                        <Camera size={20} className="text-white" />
                      </div>
                    </button>

                    <div className="pb-0.5">
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-white sm:text-2xl">
                          {store.store_name}
                        </h1>
                        {store.is_verified && (
                          <span className="rounded-full bg-white/15 p-1 backdrop-blur-md">
                            <ShieldCheck size={16} className="text-emerald-300" />
                          </span>
                        )}
                      </div>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-white/75">
                        <Link2 size={13} />
                        shopease.com/@{store.slug}
                      </p>

                      <div className="mt-3 hidden flex-wrap items-center gap-2 sm:flex">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                          <Mail size={12} />
                          {store.email}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                          <Phone size={12} />
                          {store.phoneNo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {store.is_verified && (
                    <div className="ml-auto hidden rounded-2xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md lg:block">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
                        Store Status
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-emerald-300">
                        Verified
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ================= CONTENT ================= */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[230px_1fr]">
                {/* Nav rail */}
                <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-sm lg:sticky lg:top-6 lg:flex-col lg:self-start">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    const danger = tab.id === "danger";
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                          danger
                            ? active
                              ? "bg-red-500 text-white shadow-lg shadow-red-500/25"
                              : "text-slate-500 hover:bg-red-50 hover:text-red-500"
                            : active
                              ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-lg shadow-violet-500/25"
                              : "text-slate-500 hover:bg-violet-50 hover:text-violet-600"
                        }`}
                      >
                        <Icon size={17} />
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Content panel */}
                <div className="min-w-0 rounded-2xl border border-slate-100 bg-white shadow-sm">
                  {/* ========== STORE INFO ========== */}
                  {activeTab === "info" && (
                    <div className="p-6 sm:p-8">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
                          <Store size={20} className="text-violet-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            Store Information
                          </h2>
                          <p className="text-xs text-slate-400">
                            How your store appears to customers
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <Label>Store Name</Label>
                          <div className="relative">
                            <Store
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              type="text"
                              {...register("store_name")}
                              placeholder="Enter your store name"
                              className={inputCls(errors.store_name)}
                            />
                          </div>
                          <FieldError error={errors.store_name} />
                        </div>

                        <div>
                          <Label>Business Email</Label>
                          <div className="relative">
                            <Mail
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              type="email"
                              {...register("email")}
                              placeholder="store@example.com"
                              className={inputCls(errors.email)}
                            />
                          </div>
                          <FieldError error={errors.email} />
                        </div>
                      </div>

                      <div className="mt-5">
                        <Label>Store Description</Label>
                        <div className="relative">
                          <FileText
                            size={17}
                            className="absolute left-4 top-4 text-slate-400"
                          />
                          <textarea
                            rows={4}
                            {...register("description")}
                            placeholder="Write a short description about your store..."
                            className={textareaCls(errors.description)}
                          />
                        </div>
                        <FieldError error={errors.description} />
                        <p className="mt-1 text-right text-[11px] text-slate-400">
                          Optional
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ========== CONTACT & ADDRESS ========== */}
                  {activeTab === "contact" && (
                    <div className="p-6 sm:p-8">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                          <Mail size={20} className="text-emerald-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            Contact & Address
                          </h2>
                          <p className="text-xs text-slate-400">
                            How customers can reach and find you
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                          <Label>Phone Number</Label>
                          <div className="relative">
                            <Phone
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              type="text"
                              {...register("phoneNo")}
                              placeholder="10-digit phone number"
                              className={inputCls(errors.phoneNo)}
                            />
                          </div>
                          <FieldError error={errors.phoneNo} />
                        </div>

                        <div>
                          <Label>Zipcode</Label>
                          <div className="relative">
                            <Hash
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              type="text"
                              {...register("zipcode")}
                              placeholder="Enter zipcode"
                              className={inputCls(errors.zipcode)}
                            />
                          </div>
                          <FieldError error={errors.zipcode} />
                        </div>
                      </div>

                      <div className="my-6 h-px bg-slate-100" />

                      <div>
                        <Label>Street Address</Label>
                        <div className="relative">
                          <MapPin
                            size={17}
                            className="absolute left-4 top-4 text-slate-400"
                          />
                          <textarea
                            rows={2}
                            {...register("address")}
                            placeholder="Enter complete business address"
                            className={textareaCls(errors.address)}
                          />
                        </div>
                        <FieldError error={errors.address} />
                      </div>

                      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                        <div>
                          <Label>City</Label>
                          <div className="relative">
                            <Building2
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              type="text"
                              {...register("city")}
                              placeholder="City"
                              className={inputCls(errors.city)}
                            />
                          </div>
                          <FieldError error={errors.city} />
                        </div>

                        <div>
                          <Label>State</Label>
                          <div className="relative">
                            <MapPin
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              type="text"
                              {...register("state")}
                              placeholder="State"
                              className={inputCls(errors.state)}
                            />
                          </div>
                          <FieldError error={errors.state} />
                        </div>

                        <div>
                          <Label>Country</Label>
                          <div className="relative">
                            <Globe
                              size={17}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                              type="text"
                              {...register("country")}
                              placeholder="Country"
                              className={inputCls(errors.country)}
                            />
                          </div>
                          <FieldError error={errors.country} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========== MEDIA ========== */}
                  {activeTab === "media" && (
                    <div className="p-6 sm:p-8">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50">
                          <ImageIcon size={20} className="text-sky-600" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            Store Media
                          </h2>
                          <p className="text-xs text-slate-400">
                            Your logo and cover banner across ShopEase
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Logo */}
                        <div>
                          <Label>Store Logo</Label>
                          {logoPreview || (logoFile === null && store.store_logo) ? (
                            <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                              <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-white shadow-md">
                                <img
                                  src={logoPreview || store.store_logo}
                                  alt="Store logo"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => logoInputRef.current?.click()}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3.5 py-2 text-xs font-semibold text-violet-600 transition hover:bg-violet-100"
                                >
                                  <UploadCloud size={14} />
                                  Change
                                </button>
                                <button
                                  type="button"
                                  onClick={removeLogo}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                >
                                  <X size={14} />
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => logoInputRef.current?.click()}
                              className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-violet-400 hover:bg-violet-50/40"
                            >
                              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <ImageIcon size={24} className="text-violet-500" />
                              </div>
                              <p className="text-sm font-semibold text-slate-700">
                                Upload Store Logo
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                PNG, JPG or WEBP · Square
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            ref={logoInputRef}
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                          <FieldError error={errors.store_logo} />
                        </div>

                        {/* Banner */}
                        <div>
                          <Label>Cover Banner</Label>
                          {bannerPreview ||
                          (bannerFile === null && store.store_banner) ? (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                              <div className="h-24 w-full overflow-hidden rounded-xl">
                                <img
                                  src={bannerPreview || store.store_banner}
                                  alt="Store banner"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="mt-4 flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => bannerInputRef.current?.click()}
                                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3.5 py-2 text-xs font-semibold text-violet-600 transition hover:bg-violet-100"
                                >
                                  <UploadCloud size={14} />
                                  Change
                                </button>
                                <button
                                  type="button"
                                  onClick={removeBanner}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                                >
                                  <X size={14} />
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              onClick={() => bannerInputRef.current?.click()}
                              className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center transition hover:border-violet-400 hover:bg-violet-50/40"
                            >
                              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                                <ImageIcon size={24} className="text-violet-500" />
                              </div>
                              <p className="text-sm font-semibold text-slate-700">
                                Upload Cover Banner
                              </p>
                              <p className="mt-1 text-xs text-slate-400">
                                PNG, JPG or WEBP · 1200x300
                              </p>
                            </div>
                          )}
                          <input
                            type="file"
                            ref={bannerInputRef}
                            accept="image/png,image/jpeg,image/webp"
                            className="hidden"
                            onChange={handleBannerChange}
                          />
                          <FieldError error={errors.store_banner} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ========== DANGER ZONE ========== */}
                  {activeTab === "danger" && (
                    <div className="p-6 sm:p-8">
                      <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
                          <AlertTriangle size={20} className="text-red-500" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-slate-900">
                            Danger Zone
                          </h2>
                          <p className="text-xs text-slate-400">
                            Irreversible actions for your store
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
                            <Trash2 size={18} className="text-red-500" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              Delete this store
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                              Remove your store, products and all associated data
                              permanently. This cannot be undone.
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowDeleteModal(true)}
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-600"
                        >
                          <Trash2 size={15} />
                          Delete Store
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ========== SAVE BAR ========== */}
                  {activeTab !== "danger" && (
                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                      {isDirty ? (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
                          <span className="h-2 w-2 rounded-full bg-amber-500" />
                          You have unsaved changes
                        </p>
                      ) : (
                        <p className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          All changes saved
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={updateStoreMutation.isPending}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-7 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Save size={16} />
                        {updateStoreMutation.isPending
                          ? "SAVING..."
                          : "SAVE CHANGES"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}
        </main>
      </div>

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/60">
              <Trash2 size={28} className="text-red-500" />
            </div>

            <h3 className="text-center text-lg font-semibold text-slate-900">
              Delete Store
            </h3>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {store?.store_name}
              </span>
              ? Your store, products and all associated data will be
              permanently removed. This action cannot be undone.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteStore}
                disabled={deleteStoreMutation.isPending}
                className="rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteStoreMutation.isPending
                  ? "Deleting..."
                  : "Yes, Delete Store"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoreSettings;