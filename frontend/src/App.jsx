import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import UploadForm from './components/UploadForm';
import DocumentList from './components/DocumentList';
import './index.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <Toaster position="top-right" />
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <UploadForm onUploadSuccess={handleUploadSuccess} />
          <DocumentList refreshTrigger={refreshTrigger} />
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-gray-700 text-sm font-medium">
            Made with <span className="text-red-500 text-lg animate-pulse">❤️</span> by Pratik Raj
          </p>
          <p className="text-gray-500 text-xs mt-2">
            &copy; 2025 Patient Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
