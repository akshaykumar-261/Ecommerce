import React, { useState } from "react";
import {
  Plus,
  Package,
  Pencil,
  Trash2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  useGetProducts,
  useGetCategory,
  useDeleteProduct,
} from "../../api/useVendorApi";
function ProductTable({ onAddProduct }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Current page
  const [page, setPage] = useState(1);

  // Backend ko 10 products per page chahiye
  const limit = 10;

  // Products backend pagination ke according aa rahe hain
  const { data: productData, isLoading, isError } = useGetProducts(page, limit);

  // Categories
  const { data: categoryData } = useGetCategory();

  // Delete product mutation
  const { mutate: deleteProduct, isPending: isDeletingProduct } =
    useDeleteProduct();

  // Jis product ko delete kiya ja raha hai
  const [deletingProductId, setDeletingProductId] = useState(null);

  /*
   * =========================================
   * PRODUCTS
   * =========================================
   */

  const products = productData?.data?.data || [];

  /*
   * =========================================
   * BACKEND PAGINATION
   * =========================================
   */

  const totalRecords = productData?.data?.totalRecords || 0;

  const totalPages = productData?.data?.totalPages || 1;

  const currentPage = productData?.data?.currentPage || page;

  /*
   * =========================================
   * CATEGORIES
   * =========================================
   */

  const categories = categoryData?.data?.categories || [];

  /*
   * =========================================
   * GET CATEGORY NAME
   * =========================================
   */

  const getCategoryName = (categoryId) => {
    const category = categories.find(
      (item) => Number(item.id) === Number(categoryId),
    );

    return category?.cat_name || `Category ${categoryId}`;
  };

  /*
   * =========================================
   * GET PRODUCT IMAGE
   * =========================================
   */

  const getProductImage = (product) => {
    const image = product?.product_media?.find(
      (media) => media.media_type === "images",
    );

    return image?.media_url;
  };

  /*
   * =========================================
   * PREVIOUS PAGE
   * =========================================
   */

  const handlePrevious = () => {
    if (currentPage > 1) {
      setPage((prev) => prev - 1);
    }
  };

  /*
   * =========================================
   * NEXT PAGE
   * =========================================
   */

  const handleNext = () => {
    if (currentPage < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  /*
   * =========================================
   * NUMBERED PAGE
   * =========================================
   */

  const handlePageChange = (pageNumber) => {
    if (pageNumber !== currentPage) {
      setPage(pageNumber);
    }
  };

  /*
   * =========================================
   * DELETE PRODUCT
   * =========================================
   */

  const handleDeleteProduct = (productId) => {
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingProductId(productId);

    deleteProduct(productId, {
      onSuccess: (data) => {
        toast.success(data?.message || "Product deleted successfully!");

        /*
         * Agar current page par sirf 1 product tha
         * aur wo delete ho gaya,
         * to previous page par chale jayenge.
         */
        if (products.length === 1 && currentPage > 1) {
          setPage((prev) => prev - 1);
        }

        /*
         * Backend se latest products dobara fetch honge.
         */
        queryClient.invalidateQueries({
          queryKey: ["vendor-products"],
        });

        setDeletingProductId(null);
      },

      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to delete product",
        );

        setDeletingProductId(null);
      },
    });
  };

  /*
   * =========================================
   * PAGINATION SHOW / HIDE
   * =========================================
   *
   * Pagination sirf tab show hogi
   * jab total products 10 se zyada hon.
   */

  const showPagination = totalRecords > limit;

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your store products
          </p>
        </div>

        <button
          type="button"
          onClick={onAddProduct}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:shadow-md"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-sm text-gray-500">Loading products...</div>
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-sm text-red-500">Failed to load products</div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && products.length === 0 && (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
              <Package size={26} className="text-gray-400" />
            </div>

            <h3 className="text-base font-semibold text-gray-700">
              No Products Found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Start adding products to your store.
            </p>

            <button
              type="button"
              onClick={onAddProduct}
              className="mt-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2 text-sm font-medium text-white"
            >
              <Plus size={17} />
              Add Product
            </button>
          </div>
        )}

        {/* Products Table */}
        {!isLoading && !isError && products.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Discount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => {
                    const productImage = getProductImage(product);

                    const isDeleting =
                      isDeletingProduct && deletingProductId === product.id;

                    return (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                      >
                        {/* Product */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                              {productImage ? (
                                <img
                                  src={productImage}
                                  alt={product.pro_name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <ImageIcon
                                    size={20}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[220px] truncate text-sm font-medium text-gray-800">
                                {product.pro_name}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                ID: #{product.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-gray-600">
                            {getCategoryName(product.category_id)}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-gray-800">
                            ₹{product.price}
                          </span>
                        </td>

                        {/* Discount */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-green-600">
                            {product.discount_price
                              ? `₹${product.discount_price}`
                              : "-"}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="px-5 py-4">
                          <span
                            className={`text-sm font-medium ${
                              Number(product.quantity) <= 5
                                ? "text-red-500"
                                : "text-gray-700"
                            }`}
                          >
                            {product.quantity}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {product.status ? (
                            <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-500">
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/vendor/editProduct/${product.id}`, {
                                  state: {
                                    product,
                                  },
                                })
                              }
                              disabled={isDeletingProduct}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Edit Product"
                            >
                              <Pencil size={16} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={isDeletingProduct}
                              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                              title="Delete Product"
                            >
                              {isDeleting ? (
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-red-500" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {showPagination && (
              <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Showing */}
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-medium text-gray-700">
                    {products.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {totalRecords}
                  </span>{" "}
                  products
                </p>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-1">
                  {/* Previous */}
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentPage === 1 || isLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                  </button>

                  {/* Page Numbers */}
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1,
                  ).map((pageNumber) => (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                        currentPage === pageNumber
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages || isLoading}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight size={17} />
                  </button>
                </div>

                {/* Current Page */}
                <p className="text-sm text-gray-500">
                  Page{" "}
                  <span className="font-medium text-gray-700">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-700">
                    {totalPages}
                  </span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductTable;
