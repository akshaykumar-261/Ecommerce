import React, { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { mutate: addProduct } = useAddProduct();
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

  const onSubmitData = (data) => {
    console.log("Product Data:", data);

    addProduct(data, {
      onSuccess: (response) => {
        toast.success(response?.message || "Product created successfully!");
        // Backend se created product ki ID
        const productId = response?.data?.product?.id;
        console.log("Created Product ID:", productId);
        if (!productId) {
          toast.error("Product ID not received from server");
          return;
        }
        reset();
        // Media upload page par product ID URL parameter mein bhejna
        navigate(`/vendor/addProductImage/${productId}`);
      },
      onError: (error) => {
        toast.error(
          error.response?.data?.message || "Failed to create product",
        );
      },
    });
  };

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
          {!showForm ? (
            <ProductTable onAddProduct={() => setShowForm(true)} />
          ) : (
            <div className="mx-auto max-w-4xl">
              <div className="mb-5 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowForm(false);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft size={19} />
                </button>

                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    Add Product
                  </h1>

                  <p className="text-sm text-gray-500">Enter product details</p>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmitData)}
                className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
              >
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

                <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">
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

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Price
                    </label>

                    <div
                      className={`flex h-11 overflow-hidden rounded-lg border focus-within:ring-2 ${
                        errors.price
                          ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-100"
                          : "border-gray-200 focus-within:border-indigo-500 focus-within:ring-indigo-100"
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

                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Discount Price
                  </label>

                  <div
                    className={`flex h-11 overflow-hidden rounded-lg border focus-within:ring-2 ${
                      errors.discount_price
                        ? "border-red-400 focus-within:border-red-500 focus-within:ring-red-100"
                        : "border-gray-200 focus-within:border-indigo-500 focus-within:ring-indigo-100"
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

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setShowForm(false);
                    }}
                    className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:shadow-md"
                  >
                    Submit
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
