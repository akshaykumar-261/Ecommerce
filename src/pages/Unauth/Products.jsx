import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  ChevronRight,
} from "lucide-react";
import { GetProductsByCategory } from "../../api/productApi";
import { useGetCategory } from "../../api/useVendorApi";
import ProductCard from "../../components/product/ProductCard";
import Navbar from "../../components/common/Navbar";

function EmptyState({ categoryName }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <Package size={48} className="text-gray-300" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-gray-800">
        No Products Found
      </h2>
      <p className="mb-6 max-w-sm text-center text-sm text-gray-500">
        We couldn't find any products in the{" "}
        <span className="font-semibold text-gray-700">{categoryName}</span>{" "}
        category. Try browsing other categories or check back later.
      </p>
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 rounded-xl bg-[#4c2ed8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>
    </div>
  );
}

export default function Products() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: categoryData } = useGetCategory();
  const categories = categoryData?.data?.categories || [];
  const categoryName = categories.find((c) => c.id === Number(id))?.cat_name || "Unknown";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await GetProductsByCategory(id, { page, limit: 12 });
        const data = res?.data;
        setProducts(data?.products?.data || []);
        setTotalPages(data?.products?.totalPages || 1);
      } catch (err) {
        if (err.response?.status === 404) {
          setProducts([]);
          setError(null);
        } else {
          setError("Something went wrong. Please try again later.");
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id, page]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex min-w-0 items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate("/home")}
            className="shrink-0 transition hover:text-[#4c2ed8]"
          >
            Home
          </button>
          <ChevronRight size={14} className="shrink-0" />
          <span className="min-w-0 break-words font-medium text-gray-800">
            {categoryName}
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/home")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition hover:bg-gray-50 hover:text-[#4c2ed8]"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="break-words text-2xl font-bold text-gray-900">
              {categoryName}
            </h1>
            <p className="text-sm text-gray-500">
              {loading ? "Loading..." : `${products.length} products found`}
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#4c2ed8] border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="mb-4 text-sm text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-[#4c2ed8] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3a24b0]"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <EmptyState categoryName={categoryName} />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-4 text-sm text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
