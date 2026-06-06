import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Trash2, BookOpen, Zap, Clock } from 'lucide-react';
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
        <div className="relative group rounded-2xl overflow-hidden bg-white transition-all duration-200 cursor-pointer"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
        >
            {/* Delete button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(doc);
                }}
                className="absolute top-3 right-3 text-white/70 hover:text-white hover:bg-white/20 p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
                title="Delete document"
            >
                <Trash2 size={15} />
            </button>

            <Link to={`/documents/${doc._id}`} className="block">
                {/* Gradient Banner Header */}
                <div
                    className="relative flex items-center justify-center group-hover:opacity-90 transition-opacity"
                    style={{
                        height: "90px",
                        background: "linear-gradient(135deg, #10B981 0%, #059669 60%, #047857 100%)",
                    }}
                >
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)" }}
                    >
                        <FileText className="text-white" size={24} strokeWidth={1.5} />
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-5">
                    {/* Title & size */}
                    <h3 className="text-[16px] font-bold text-[#111827] mb-1 leading-tight line-clamp-1">
                        {doc.title}
                    </h3>
                    <p className="text-[13px] text-[#9CA3AF] mb-4">
                        {formatFileSize(doc.fileSize || doc.size)}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-4">
                        <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                            style={{ background: "#F3E8FF", color: "#7C3AED" }}
                        >
                            <BookOpen size={12} />
                            <span className="text-[12px] font-semibold">
                                {doc.flashcardCounts || doc.flashcardsCount || doc.flashcardCount || 0} Flashcards
                            </span>
                        </div>
                        <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                            style={{ background: "#FEF3C7", color: "#D97706" }}
                        >
                            <Zap size={12} />
                            <span className="text-[12px] font-semibold">
                                {doc.quizCounts || doc.quizzesCount || doc.quizCount || 0} Quizzes
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                        <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                            <Clock size={12} />
                            <span className="text-[12px]">
                                {moment(doc.uploadDate || doc.createdAt).fromNow()}
                            </span>
                        </div>
                        <span className="text-[13px] font-semibold text-[#10B981] hover:text-[#059669] transition-colors">
                            Open →
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default DocumentCard;