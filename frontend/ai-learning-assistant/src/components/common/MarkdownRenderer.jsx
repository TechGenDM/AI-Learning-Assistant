import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="w-full break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="rounded-xl overflow-hidden my-4 border border-gray-200/50 shadow-sm">
                <div className="bg-[#2d2d2d] text-gray-400 capitalize font-medium tracking-wide text-[11px] px-4 py-2 border-b border-gray-700/50">
                  {match[1]}
                </div>
                <SyntaxHighlighter
                  {...props}
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  className="!m-0 !bg-[#1e1e1e] !rounded-none text-[13px] leading-relaxed"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code {...props} className="bg-gray-100/80 text-[#0cd09f] px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-gray-200/50">
                {children}
              </code>
            );
          },
          h1: ({node, ...props}) => <h1 className="text-xl font-bold text-gray-800 mt-6 mb-3" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-[17px] font-bold text-gray-800 mt-5 mb-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-[15px] font-bold text-gray-800 mt-4 mb-2" {...props} />,
          p: ({node, ...props}) => <p className="mb-3 text-[14px] leading-relaxed text-gray-700" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 text-[14px] text-gray-700 space-y-1.5" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 text-[14px] text-gray-700 space-y-1.5" {...props} />,
          li: ({node, ...props}) => <li className="pl-1 marker:text-gray-400" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#0cd09f] pl-4 py-1 my-4 text-gray-500 italic bg-emerald-50/30 rounded-r-xl" {...props} />,
          a: ({node, ...props}) => <a className="text-[#0cd09f] hover:text-[#0bc193] font-medium hover:underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-gray-800" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;