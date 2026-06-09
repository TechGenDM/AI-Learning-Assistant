import React, { useState } from 'react';
import { User, Mail, Shield, Camera, Save, LogOut, ChartBar, FileText, BookOpen, BrainCircuit, FileQuestion, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  
  // States for forms
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.updateProfile({ username, email });
      updateUser(response.data);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(passwords.currentPassword, passwords.newPassword);
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your personal information and security preferences</p>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all">
        {/* Profile Header Banner */}
        <div className="h-48 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#EC4899] relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="absolute -bottom-16 left-8 p-1.5 bg-white rounded-[28px] shadow-xl z-10">
             <div className="h-28 w-28 rounded-[22px] bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] flex items-center justify-center text-[#4F46E5] font-black text-4xl border border-white shadow-inner uppercase relative overflow-hidden group cursor-pointer">
                {user?.username?.substring(0, 2) || 'U'}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                   <Camera size={28} className="text-white drop-shadow-md" />
                </div>
             </div>
          </div>
        </div>

        <div className="pt-20 pb-8 px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-100/60">
           <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{user?.username}</h2>
              <p className="text-gray-500 font-medium flex items-center gap-2 mt-1">
                <Mail size={16} className="text-gray-400" /> {user?.email}
              </p>
           </div>
           
           <div className="flex bg-gray-50/80 p-1.5 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
              <button 
                onClick={() => setActiveTab('general')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'general' ? 'bg-white text-[#4F46E5] shadow-sm ring-1 ring-gray-900/5' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Profile Settings
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === 'security' ? 'bg-white text-[#4F46E5] shadow-sm ring-1 ring-gray-900/5' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Security & Password
              </button>
           </div>
        </div>

        <div className="p-8">
          {activeTab === 'general' ? (
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Username</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="text-gray-400 group-focus-within:text-[#4F46E5] transition-colors" size={20} />
                    </div>
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#4F46E5]/20 focus:bg-white rounded-2xl text-gray-900 font-semibold transition-all outline-none shadow-sm hover:bg-gray-100/50 focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)]" 
                      placeholder="Username"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="text-gray-400 group-focus-within:text-[#4F46E5] transition-colors" size={20} />
                    </div>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-[#4F46E5]/20 focus:bg-white rounded-2xl text-gray-900 font-semibold transition-all outline-none shadow-sm hover:bg-gray-100/50 focus:shadow-[0_0_0_4px_rgba(79,70,229,0.1)]" 
                      placeholder="Email"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 mt-4 border-t border-gray-100">
                <button
                  onClick={() => logout()}
                  className="px-6 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
                >
                  <LogOut size={18} /> Sign out of account
                </button>
                <button
                  disabled={loading}
                  onClick={handleUpdateProfile}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-bold rounded-2xl shadow-lg shadow-[#4F46E5]/25 hover:shadow-xl hover:shadow-[#4F46E5]/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? <Spinner size="sm" color="white" /> : <Save size={20} />}
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-500 fade-in">
               <div className="max-w-2xl">
                 <div className="space-y-6 mb-10">
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Current Password</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <KeyRound className="text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                        </div>
                        <input 
                          type="password" 
                          value={passwords.currentPassword}
                          onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-pink-500/20 focus:bg-white rounded-2xl text-gray-900 font-medium transition-all outline-none shadow-sm hover:bg-gray-100/50 focus:shadow-[0_0_0_4px_rgba(236,72,153,0.1)]" 
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">New Password</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Shield className="text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                          </div>
                          <input 
                            type="password" 
                            value={passwords.newPassword}
                            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-pink-500/20 focus:bg-white rounded-2xl text-gray-900 font-medium transition-all outline-none shadow-sm hover:bg-gray-100/50 focus:shadow-[0_0_0_4px_rgba(236,72,153,0.1)]" 
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Confirm Password</label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Shield className="text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
                          </div>
                          <input 
                            type="password" 
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-pink-500/20 focus:bg-white rounded-2xl text-gray-900 font-medium transition-all outline-none shadow-sm hover:bg-gray-100/50 focus:shadow-[0_0_0_4px_rgba(236,72,153,0.1)]" 
                            placeholder="••••••••"
                          />
                        </div>
                      </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-end pt-8 mt-4 border-t border-gray-100">
                    <button
                      disabled={loading}
                      onClick={handleChangePassword}
                      className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? <Spinner size="sm" color="white" /> : <ArrowRight size={20} />}
                      Update Password
                    </button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Bonus Area: Quick Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group cursor-default">
             <div className="h-14 w-14 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-500 rounded-[20px] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-emerald-100/50">
                <FileQuestion size={26} strokeWidth={2} />
             </div>
             <div>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Quizzes Taken</p>
                <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-black text-gray-900 tracking-tight">48</p>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">+12 this week</span>
                </div>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group cursor-default">
             <div className="h-14 w-14 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-500 rounded-[20px] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 border border-indigo-100/50">
                <BookOpen size={26} strokeWidth={2} />
             </div>
             <div>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Flashcards Mastered</p>
                <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-black text-gray-900 tracking-tight">124</p>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">Top 10%</span>
                </div>
             </div>
          </div>
          
          <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all group cursor-default">
             <div className="h-14 w-14 bg-gradient-to-br from-pink-100 to-pink-50 text-pink-500 rounded-[20px] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 border border-pink-100/50">
                <ChartBar size={26} strokeWidth={2} />
             </div>
             <div>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Overall Accuracy</p>
                <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-black text-gray-900 tracking-tight">86%</p>
                    <span className="text-xs font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">Excellent</span>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;