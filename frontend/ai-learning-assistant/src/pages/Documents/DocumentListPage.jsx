import React, { useState, useEffect } from 'react'
import { Plus, Upload, Trash2, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

import documentService from '../../services/documentService';
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import DocumentCard from "../../components/documents/DocumentCard";


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
      const response = await documentService.getDocuments();
      setDocuments(response.data || []);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-semibold text-gray-800 leading-tight">My Documents</h1>
          <p className="text-[14px] text-gray-500 mt-1.5">Manage and organize your learning materials</p>
        </div>
        <Button 
          onClick={() => setIsUploadModalOpen(true)} 
          icon={Plus}
          className="bg-[#0cd09f] hover:bg-[#0bc193] text-white rounded-full px-6 py-[10px] font-medium border-0 shadow-sm"
          style={{ 
            backgroundImage: 'none', 
            backgroundColor: '#0cd09f', 
            borderRadius: '9999px', 
            border: 'none',
            color: 'white'
          }}
        >
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
            <DocumentCard key={doc._id} doc={doc} onDelete={handleDeleteRequest} />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between px-6 pt-6 pb-2">
              <div>
                <h2 className="text-xl font-medium text-gray-800">Upload New Document</h2>
                <p className="text-sm text-gray-500 mt-1">Add a PDF document to your library</p>
              </div>
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
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wider uppercase mb-2">
                    DOCUMENT TITLE
                  </label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g., React Interview Prep"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400 transition-all duration-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wider uppercase mb-2">
                    PDF FILE
                  </label>
                  <div className="relative border-2 border-dashed border-emerald-300 rounded-xl hover:bg-emerald-50/50 transition-colors duration-200 bg-white">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf"
                      title=""
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                      <div className="w-12 h-12 mb-3 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                        <Upload size={24} />
                      </div>
                      <p className="text-sm text-gray-600">
                        {uploadFile ? (
                          <span className="font-medium text-emerald-600">{uploadFile.name}</span>
                        ) : (
                          <><span className="text-emerald-600 font-medium">Click to upload</span> or drag and drop</>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                  style={{
                    backgroundColor: 'white',
                    color: '#374151',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={uploading || !uploadFile || !uploadTitle}
                  loading={uploading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border-0"
                  style={{
                    backgroundColor: '#10B981',
                    color: 'white',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
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