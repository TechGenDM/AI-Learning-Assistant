import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, Clock, Component, FileQuestion, BookOpen, 
  MessageSquare, BrainCircuit, Sparkles, AlertCircle, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import moment from 'moment';

import { BASE_URL } from '../../utils/apiPaths';
import documentService from '../../services/documentService';
import aiService from '../../services/aiService';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import PageHeader from '../../components/common/PageHeader';
import Tabs from '../../components/common/Tabs';

const formatFileSize = (bytes) => {
    if (bytes === undefined || bytes === null || isNaN(bytes)) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const DocumentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('content');
  
  // AI action states
  const [isGeneratingSum, setIsGeneratingSum] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    setLoading(true);
    try {
      const response = await documentService.getDocumentById(id);
      setDoc(response.data);
    } catch (error) {
      toast.error('Failed to load document details');
      navigate('/documents');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsGeneratingSum(true);
    try {
      const res = await aiService.generateSummary(id);
      toast.success(res.message || 'Summary generated successfully!');
      fetchDocument();
    } catch(err) {
      toast.error(err.message || 'Failed to generate summary');
    } finally {
      setIsGeneratingSum(false);
    }
  };

  const tabsList = [
    { id: 'content', label: 'Content' },
    { id: 'chat', label: 'Chat' },
    { id: 'ai_actions', label: 'AI Actions' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'quizzes', label: 'Quizzes' },
  ];

  if (loading) return <Spinner />;
  if (!doc) return null;

  // Safely construct the PDF URL
  let pdfUrl = '';
  if (doc?.filePath) {
      pdfUrl = doc.filePath.startsWith('http') ? doc.filePath : `${BASE_URL}/${doc.filePath.replace(/^\//, '')}`;
  } else if (doc?.filename) {
      pdfUrl = `${BASE_URL}/uploads/documents/${doc.filename}`;
  }

  return (
    <div className="w-full max-w-none mx-auto pb-10">
      <PageHeader title={doc.title} backLink="/documents" />

      <Tabs 
        tabs={tabsList} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      {/* Tab Content Area */}
      <div className="mt-4">
        {activeTab === 'content' && (
          <div className="animate-in fade-in duration-300">
            <div className="border border-gray-200 rounded-[12px] bg-white overflow-hidden shadow-sm">
               <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
                  <span className="font-semibold text-gray-700">Document Viewer</span>
                  <a 
                     href={pdfUrl} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="text-blue-600 hover:text-blue-700 flex items-center gap-1.5 text-sm font-medium transition-colors"
                  >
                     <ExternalLink size={16} /> Open in new tab
                  </a>
               </div>
               <div className="h-[650px] w-full bg-[#323639] flex items-center justify-center relative">
                  {!pdfUrl ? (
                     <div className="text-gray-400 flex flex-col items-center">
                        <FileText size={40} className="mb-3 opacity-50" />
                        <p>Document file not found</p>
                     </div>
                  ) : (
                     <iframe 
                        src={`${pdfUrl}#toolbar=1&navpanes=0&view=FitH`} 
                        title={doc.title} 
                        className="w-full h-full border-0 absolute inset-0"
                     ></iframe>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'ai_actions' && (
          <div className="animate-in fade-in duration-300 bg-white rounded-[20px] p-6 lg:p-8 shadow-sm border border-[#f0f2f5] min-h-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <BrainCircuit className="text-[#0cd09f]" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">AI Document Insights</h2>
            </div>
            
            {!doc.extractedText && doc.status === 'processing' ? (
              <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
                <Spinner />
                <p className="mt-4 text-gray-600 font-medium">Analyzing document contents</p>
                <p className="text-sm text-gray-400 mt-1">This might take a few moments depending on the file size.</p>
              </div>
            ) : !doc.extractedText ? (
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800">
                <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
                <p className="text-sm font-medium">Text extraction failed or was incomplete for this document. AI features might be limited.</p>
              </div>
            ) : (
               <div className="space-y-6">
                 <div className="p-6 bg-gray-50 rounded-[16px] border border-gray-100">
                   <h3 className="text-[15px] font-bold text-gray-700 mb-3 flex items-center gap-2">
                     <Sparkles size={16} className="text-[#0cd09f]" /> AI Summary
                   </h3>
                   <div className="text-[14px] leading-relaxed text-gray-600">
                     {doc.summary ? (
                        <p>{doc.summary}</p>
                     ) : (
                        <div className="text-center py-8">
                           <p className="text-gray-400 mb-4">No summary generated yet.</p>
                           <Button onClick={handleGenerateSummary} loading={isGeneratingSum} className="bg-white border hover:bg-gray-50 border-gray-200 text-gray-700 rounded-xl text-sm px-4 py-2" style={{color: '#374151'}}>Generate Summary Now</Button>
                        </div>
                     )}
                   </div>
                 </div>
               </div>
            )}
          </div>
        )}

        {/* Temporary placeholders for other tabs */}
        {activeTab === 'chat' && (
          <div className="animate-in fade-in duration-300 text-center py-24 bg-white rounded-[20px] shadow-sm border border-[#f0f2f5]">
            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={30} className="text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Interactive Chat</h3>
            <p className="text-sm text-gray-500 mt-2">Chat interface will appear here.</p>
          </div>
        )}

        {activeTab === 'flashcards' && (
          <div className="animate-in fade-in duration-300 text-center py-24 bg-white rounded-[20px] shadow-sm border border-[#f0f2f5]">
            <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <BookOpen size={30} className="text-purple-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Flashcards integration pending</h3>
            <p className="text-sm text-gray-500 mt-2">Your flashcard sets will appear here.</p>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="animate-in fade-in duration-300 text-center py-24 bg-white rounded-[20px] shadow-sm border border-[#f0f2f5]">
            <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <FileQuestion size={30} className="text-[#0cd09f]" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">Quizzes integration pending</h3>
            <p className="text-sm text-gray-500 mt-2">Your interactive quizzes will appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentDetailPage;