import authBanner from "../../assets/image.png";
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 md:p-8">
      {/* Main Center Box */}
      <div
        className="
          w-full
          max-w-6xl
          bg-white
          rounded-3xl
          shadow-2xl
          overflow-hidden
          grid
          grid-cols-1
          md:grid-cols-2
        "
      >
        {/* LEFT SIDE - IMAGE */}
        <div >
          <img
            src={authBanner}
            alt="ShopEase"
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT SIDE - LOGIN / REGISTER */}
        <div >
          <div className="w-full max-w-md mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
export default AuthLayout;
