import React, { useState } from "react";
import { ArrowLeft, Image as ImageIcon, Film, X, Plus } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
function EditProduct() {
  const navigate = useNavigate();
  const location = useLocation();
  const { productId } = useParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  // PrductTable se product receive hoga
  const product = location.state?.product;
  // Agar direct URL open kiya aur product state nahi hai
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

  // Images
  const images =
    product.product_media?.filter((media) => media.media_type === "images") ||
    [];

  // Videos
  const videos =
    product.product_media?.filter((media) => media.media_type === "video") ||
    [];

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
            {/* Header */}
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

            {/* Product ID */}
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

            {/* Product Details */}
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
                    defaultValue={product.pro_name}
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
                    defaultValue={product.quantity}
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
                      defaultValue={product.price}
                      className="w-full px-3 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Discount */}
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
                      defaultValue={product.discount_price || ""}
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
                    defaultValue={product.description}
                    className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => navigate("/vendor/addProduct")}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>

            {/* Images */}
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

                      {/* Image number */}
                      <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                        Image #{media.id}
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-gray-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:text-red-500"
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
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

              {/* Add Images */}
              <button
                type="button"
                className="mt-5 flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                <Plus size={17} />
                Add More Images
              </button>
            </div>

            {/* Videos */}
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

                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
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

              {/* Add Videos */}
              <button
                type="button"
                className="mt-5 flex items-center gap-2 rounded-lg border border-purple-200 px-4 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50"
              >
                <Plus size={17} />
                Add More Videos
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default EditProduct;
