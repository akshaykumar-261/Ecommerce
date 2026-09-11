import React, { useState } from "react";
import Sidebar from "../../components/common/SideBar";
import Topbar from "../../components/common/Topbar";
function VendorDashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
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
          <div className="flex min-h-[calc(100vh-58px)] items-center justify-center">
            <h1>ghjhgjgjhhhhhhhhhhhhhhhhh</h1>
          </div>
        </main>
      </div>
    </div>
  );
}

export default VendorDashboard;
