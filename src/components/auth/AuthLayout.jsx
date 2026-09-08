
function AuthLayout({ children,image }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      {/* Main Center Box - Fixed height set ki hai (max-h-[85vh] / h-[600px]) */}
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
        <div className="h-full hidden md:block">
          <img
            src={image}
            alt="ShopEase"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT SIDE - LOGIN / REGISTER (With Scrollbar) */}
        <div className="  h-full overflow-y-auto p-6 md:p-10">
          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
