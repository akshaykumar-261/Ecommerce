import React, { useRef } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  Hash,
  Image,
  FileText,
} from "lucide-react";
import { businessDetailsSchema } from "../../validation/venderValidation";
import { useCreateStore } from "../../api/useVendorApi";
import Button from "../../components/common/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
function BusinessDetails() {
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);
  const createStoreMutation = useCreateStore();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessDetailsSchema),
    mode: "onSubmit",
  });
  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("store_name", data.store_name);
    formData.append("description", data.description);
    formData.append("email", data.email);
    formData.append("phoneNo", data.phoneNo);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("country", data.country);
    formData.append("zipcode", data.zipcode);
    // Logo
    if (data.store_logo instanceof File) {
      formData.append("store_logo", data.store_logo);
    }
    // Banner
    if (data.store_banner instanceof File) {
      formData.append("store_banner", data.store_banner);
    }
    createStoreMutation.mutate(formData);
    reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">Business Details</h1>

          <p className="text-sm text-gray-500 mt-1">
            Add your store information to complete your business profile.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-gray-100 shadow-[0_6px_24px_rgba(139,92,246,0.16)] p-5 md:p-7"
        >
          {/* ================= STORE INFORMATION ================= */}
          <div className="mb-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Store size={20} className="text-violet-600" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Store Information
                </h2>

                <p className="text-xs text-gray-500">
                  Tell customers about your store
                </p>
              </div>
            </div>

            {/* STORE NAME */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Store Name
              </label>

              <div className="relative">
                <Store
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  {...register("store_name")}
                  placeholder="Enter your store name"
                  className={`w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.10)] focus:border-violet-500 ${
                    errors.store_name ? "border-red-400" : "border-violet-200"
                  }`}
                />
              </div>

              {errors.store_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.store_name.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Store Description
              </label>

              <div className="relative">
                <FileText
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />

                <textarea
                  rows={4}
                  {...register("description")}
                  placeholder="Write a short description about your store..."
                  className={`w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none resize-none bg-white shadow-[0_2px_8px_rgba(139,92,246,0.10)] focus:border-violet-500 ${
                    errors.description ? "border-red-400" : "border-violet-200"
                  }`}
                />
              </div>

              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* ================= STORE MEDIA ================= */}
          <div className="border-t border-gray-100 pt-6 mb-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Image size={20} className="text-violet-600" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Store Media
                </h2>

                <p className="text-xs text-gray-500">
                  Add your store logo and banner
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* STORE LOGO */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Store Logo
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-violet-400 transition ${
                    errors.store_logo ? "border-red-400" : "border-violet-200"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-violet-50 flex items-center justify-center mb-3">
                    <Image size={23} className="text-violet-500" />
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    Upload Store Logo
                  </p>

                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP</p>

                  {/* HIDDEN FILE INPUT */}
                  <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setValue("store_logo", file, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    }}
                  />

                  {/* CHOOSE IMAGE */}
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-xs font-medium hover:bg-violet-100 transition"
                  >
                    Choose Image
                  </button>
                </div>

                {errors.store_logo && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.store_logo.message}
                  </p>
                )}
              </div>

              {/* STORE BANNER */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Store Banner
                </label>

                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center hover:border-violet-400 transition ${
                    errors.store_banner ? "border-red-400" : "border-violet-200"
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-violet-50 flex items-center justify-center mb-3">
                    <Image size={23} className="text-violet-500" />
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    Upload Store Banner
                  </p>

                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP</p>

                  {/* HIDDEN FILE INPUT */}
                  <input
                    type="file"
                    ref={bannerInputRef}
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];

                      if (file) {
                        setValue("store_banner", file, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    }}
                  />

                  {/* CHOOSE IMAGE */}
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-xs font-medium hover:bg-violet-100 transition"
                  >
                    Choose Image
                  </button>
                </div>

                {errors.store_banner && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.store_banner.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= CONTACT INFORMATION ================= */}
          <div className="border-t border-gray-100 pt-6 mb-7">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <Mail size={20} className="text-violet-600" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Contact Information
                </h2>

                <p className="text-xs text-gray-500">
                  Business contact details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* EMAIL */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Business Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="email"
                    {...register("email")}
                    placeholder="store@example.com"
                    className={`w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500 ${
                      errors.email ? "border-red-400" : "border-violet-200"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    {...register("phoneNo")}
                    placeholder="Enter phone number"
                    className={`w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500 ${
                      errors.phoneNo ? "border-red-400" : "border-violet-200"
                    }`}
                  />
                </div>

                {errors.phoneNo && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.phoneNo.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= STORE ADDRESS ================= */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <MapPin size={20} className="text-violet-600" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Store Address
                </h2>

                <p className="text-xs text-gray-500">
                  Enter your complete business location
                </p>
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Address
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />

                <textarea
                  {...register("address")}
                  rows={2}
                  placeholder="Enter complete business address"
                  className={`w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none resize-none focus:border-violet-500 ${
                    errors.address ? "border-red-400" : "border-violet-200"
                  }`}
                />
              </div>

              {errors.address && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* CITY + STATE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* CITY */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  City
                </label>

                <div className="relative">
                  <Building2
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    {...register("city")}
                    placeholder="Enter city"
                    className={`w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500 ${
                      errors.city ? "border-red-400" : "border-violet-200"
                    }`}
                  />
                </div>

                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              {/* STATE */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  State
                </label>

                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    {...register("state")}
                    placeholder="Enter state"
                    className={`w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500 ${
                      errors.state ? "border-red-400" : "border-violet-200"
                    }`}
                  />
                </div>

                {errors.state && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* COUNTRY + ZIPCODE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* COUNTRY */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Country
                </label>

                <div className="relative">
                  <Globe
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    {...register("country")}
                    placeholder="Enter country"
                    className={`w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500 ${
                      errors.country ? "border-red-400" : "border-violet-200"
                    }`}
                  />
                </div>

                {errors.country && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* ZIPCODE */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Zipcode
                </label>

                <div className="relative">
                  <Hash
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    {...register("zipcode")}
                    placeholder="Enter zipcode"
                    className={`w-full border rounded-lg py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-500 ${
                      errors.zipcode ? "border-red-400" : "border-violet-200"
                    }`}
                  />
                </div>

                {errors.zipcode && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.zipcode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ================= BUTTON ================= */}
          <div className="border-t border-gray-100 mt-7 pt-5 flex justify-end">
            <Button
              type="submit"
              disabled={createStoreMutation.isPending}
              className="px-8 py-2.5 text-sm"
            >
              {createStoreMutation.isPending
                ? "SAVING..."
                : "SAVE BUSINESS DETAILS"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BusinessDetails;
