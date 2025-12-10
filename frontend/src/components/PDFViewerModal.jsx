import { useState, useEffect } from 'react';

export default function PDFViewerModal({ isOpen, pdfUrl, filename, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen, pdfUrl]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (pdfUrl) {
      try {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">📄</span>
            <h3 className="text-lg font-semibold text-gray-800 truncate" title={filename}>
              {filename}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-gray-500 hover:text-gray-700 text-2xl leading-none ml-4"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100">
          {isLoading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-3">⏳</div>
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}
          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title={filename}
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
              style={{ border: 'none', minHeight: '500px' }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200 flex items-center gap-2"
          >
            <span>⬇️</span>
            Download
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
