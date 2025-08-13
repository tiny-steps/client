import Navigation from "../../components/Navigation";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 px-6">
        {" "}
        {/* Add top padding to account for fixed navbar */}
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your account and explore features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">View your performance metrics</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-gray-600">Configure your preferences</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-2">Reports</h3>
              <p className="text-gray-600">Generate detailed reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
