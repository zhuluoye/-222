import React, { useState } from 'react';
import { Modal } from './Modal';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));

    // Demo credentials
    if (username === 'admin' && password === 'snowland2025') {
      onLogin();
      onClose();
      setUsername('');
      setPassword('');
    } else {
      setError('账号或密码错误 (默认: admin / snowland2025)');
    }
    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="管理员登录">
      <div className="max-w-sm mx-auto pt-2 pb-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-sm">
            🔐
          </div>
          <h3 className="text-xl font-bold text-gray-900">安全验证</h3>
          <p className="text-gray-500 text-sm mt-1">请验证管理员身份以访问云端数据</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              账号
            </label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="请输入管理员账号"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">
              密码
            </label>
            <input 
              type="password" 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="请输入管理员密码"
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg flex items-center gap-2 animate-[fadeIn_0.2s]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all mt-4
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'
              }`}
          >
            {isLoading ? '验证中...' : '登录系统'}
          </button>
        </form>
      </div>
    </Modal>
  );
};
