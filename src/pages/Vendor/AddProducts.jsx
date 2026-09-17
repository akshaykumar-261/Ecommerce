import React, { useState } from "react";
import {
  Plus,
  ArrowLeft,
  ImagePlus,
  Video,
  Upload,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { toast } from "react-hot-toast"
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
import { useAddProduct, useGetCategory } from "../../api/useVendorApi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../validation/venderValidation";
import ProductTable from "./ ProductTable";

function AddProducts() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  const { mutate: addProduct, isPending } = useAddProduct();

  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useGetCategory();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  // =========================
  // IMAGE SELECT
  // =========================
const handleImages = (e) => {
  const files = Array.from(e.target.files || []);

  console.log("Selected images:", files);
  console.log("Image count:", files.length);

  setImages((prev) => {
    const newFiles = files.filter(
      (newFile) =>
        !prev.some(
          (oldFile) =>
            oldFile.name === newFile.name &&
            oldFile.size === newFile.size &&
            oldFile.lastModified === newFile.lastModified,
        ),
    );
    return [...prev, ...newFiles];
  });

  e.target.value = "";
};

  // =========================
  // VIDEO SELECT
  // =========================
 const handleVideos = (e) => {
   const files = Array.from(e.target.files || []);

   console.log("Selected videos:", files);
   console.log("Video count:", files.length);

   setVideos((prev) => {
     const newFiles = files.filter(
       (newFile) =>
         !prev.some(
           (oldFile) =>
             oldFile.name === newFile.name &&
             oldFile.size === newFile.size &&
             oldFile.lastModified === newFile.lastModified,
         ),
     );
     return [...prev, ...newFiles];
   });
   e.target.value = "";
 };
  // =========================
  // SUBMIT PRODUCT
  // =========================
  const onSubmitData = (data) => {
    console.log("Product Details:", data);
    console.log("Images:", images);
    console.log("Videos:", videos);

    // FormData create
    const formData = new FormData();

    // Product details
    formData.append("pro_name", data.pro_name);
    formData.append("category_id", data.category_id);
    formData.append("description", data.description);
    formData.append("quantity", data.quantity);
    formData.append("price", data.price);
    formData.append("discount_price", data.discount_price);

    // Images
    images.forEach((file) => {
      formData.append("product_images", file);
    });

    // Videos
    videos.forEach((file) => {
      formData.append("product_videos", file);
    });

    addProduct(formData, {
      onSuccess: (response) => {
        toast.success(response?.message || "Product created successfully!");

        reset();
        setImages([]);
        setVideos([]);
        setShowForm(false);
      },

      onError: (error) => {
        console.error("ADD PRODUCT ERROR:", error);

        toast.error(
          error.response?.data?.message || "Failed to create product",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        role="vendor"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:ml-[270px]">
        {/* ================= TOPBAR ================= */}
        <Topbar
          role="vendor"
          userName="Vikash Store"
          setMobileOpen={setMobileOpen}
        />

        <main className="p-5 lg:p-6">
          {/* ================= PRODUCT TABLE ================= */}
          {!showForm ? (
            <ProductTable onAddProduct={() => setShowForm(true)} />
          ) : (
            <div className="mx-auto max-w-5xl">
              {/* ================= HEADER ================= */}
              <div className="mb-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setImages([]);
                    setVideos([]);
                    setShowForm(false);
                  }}
                  disabled={isPending}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  <ArrowLeft size={19} />
                </button>

                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    Add Product
                  </h1>

                  <p className="text-sm text-gray-500">
                    Enter product details and upload product media
                  </p>
                </div>
              </div>

              {/* ================= FORM ================= */}
              <form
                onSubmit={handleSubmit(onSubmitData)}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
              >
                {/* ================= PRODUCT DETAILS ================= */}
                <div className="p-6">
                  <h2 className="mb-5 text-base font-semibold text-gray-800">
                    Product Details
                  </h2>

                  {/* PRODUCT NAME */}
                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Product Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter product name"
                      {...register("pro_name")}
                      className={`h-11 w-full rounded-lg border px-4 text-sm outline-none focus:ring-2 ${
                        errors.pro_name
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />

                    {errors.pro_name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.pro_name.message}
                      </p>
                    )}
                  </div>

                  {/* CATEGORY */}
                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Category
                    </label>

                    <select
                      {...register("category_id")}
                      className={`h-11 w-full rounded-lg border bg-white px-4 text-sm text-gray-700 outline-none focus:ring-2 ${
                        errors.category_id
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    >
                      <option value="">
                        {categoryLoading
                          ? "Loading categories..."
                          : "Select category"}
                      </option>

                      {categoryData?.data?.categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.cat_name}
                        </option>
                      ))}
                    </select>

                    {categoryError && (
                      <p className="mt-1 text-sm text-red-500">
                        Failed to load categories
                      </p>
                    )}

                    {errors.category_id && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category_id.message}
                      </p>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Description
                    </label>

                    <textarea
                      rows="4"
                      placeholder="Enter product description"
                      {...register("description")}
                      className={`w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none focus:ring-2 ${
                        errors.description
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                      }`}
                    />

                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* QUANTITY + PRICE */}
                  <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* QUANTITY */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Quantity
                      </label>

                      <input
                        type="number"
                        placeholder="Enter quantity"
                        {...register("quantity")}
                        className={`h-11 w-full rounded-lg border px-4 text-sm outline-none focus:ring-2 ${
                          errors.quantity
                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100"
                        }`}
                      />

                      {errors.quantity && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.quantity.message}
                        </p>
                      )}
                    </div>

                    {/* PRICE */}
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Price
                      </label>

                      <div
                        className={`flex h-11 overflow-hidden rounded-lg border ${
                          errors.price ? "border-red-400" : "border-gray-200"
                        }`}
                      >
                        <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">
                          ₹
                        </span>

                        <input
                          type="number"
                          placeholder="Enter price"
                          {...register("price")}
                          className="w-full px-3 text-sm outline-none"
                        />
                      </div>

                      {errors.price && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* DISCOUNT PRICE */}
                  <div className="mb-7">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Discount Price
                    </label>

                    <div
                      className={`flex h-11 overflow-hidden rounded-lg border ${
                        errors.discount_price
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                    >
                      <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        placeholder="Enter discount price"
                        {...register("discount_price")}
                        className="w-full px-3 text-sm outline-none"
                      />
                    </div>

                    {errors.discount_price && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.discount_price.message}
                      </p>
                    )}
                  </div>

                  {/* ================= MEDIA ================= */}
                  <div className="border-t border-gray-100 pt-6">
                    <h2 className="mb-5 text-base font-semibold text-gray-800">
                      Product Media
                    </h2>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* ================= IMAGES ================= */}
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                              <ImageIcon size={17} className="text-blue-600" />
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-gray-800">
                                Product Images
                              </h3>

                              <p className="text-xs text-gray-400">
                                JPG, PNG, WEBP
                              </p>
                            </div>
                          </div>

                          {images.length > 0 && (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                              {images.length} selected
                            </span>
                          )}
                        </div>

                        <label
                          className={`group flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 px-5 text-center transition ${
                            isPending
                              ? "pointer-events-none opacity-60"
                              : "hover:border-indigo-300 hover:bg-indigo-50/40"
                          }`}
                        >
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <ImagePlus
                              size={27}
                              className="text-gray-400 group-hover:text-indigo-500"
                            />
                          </div>

                          <p className="text-sm font-semibold text-gray-700">
                            Click to upload images
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Select multiple product images
                          </p>

                          <span className="mt-4 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm">
                            Browse Files
                          </span>

                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImages}
                            disabled={isPending}
                            className="hidden"
                          />
                        </label>

                        {/* SELECTED IMAGES */}
                        {images.length > 0 && (
                          <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                            <div className="mb-2 flex justify-between">
                              <span className="text-xs font-semibold text-gray-600">
                                Selected Images
                              </span>

                              <span className="text-xs text-gray-400">
                                {images.length} files
                              </span>
                            </div>

                            <div className="space-y-2">
                              {images.map((file, index) => (
                                <div
                                  key={`${file.name}-${index}`}
                                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5"
                                >
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                                    <ImageIcon
                                      size={15}
                                      className="text-blue-500"
                                    />
                                  </div>

                                  <p className="min-w-0 flex-1 truncate text-xs font-medium text-gray-600">
                                    {file.name}
                                  </p>

                                  <span className="text-[10px] text-gray-400">
                                    Image
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ================= VIDEOS ================= */}
                      <div>
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                              <Film size={17} className="text-purple-600" />
                            </div>

                            <div>
                              <h3 className="text-sm font-semibold text-gray-800">
                                Product Videos
                              </h3>

                              <p className="text-xs text-gray-400">
                                MP4, MOV, AVI
                              </p>
                            </div>
                          </div>

                          {videos.length > 0 && (
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                              {videos.length} selected
                            </span>
                          )}
                        </div>

                        <label
                          className={`group flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 px-5 text-center transition ${
                            isPending
                              ? "pointer-events-none opacity-60"
                              : "hover:border-indigo-300 hover:bg-indigo-50/40"
                          }`}
                        >
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                            <Video
                              size={27}
                              className="text-gray-400 group-hover:text-indigo-500"
                            />
                          </div>

                          <p className="text-sm font-semibold text-gray-700">
                            Click to upload videos
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Select multiple product videos
                          </p>

                          <span className="mt-4 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-gray-500 shadow-sm">
                            Browse Files
                          </span>

                          <input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleVideos}
                            disabled={isPending}
                            className="hidden"
                          />
                        </label>

                        {/* SELECTED VIDEOS */}
                        {videos.length > 0 && (
                          <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                            <div className="mb-2 flex justify-between">
                              <span className="text-xs font-semibold text-gray-600">
                                Selected Videos
                              </span>

                              <span className="text-xs text-gray-400">
                                {videos.length} files
                              </span>
                            </div>

                            <div className="space-y-2">
                              {videos.map((file, index) => (
                                <div
                                  key={`${file.name}-${index}`}
                                  className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2.5"
                                >
                                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50">
                                    <Film
                                      size={15}
                                      className="text-purple-500"
                                    />
                                  </div>

                                  <p className="min-w-0 flex-1 truncate text-xs font-medium text-gray-600">
                                    {file.name}
                                  </p>

                                  <span className="text-[10px] text-gray-400">
                                    Video
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= FOOTER ================= */}
                <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-5">
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setImages([]);
                      setVideos([]);
                      setShowForm(false);
                    }}
                    disabled={isPending}
                    className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload size={17} />

                    {isPending ? "Creating Product..." : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AddProducts;
