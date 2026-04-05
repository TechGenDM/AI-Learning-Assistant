import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, Clock, BookOpen, Target } from 'lucide-react';
import moment from 'moment';

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

const DocumentCard = ({ doc, onDelete }) => {
    return (
        <div className="relative group">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(doc);
                }}
                className="absolute top-5 right-5 text-gray-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 bg-white z-10"
                title="Delete document"
            >
                <Trash2 size={18} />
            </button>
            <Link to={`/documents/${doc._id}`} className="block bg-white rounded-[24px] p-6 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-[#f0f2f5] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300">
                <div className="mb-6">
                    <div className="w-[52px] h-[52px] bg-[#0cd09f] rounded-[16px] flex items-center justify-center mb-5">
                        <FileText className="text-white" size={26} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[17px] font-semibold text-gray-800 mb-1.5 leading-tight line-clamp-1">{doc.title}</h3>
                    <p className="text-[13px] text-gray-500 font-medium">{formatFileSize(doc.fileSize || doc.size)}</p>
                </div>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 rounded-[10px]">
                        <BookOpen className="text-purple-600" size={14} />
                        <span className="text-[13px] font-semibold text-purple-700">{doc.flashcardCounts || doc.flashcardsCount || doc.flashcardCount || 0} Flashcards</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-[10px]">
                        <Target className="text-[#0cd09f]" size={14} />
                        <span className="text-[13px] font-semibold text-[#0cd09f]">{doc.quizCounts || doc.quizzesCount || doc.quizCount || 0} Quizzes</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-500">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-[13px]">Uploaded {moment(doc.uploadDate || doc.createdAt).fromNow()}</span>
                </div>
            </Link>
        </div>
    );
};

export default DocumentCard;