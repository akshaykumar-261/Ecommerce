function AuthLayout({ children, image }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      <div
        className="
          w-full
          max-w-6xl
          h-[85vh]
          bg-white
          rounded-3xl
          shadow-[0_35px_100px_rgba(0,0,0,0.25)]
          overflow-hidden
          grid
          grid-cols-1
          md:grid-cols-2
        "
      >
        {/* LEFT SIDE - IMAGE */}
        <div className="relative min-h-0 overflow-hidden bg-violet-100 hidden md:block">
          <img
            src={image}
            alt="ShopEase"
            className="absolute inset-0 block h-full w-full object-cover"
          />
        </div>

        {/* RIGHT SIDE - LOGIN / REGISTER */}
        <div className="h-full overflow-y-auto px-5 py-6 md:px-8 md:py-7">
          <div className="w-full max-w-sm mx-auto text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
