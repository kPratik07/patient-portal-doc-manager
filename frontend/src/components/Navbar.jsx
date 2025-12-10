export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Patient Portal</h1>
              <p className="text-xs text-gray-600">Medical Document Manager</p>
            </div>
          </div>

          {/* Right side info */}
          <div className="hidden sm:flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-gray-700">Secure & Private</p>
              <p className="text-xs text-gray-600">Your documents, your control</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
