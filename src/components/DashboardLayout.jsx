/** @format */

import DashHeader from "./dashcomponents/DashHeader"; // Adjust path as needed

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* DashHeader (includes both the top bar and sidebar) */}
      <DashHeader />

      {/* Main Content Area */}
      <main className="md:ml-64 mt-16 p-6">{children}</main>
    </div>
  );
}

export default DashboardLayout;
