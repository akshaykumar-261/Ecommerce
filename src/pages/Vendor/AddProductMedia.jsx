import React, { useState } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Video,
  Upload,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
import { useAddProductImage } from "../../api/useVendorApi";
function AddProductMedia() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const { productId } = useParams();
  const navigate = useNavigate();
  const { mutate: addProductMedia, isPending } = useAddProductImage();
  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
    e.target.value = "";
  };
  const handleVideos = (e) => {
    const files = Array.from(e.target.files || []);
    setVideos(files);
    e.target.value = "";
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Product ID check
    if (!productId) {
      toast.error("Product ID is missing");
      return;
    }

    // Media check
    if (images.length === 0 && videos.length === 0) {
      toast.error("Please select at least one image or video");
      return;
    }

    // FormData create
    const formData = new FormData();

    // Images append
    images.forEach((file) => {
      formData.append("product_images", file);
    });

    // Videos append
    videos.forEach((file) => {
      formData.append("product_videos", file);
    });

    // API call
    addProductMedia(
      {
        productId,
        data: formData,
      },
      {
        onSuccess: (response) => {
          toast.success(
            response?.message || "Product media added successfully!",
          );

          // Clear selected files
          setImages([]);
          setVideos([]);

          // Product list par wapas
          navigate("/vendor/addProduct");
        },

        onError: (error) => {
          console.error("MEDIA UPLOAD ERROR:", error);

          toast.error(
            error.response?.data?.message || "Failed to add product media",
          );
        },
      },
    );
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

        <main className="p-4 sm:p-5 lg:p-7">
          <div className="mx-auto max-w-5xl">
            {/* ================= PAGE HEADER ================= */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={isPending}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ArrowLeft size={19} />
                </button>

                <div>
                  <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                    Product Media
                  </h1>

                  <p className="mt-0.5 text-sm text-gray-500">
                    Add product images and videos
                  </p>
                </div>
              </div>

              {/* Product ID */}
              <div className="hidden items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm sm:flex">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Product ID
                </span>

                <span className="rounded-md bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600">
                  #{productId}
                </span>
              </div>
            </div>

            {/* ================= MOBILE PRODUCT ID ================= */}
            <div className="mb-5 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 sm:hidden">
              <span className="text-sm font-medium text-indigo-700">
                Product ID
              </span>

              <span className="rounded-md bg-white px-2.5 py-1 text-sm font-semibold text-indigo-600 shadow-sm">
                #{productId}
              </span>
            </div>

            {/* ================= FORM ================= */}
            <form onSubmit={handleSubmit}>
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                {/* ================= CARD HEADER ================= */}
                <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                      <Upload size={21} className="text-indigo-600" />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-gray-800">
                        Upload Media
                      </h2>

                      <p className="text-sm text-gray-500">
                        Upload high-quality media for your product
                      </p>
                    </div>
                  </div>
                </div>

                {/* ================= MEDIA CONTENT ================= */}
                <div className="p-5 sm:p-7">
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

                      {/* Image Upload */}
                      <label
                        className={`group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 px-5 text-center transition-all ${
                          isPending
                            ? "pointer-events-none opacity-60"
                            : "hover:border-indigo-300 hover:bg-indigo-50/40"
                        }`}
                      >
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition group-hover:scale-105">
                          <ImagePlus
                            size={27}
                            className="text-gray-400 transition group-hover:text-indigo-500"
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
                      {/* Selected Images */}
                      {images.length > 0 && (
                        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                          <div className="mb-2 flex items-center justify-between">
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
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
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

                      {/* Video Upload */}
                      <label
                        className={`group flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 px-5 text-center transition-all ${
                          isPending
                            ? "pointer-events-none opacity-60"
                            : "hover:border-indigo-300 hover:bg-indigo-50/40"
                        }`}
                      >
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm transition group-hover:scale-105">
                          <Video
                            size={27}
                            className="text-gray-400 transition group-hover:text-indigo-500"
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

                      {/* Selected Videos */}
                      {videos.length > 0 && (
                        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-3">
                          <div className="mb-2 flex items-center justify-between">
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
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                                  <Film size={15} className="text-purple-500" />
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

                {/* ================= FOOTER ================= */}
                <div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
                  <div className="text-xs text-gray-400">
                    You can upload multiple images and videos
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      disabled={isPending}
                      className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex min-w-[145px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Upload size={17} />

                      {isPending ? "Uploading..." : "Upload Media"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AddProductMedia;
