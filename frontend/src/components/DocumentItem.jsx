import { useState } from 'react';

export default function DocumentItem({ document, onDelete, onDownload, onView }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes, k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(document.id);
    setIsDeleting(false);
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload(document.id, document.filename);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleView = async () => {
    setIsViewing(true);
    await onView(document.id, document.filename);
    setIsViewing(false);
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 hover:shadow-xl hover:border-blue-300 transition duration-200 bg-gradient-to-br from-gray-50 to-white">
      <div className="mb-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-2xl flex-shrink-0">📄</span>
          <p className="font-semibold text-gray-800 break-words text-sm" title={document.filename}>
            {document.filename}
          </p>
        </div>
        <p className="text-xs text-gray-600 ml-8">
          📊 {formatFileSize(document.filesize)}
        </p>
        <p className="text-xs text-gray-500 ml-8 mt-1">
          📅 {formatDate(document.created_at)}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleView}
          disabled={isViewing}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg text-xs transition duration-200 flex items-center justify-center gap-1"
        >
          <span>{isViewing ? '⏳' : '👁️'}</span>
          {isViewing ? 'Opening' : 'View'}
        </button>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg text-xs transition duration-200 flex items-center justify-center gap-1"
        >
          <span>{isDownloading ? '⏳' : '⬇️'}</span>
          {isDownloading ? 'Downloading' : 'Download'}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg text-xs transition duration-200 flex items-center justify-center gap-1"
        >
          <span>{isDeleting ? '⏳' : '🗑️'}</span>
          {isDeleting ? 'Deleting' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
