import React, { useState } from 'react';
import { User, Mail, Shield, Camera, Save, LogOut, ChartBar, FileText, BookOpen, BrainCircuit, FileQuestion } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your personal information and security preferences</p>
      </div>

      <div className="bg-white rounded-[32px] border border-[#edf1f6] shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        {/* Profile Header Banner */}
        <div className="h-32 bg-linear-to-r from-[#0cd09f] to-[#0bc193] relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl shadow-lg">
             <div className="h-24 w-24 rounded-[20px] bg-emerald-50 flex items-center justify-center text-[#0cd09f] font-bold text-2xl border border-emerald-100 uppercase">
                {user?.username?.substring(0, 2) || 'U'}
             </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.username}</h2>
              <p className="text-gray-500 font-medium flex items-center gap-2 mt-0.5">
                <Mail size={14} /> {user?.email}
              </p>
           </div>
           
           <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
              <button 
                onClick={() => setActiveTab('general')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'general' ? 'bg-white text-[#0cd09f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'security' ? 'bg-white text-[#0cd09f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Security
              </button>
           </div>
        </div>

        <div className="px-8 pb-10">
          {activeTab === 'general' ? (
            <div className="mt-4 animate-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-[#edf1f6] focus:border-emerald-500 focus:bg-white rounded-2xl text-gray-700 font-medium transition-all outline-none" 
                      placeholder="Username"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-[#edf1f6] focus:border-emerald-500 focus:bg-white rounded-2xl text-gray-700 font-medium transition-all outline-none" 
                      placeholder="Email"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <button
                  onClick={() => logout()}
                  className="px-6 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
                >
                  <LogOut size={16} /> Sign out of account
                </button>
                <button
                  disabled={loading}
                  onClick={handleUpdateProfile}
                  className="inline-flex items-center gap-2 px-10 py-4 bg-[#0cd09f] hover:bg-[#0bc193] text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 transition-all disabled:opacity-50"
                >
                  {loading ? <Spinner size="sm" color="white" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-4 animate-in slide-in-from-bottom-2 duration-300">
               <div className="max-w-2xl">
                 <div className="space-y-6 mb-10">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Current Password</label>
                      <input 
                        type="password" 
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                        className="w-full px-5 py-4 bg-gray-50/50 border border-[#edf1f6] focus:border-emerald-500 focus:bg-white rounded-2xl text-gray-700 transition-all outline-none" 
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">New Password</label>
                        <input 
                          type="password" 
                          value={passwords.newPassword}
                          onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50/50 border border-[#edf1f6] focus:border-emerald-500 focus:bg-white rounded-2xl text-gray-700 transition-all outline-none" 
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[13px] font-bold text-gray-400 uppercase tracking-wider ml-1">Confirm New Password</label>
                        <input 
                          type="password" 
                          value={passwords.confirmPassword}
                          onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                          className="w-full px-5 py-4 bg-gray-50/50 border border-[#edf1f6] focus:border-emerald-500 focus:bg-white rounded-2xl text-gray-700 transition-all outline-none" 
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-end pt-6 border-t border-gray-100">
                    <button
                      disabled={loading}
                      onClick={handleChangePassword}
                      className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
                    >
                      {loading ? <Spinner size="sm" color="white" /> : <Shield size={18} />}
                      Update Password
                    </button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Bonus Area: Quick Stats (Optional but fills the look) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-[#edf1f6] flex items-center gap-4">
             <div className="h-12 w-12 bg-emerald-50 text-[#0cd09f] rounded-2xl flex items-center justify-center">
                <FileQuestion size={24} />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Quizzes Taken</p>
                <p className="text-xl font-bold text-gray-800">48</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-[#edf1f6] flex items-center gap-4">
             <div className="h-12 w-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <BookOpen size={24} />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Flashcards Mastered</p>
                <p className="text-xl font-bold text-gray-800">124</p>
             </div>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-[#edf1f6] flex items-center gap-4">
             <div className="h-12 w-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">
                <ChartBar size={24} />
             </div>
             <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Overall Accuracy</p>
                <p className="text-xl font-bold text-gray-800">86%</p>
             </div>
          </div>
      </div>
    </div>
  );
};

export default ProfilePage;