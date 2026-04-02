import React, { useState, useEffect } from 'react'
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

import documentService from '../../services/documentService';
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";


const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for upload modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getAllDocuments();
      setDocuments(data);
    } catch (error) {
      toast.error('Failed to fetch documents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    fetchDocuments();
  }, []);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadFile(file);
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) {
      toast.error("Please select a file and enter a title");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("title", uploadTitle);

    try {
      await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle("");
      setLoading(true);
      fetchDocuments();
    } catch (error) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteRequest = (doc) => {
    setSelectedDoc(doc);
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    if(!selectedDoc) return;
    setDeleting(true);
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`${selectedDoc.title} deleted successfully!`);
      setIsDeleteModalOpen(false);
      setSelectedDoc(null);
      setDocuments(documents.filter((doc) => doc._id !== selectedDoc._id));
    } catch (error) {
      toast.error(error.message || "Failed to delete document");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="w-full max-w-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-[30px] font-semibold text-gray-800">Documents</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view all your uploaded materials</p>
        </div>
        <Button onClick={() => setIsUploadModalOpen(true)} icon={Upload}>
          Upload Document
        </Button>
      </div>

      {/* Document Grid */}
      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#edf1f6] p-12 text-center shadow-[0_3px_10px_rgba(15,23,42,0.04)]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">No documents yet</h3>
          <p className="text-gray-500 mt-2 text-sm max-w-sm mx-auto">
            Get started by uploading your first document to begin generating flashcards and quizzes.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-6 text-emerald-500 font-semibold text-sm hover:text-emerald-600 transition-colors"
          >
            + Upload your first document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="group bg-white rounded-2xl border border-[#edf1f6] hover:border-emerald-200 p-5 shadow-[0_3px_10px_rgba(15,23,42,0.04)] hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <button
                  onClick={() => handleDeleteRequest(doc)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1" title={doc.title}>
                {doc.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-1 flex-1" title={doc.fileName}>
                {doc.fileName || "Unknown file"}
              </p>

              <div className="pt-4 border-t border-[#edf1f6] flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                {doc.fileSize && <span>{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800">Upload Document</h2>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadFile(null);
                  setUploadTitle('');
                }}
                className="text-gray-400 hover:text-gray-600 p-1 mr-[-4px] rounded-lg hover:bg-gray-50 transition-colors"
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpload} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wider uppercase mb-2">
                    Document Title
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="E.g. React Fundamentals"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wider uppercase mb-2">
                    File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2.5 file:px-4
                        file:rounded-xl file:border-0
                        file:text-sm file:font-semibold
                        file:bg-emerald-50 file:text-emerald-600
                        hover:file:bg-emerald-100 file:transition-colors
                        border border-gray-200 rounded-xl cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2">
                    Supported formats: PDF, TXT, DOCX. Max size: 10MB.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading || !uploadFile || !uploadTitle}
                  loading={uploading}
                  icon={Upload}
                  className="flex-1"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-14 h-14 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <Trash2 size={26} />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Document?</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
              Are you sure you want to delete <span className="font-semibold text-gray-700">"{selectedDoc?.title}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                loading={deleting}
                className="flex-1"
              >
                {deleting ? 'Deleting' : 'Yes, delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocumentListPage