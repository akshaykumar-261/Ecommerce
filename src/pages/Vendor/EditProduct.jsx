import React, { useRef, useState } from "react";
import { ArrowLeft, Image as ImageIcon, Film, X, Plus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
import {
  useUpadteProduct,
  useAddProductImage,
  useDeleteProductMedia,
  useSetPrimaryImage,
} from "../../api/useVendorApi";
import toast from "react-hot-toast";
function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  // ProductTable se product receive hoga
  const product = location.state?.product;
  /*
   * File input refs
   */
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  /*
   * Product update mutation
   */
  const { mutate: updateProduct, isPending: isUpdatingProduct } =
    useUpadteProduct();

  /*
   * Product media upload mutation
   */
  const { mutate: addProductMedia, isPending: isUploadingMedia } =
    useAddProductImage();

  /*
   * Product media delete mutation
   */
  const { mutate: deleteProductMedia, isPending: isDeletingMedia } =
    useDeleteProductMedia();

  const { mutate: setPrimaryImage, isPending: isSettingPrimary } =
    useSetPrimaryImage();

  /*
   * Product details
   */
  const [formData, setFormData] = useState({
    pro_name: product?.pro_name || "",
    quantity: product?.quantity ?? "",
    price: product?.price ?? "",
    discount_price: product?.discount_price ?? "",
    description: product?.description || "",
  });

  /*
   * Product media ko local state mein rakhenge.
   *
   * Isse API call ke baad page reload ki zarurat nahi padegi.
   */
  const [mediaList, setMediaList] = useState(product?.product_media || []);

  /*
   * Delete hone wale media ki ID
   */
  const [deletingMediaId, setDeletingMediaId] = useState(null);

  /*
   * Input change
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * =========================================
   * UPDATE PRODUCT DETAILS
   * =========================================
   */
  const handleUpdateProduct = () => {
    const id = product?.id || productId;

    if (!id) {
      toast.error("Product ID not found");
      return;
    }

    updateProduct(
      {
        productId: id,
        data: formData,
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || "Product updated successfully!");

          navigate("/vendor/addProduct");
        },

        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to update product",
          );
        },
      },
    );
  };

  /*
   * =========================================
   * PRODUCT IMAGES
   * =========================================
   */
  const images = mediaList.filter((media) => media.media_type === "images");

  /*
   * =========================================
   * PRODUCT VIDEOS
   * =========================================
   */
  const videos = mediaList.filter((media) => media.media_type === "video");

  /*
   * =========================================
   * OPEN IMAGE PICKER
   * =========================================
   */
  const handleAddImages = () => {
    imageInputRef.current?.click();
  };

  /*
   * =========================================
   * OPEN VIDEO PICKER
   * =========================================
   */
  const handleAddVideos = () => {
    videoInputRef.current?.click();
  };

  /*
   * =========================================
   * UPLOAD IMAGES
   * =========================================
   */
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    const id = product?.id || productId;

    if (!id) {
      toast.error("Product ID not found");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("product_images", file);
    });

    addProductMedia(
      {
        productId: id,
        data: formData,
      },
      {
        onSuccess: (data) => {
          /*
           * Backend response mein agar media array
           * aa raha hai to usko use karo.
           */
          const newMedia =
            data?.data?.product_media ||
            data?.data?.media ||
            data?.product_media ||
            data?.media ||
            [];

          if (Array.isArray(newMedia) && newMedia.length > 0) {
            setMediaList(newMedia);
          } else {
            /*
             * Agar backend sirf success message bhej raha hai,
             * to temporary local preview create kar rahe hain.
             */
            const localImages = files.map((file, index) => ({
              id: `temp-image-${Date.now()}-${index}`,
              media_type: "images",
              media_url: URL.createObjectURL(file),
              isLocal: true,
            }));

            setMediaList((prev) => [...prev, ...localImages]);
          }

          toast.success(data?.message || "Images uploaded successfully!");
        },

        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to upload images",
          );
        },
      },
    );

    /*
     * Same file dobara select karne ke liye input reset.
     */
    e.target.value = "";
  };

  /*
   * =========================================
   * UPLOAD VIDEOS
   * =========================================
   */
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) {
      return;
    }

    const id = product?.id || productId;

    if (!id) {
      toast.error("Product ID not found");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("product_videos", file);
    });

    addProductMedia(
      {
        productId: id,
        data: formData,
      },
      {
        onSuccess: (data) => {
          /*
           * Backend response mein agar media array
           * aa raha hai to use karenge.
           */
          const newMedia =
            data?.data?.product_media ||
            data?.data?.media ||
            data?.product_media ||
            data?.media ||
            [];

          if (Array.isArray(newMedia) && newMedia.length > 0) {
            setMediaList(newMedia);
          } else {
            /*
             * Agar backend media return nahi kar raha,
             * temporary video preview show karenge.
             */
            const localVideos = files.map((file, index) => ({
              id: `temp-video-${Date.now()}-${index}`,
              media_type: "video",
              media_url: URL.createObjectURL(file),
              isLocal: true,
            }));

            setMediaList((prev) => [...prev, ...localVideos]);
          }

          toast.success(data?.message || "Videos uploaded successfully!");
        },

        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to upload videos",
          );
        },
      },
    );

    /*
     * Input reset
     */
    e.target.value = "";
  };

  /*
   * =========================================
   * DELETE PRODUCT MEDIA
   * =========================================
   */
  const handleDeleteMedia = (mediaId) => {
    if (!mediaId) {
      toast.error("Media ID not found");
      return;
    }

    const selectedMedia = mediaList.find((media) => media.id === mediaId);

    if (selectedMedia?.isLocal) {
      setMediaList((prev) => prev.filter((media) => media.id !== mediaId));
      toast.success("Media removed successfully!");
      return;
    }

    setDeletingMediaId(mediaId);

    deleteProductMedia(mediaId, {
      onSuccess: (data) => {
        setMediaList((prev) => prev.filter((media) => media.id !== mediaId));
        toast.success(data?.message || "Media deleted successfully!");
        setDeletingMediaId(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to delete media");
        setDeletingMediaId(null);
      },
    });
  };

  const handleSetPrimary = (mediaId) => {
    if (!mediaId) return;

    setPrimaryImage(mediaId, {
      onSuccess: (data) => {
        setMediaList((prev) =>
          prev.map((m) =>
            m.media_type === "images"
              ? { ...m, is_primary: m.id === mediaId }
              : m,
          ),
        );
        toast.success(data?.message || "Primary image updated!");
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to set primary image",
        );
      },
    });
  };

  /*
   * =========================================
   * PRODUCT NOT FOUND
   * =========================================
   */
  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f7fb]">
        <Sidebar
          role="vendor"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="min-h-screen lg:ml-[270px]">
          <Topbar
            role="vendor"
            userName="Vikash Store"
            setMobileOpen={setMobileOpen}
          />

          <main className="p-5 lg:p-6">
            <div className="mx-auto max-w-5xl">
              <button
                type="button"
                onClick={() => navigate("/vendor/addProduct")}
                className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                <ArrowLeft size={18} />
                Back to Products
              </button>

              <div className="rounded-xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <h2 className="text-lg font-semibold text-gray-700">
                  Product Not Found
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Please open the product from the products list.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* Sidebar */}
      <Sidebar
        role="vendor"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="min-h-screen lg:ml-[270px]">
        {/* Topbar */}
        <Topbar
          role="vendor"
          userName="Vikash Store"
          setMobileOpen={setMobileOpen}
        />

        <main className="p-5 lg:p-6">
          <div className="mx-auto max-w-5xl">
            {/* ========================================= */}
            {/* HEADER */}
            {/* ========================================= */}

            <div className="mb-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/vendor/addProduct")}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50"
              >
                <ArrowLeft size={19} />
              </button>

              <div>
                <h1 className="text-xl font-semibold text-gray-800">
                  Edit Product
                </h1>

                <p className="text-sm text-gray-500">
                  Update your product details and media
                </p>
              </div>
            </div>

            {/* ========================================= */}
            {/* PRODUCT ID */}
            {/* ========================================= */}

            <div className="mb-5 flex items-center justify-between rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-3">
              <div>
                <p className="text-xs text-indigo-500">Product ID</p>

                <p className="text-sm font-semibold text-indigo-700">
                  #{product.id || productId}
                </p>
              </div>

              <div>
                {product.status ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                    Active
                  </span>
                ) : (
                  <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-500">
                    Inactive
                  </span>
                )}
              </div>
            </div>

            {/* ========================================= */}
            {/* PRODUCT DETAILS */}
            {/* ========================================= */}

            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-semibold text-gray-800">
                  Product Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Basic information about your product
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="pro_name"
                    value={formData.pro_name}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category
                  </label>

                  <input
                    type="text"
                    value={`Category ${product.category_id}`}
                    readOnly
                    className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-gray-600 outline-none"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="h-11 w-full rounded-lg border border-gray-200 px-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  <div className="flex h-11 overflow-hidden rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                    <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-3 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Discount Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount Price
                  </label>

                  <div className="flex h-11 overflow-hidden rounded-lg border border-gray-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
                    <span className="flex items-center bg-gray-50 px-3 text-sm text-gray-500">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="discount_price"
                      value={formData.discount_price}
                      onChange={handleChange}
                      className="w-full px-3 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description
                  </label>

                  <textarea
                    rows="5"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => navigate("/vendor/addProduct")}
                  disabled={isUpdatingProduct}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdateProduct}
                  disabled={isUpdatingProduct}
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdatingProduct ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* ========================================= */}
            {/* PRODUCT IMAGES */}
            {/* ========================================= */}

            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Product Images
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    All images uploaded for this product
                  </p>
                </div>

                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                  {images.length} Images
                </span>
              </div>

              {images.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {images.map((media) => (
                    <div
                      key={media.id}
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={media.media_url}
                        alt={`Product ${product.id}`}
                        className="aspect-square w-full object-cover"
                      />

                      {media.is_primary && (
                        <div className="absolute top-2 left-2 rounded-md bg-indigo-600 px-2 py-1 text-[10px] font-semibold text-white shadow">
                          Primary
                        </div>
                      )}

                      <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                        Image #{media.id}
                      </div>

                      <div className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 transition group-hover:opacity-100">
                        {!media.is_primary && !media.isLocal && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(media.id)}
                            disabled={isSettingPrimary}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
                            title="Set as primary image"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(media.id)}
                          disabled={
                            isDeletingMedia && deletingMediaId === media.id
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
                  <div className="text-center">
                    <ImageIcon size={30} className="mx-auto text-gray-400" />

                    <p className="mt-2 text-sm text-gray-500">
                      No images found
                    </p>
                  </div>
                </div>
              )}

              {/* Hidden Image Input */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />

              {/* Add Images */}
              <button
                type="button"
                onClick={handleAddImages}
                disabled={isUploadingMedia}
                className="mt-5 flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={17} />

                {isUploadingMedia ? "Uploading..." : "Add More Images"}
              </button>
            </div>

            {/* ========================================= */}
            {/* PRODUCT VIDEOS */}
            {/* ========================================= */}

            <div className="mb-6 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">
                    Product Videos
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    All videos uploaded for this product
                  </p>
                </div>

                <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-600">
                  {videos.length} Videos
                </span>
              </div>

              {videos.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {videos.map((media) => (
                    <div
                      key={media.id}
                      className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <video
                        src={media.media_url}
                        controls
                        className="h-56 w-full object-cover"
                      />

                      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Film size={16} className="text-purple-500" />

                          <span className="text-xs text-gray-500">
                            Video #{media.id}
                          </span>
                        </div>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(media.id)}
                          disabled={
                            isDeletingMedia && deletingMediaId === media.id
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                          title="Remove video"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50">
                  <div className="text-center">
                    <Film size={30} className="mx-auto text-gray-400" />

                    <p className="mt-2 text-sm text-gray-500">
                      No videos found
                    </p>
                  </div>
                </div>
              )}

              {/* Hidden Video Input */}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={handleVideoChange}
              />

              {/* Add Videos */}
              <button
                type="button"
                onClick={handleAddVideos}
                disabled={isUploadingMedia}
                className="mt-5 flex items-center gap-2 rounded-lg border border-purple-200 px-4 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={17} />

                {isUploadingMedia ? "Uploading..." : "Add More Videos"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditProduct;
