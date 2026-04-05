import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, User, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';
import aiService from '../../services/aiService';
import MarkdownRenderer from '../common/MarkdownRenderer';
import Spinner from '../common/Spinner';

const ChatInterface = ({ documentId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (documentId) {
      fetchHistory();
    }
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const response = await aiService.getChatHistory(documentId);
      if (response && response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      toast.error('Failed to load chat history');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);
      if (response && response.data) {
         // Some generic APIs pass 'data: { answer: "response text" }' vs 'data: "text"'
         // Assuming our API route chat() returns the raw string content inside response.data based on prior controller
         const responseText = typeof response.data === 'string' ? response.data : response.data.answer || response.data.response || "No response received";
         setMessages(prev => [...prev, { role: 'ai', content: responseText }]);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border border-gray-100 rounded-[20px] bg-white shadow-sm">
        <Spinner />
        <p className="mt-4 text-[14px] text-gray-500 font-medium">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[700px] bg-[#f8fafc] border border-[#f0f2f5] rounded-[24px] overflow-hidden shadow-sm">
      
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-80">
            <div className="w-[70px] h-[70px] bg-emerald-50 rounded-full flex items-center justify-center mb-5 text-[#0cd09f]">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-[20px] font-bold text-gray-800 mb-2">AI Assistant</h3>
            <p className="text-gray-500 max-w-[340px] text-[15px] leading-relaxed">
              Ask me anything about this document! I can explain complex concepts, summarize sections, or help you study.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            
            return (
              <div key={idx} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-10 h-10 shrink-0 bg-[#0cd09f] rounded-[14px] flex items-center justify-center text-white shadow-sm mt-0.5">
                    <BrainCircuit size={20} />
                  </div>
                )}
                
                {/* Message Bubble */}
                <div 
                  className={`max-w-[85%] rounded-[20px] px-6 py-4 shadow-sm text-[15px] ${
                    isUser 
                    ? 'bg-white border border-[#f0f2f5] text-gray-800 rounded-tr-[4px]' 
                    : 'bg-emerald-50/40 border border-emerald-100/50 text-gray-800 rounded-tl-[4px]'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-10 h-10 shrink-0 bg-gray-200 rounded-[14px] flex items-center justify-center text-gray-500 mt-0.5">
                    <User size={20} />
                  </div>
                )}
              </div>
            )
          })
        )}
        
        {isSending && (
          <div className="flex gap-4 justify-start">
             <div className="w-10 h-10 shrink-0 bg-[#0cd09f] rounded-[14px] flex items-center justify-center text-white shadow-sm mt-0.5">
                <BrainCircuit size={20} />
             </div>
             <div className="max-w-[70%] bg-emerald-50/40 border border-emerald-100/50 rounded-[20px] rounded-tl-[4px] px-6 py-4 flex items-center gap-1.5 h-[56px]">
                <div className="w-2 h-2 bg-[#0cd09f] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#0cd09f] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-[#0cd09f] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Form Area */}
      <div className="p-5 bg-white border-t border-[#f0f2f5]">
        <form onSubmit={handleSend} className="relative flex items-center group max-w-5xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the document..."
            className="w-full bg-[#f8fafc] border border-gray-200 rounded-[24px] pl-6 pr-16 py-[18px] text-[15px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0cd09f]/30 focus:border-[#0cd09f] resize-none h-[60px] min-h-[60px] max-h-[140px] overflow-y-auto transition-all"
            rows="1"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="absolute right-2 bottom-2 p-3 rounded-full bg-[#0cd09f] text-white hover:bg-[#0bc193] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
          >
            <Send size={18} className="translate-x-[1px] translate-y-[1px]" />
          </button>
        </form>
        <p className="text-center text-[12px] text-gray-400 mt-3 font-medium">AI generated answers can be inaccurate. Always verify facts.</p>
      </div>
    </div>
  );
};

export default ChatInterface;