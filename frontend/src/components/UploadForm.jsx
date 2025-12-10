import { useState } from 'react';
import toast from 'react-hot-toast';
import { documentAPI } from '../api';

export default function UploadForm({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setLoading(true);
    try {
      await documentAPI.upload(file);
      toast.success('File uploaded successfully');
      setFile(null);
      e.target.reset();
      onUploadSuccess();
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to upload file';
      if (error.response?.status === 409) {
        toast.error(errorMsg + ' - This file already exists in your documents');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-3xl mr-3">📤</span>
        Upload Document
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition duration-200 bg-blue-50">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer block">
            <div className="text-gray-700">
              <p className="text-sm font-semibold text-blue-600 mb-2">
                {file ? '✓ ' + file.name : '📄 Click to select a PDF file'}
              </p>
              <p className="text-xs text-gray-600">
                Maximum file size: 10MB
              </p>
            </div>
          </label>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!file || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-8 rounded-lg transition duration-200 text-sm"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  );
}
