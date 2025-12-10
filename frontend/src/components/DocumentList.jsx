import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { documentAPI } from '../api';
import DocumentItem from './DocumentItem';
import PDFViewerModal from './PDFViewerModal';

export default function DocumentList({ refreshTrigger }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerPdfUrl, setViewerPdfUrl] = useState(null);
  const [viewerFilename, setViewerFilename] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [refreshTrigger]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentAPI.getAll();
      setDocuments(response.data.documents || []);
    } catch (error) {
      toast.error('Failed to fetch documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await documentAPI.delete(id);
        toast.success('Document deleted successfully');
        // Refetch documents to ensure state is synced with server
        await fetchDocuments();
      } catch (error) {
        const errorMsg = error.response?.data?.error || 'Failed to delete document';
        toast.error(errorMsg);
        console.error('Delete error:', error);
      }
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      await documentAPI.download(id, filename);
      toast.success('Document downloaded');
    } catch (error) {
      toast.error('Failed to download document');
      console.error(error);
    }
  };

  const handleView = async (id, filename) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const viewUrl = `${apiUrl}/documents/${id}/view`;
      setViewerPdfUrl(viewUrl);
      setViewerFilename(filename);
      setViewerOpen(true);
    } catch (error) {
      toast.error('Failed to view document');
      console.error(error);
    }
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
    setViewerPdfUrl(null);
    setViewerFilename('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <span className="text-3xl mr-3">📑</span>
        Your Documents
      </h2>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block">
            <div className="animate-spin text-4xl mb-3">⏳</div>
            <p className="text-gray-600">Loading documents...</p>
          </div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-gray-600 text-lg">No documents uploaded yet</p>
          <p className="text-gray-500 text-sm mt-2">Start by uploading your first document above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <DocumentItem
              key={doc.id}
              document={doc}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onView={handleView}
            />
          ))}
        </div>
      )}

      <PDFViewerModal
        isOpen={viewerOpen}
        pdfUrl={viewerPdfUrl}
        filename={viewerFilename}
        onClose={handleCloseViewer}
      />
    </div>
  );
}
