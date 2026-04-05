import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title, backLink, backText = "Back to Documents" }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      {backLink && (
        <button 
          onClick={() => navigate(backLink)}
          className="flex items-center gap-2 text-[14px] font-medium text-gray-500 hover:text-gray-800 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          {backText}
        </button>
      )}
      <h1 className="text-[28px] font-medium text-gray-800 tracking-tight">{title}</h1>
    </div>
  );
};

export default PageHeader;