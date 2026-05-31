import { useState } from 'react';
import type { PlatformAccount } from '../utils/mockData';
import { ShieldCheck, Plus, CheckCircle, AlertTriangle, XCircle, Trash2, Key } from 'lucide-react';

interface AccountManagerProps {
  accounts: PlatformAccount[];
  onToggleStatus: (id: string) => void;
  onAddAccount: (account: Omit<PlatformAccount, 'id'>) => void;
  onDeleteAccount: (id: string) => void;
}

export const AccountManager: React.FC<AccountManagerProps> = ({
  accounts,
  onToggleStatus,
  onAddAccount,
  onDeleteAccount
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlatform, setNewPlatform] = useState<'xiaohongshu' | 'weibo' | 'wechat' | 'bilibili'>('xiaohongshu');
  const [newUsername, setNewUsername] = useState('');
  const [newCookie, setNewCookie] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const avatars = {
      xiaohongshu: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      weibo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      wechat: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      bilibili: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
    };

    const platformNames = {
      xiaohongshu: '小红书',
      weibo: '新浪微博',
      wechat: '微信公众号',
      bilibili: '哔哩哔哩'
    };

    onAddAccount({
      platform: newPlatform,
      platformName: platformNames[newPlatform],
      username: newUsername,
      avatar: avatars[newPlatform],
      status: newCookie.trim() ? 'connected' : 'disconnected',
      followers: '0',
      postsCount: 0
    });

    setNewUsername('');
    setNewCookie('');
    setShowAddModal(false);
  };

  const getStatusIcon = (status: PlatformAccount['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="status-icon success" size={16} style={{ color: 'var(--color-success)' }} />;
      case 'expired':
        return <AlertTriangle className="status-icon warning" size={16} style={{ color: 'var(--color-warning)' }} />;
      case 'disconnected':
        return <XCircle className="status-icon error" size={16} style={{ color: 'var(--color-error)' }} />;
    }
  };

  const getStatusText = (status: PlatformAccount['status']) => {
    switch (status) {
      case 'connected': return '正常连通';
      case 'expired': return '登录过期';
      case 'disconnected': return '未授权';
    }
  };

  return (
    <div className="account-manager-container glass-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} />
            账户矩阵安全卫士
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            🔒 本地 Cookie 独立隔离，不上传任何云端服务器
          </p>
        </div>
        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> 绑定账号
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '350px', paddingRight: '4px' }}>
        {accounts.map((account) => (
          <div
            key={account.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'var(--input-bg)',
              border: `1px solid ${account.status === 'connected' ? 'rgba(var(--accent-primary-rgb), 0.25)' : 'var(--border-light)'}`,
              borderRadius: '12px',
              transition: 'all 0.4s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={account.avatar}
                  alt={account.username}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-light)' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    right: '-2px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: account.status === 'connected' ? 'var(--color-success)' : account.status === 'expired' ? 'var(--color-warning)' : 'var(--color-error)',
                    border: '2px solid var(--bg-secondary)',
                    boxShadow: account.status === 'connected' ? '0 0 8px var(--color-success)' : 'none'
                  }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{account.username}</span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      color: 'var(--accent-primary)',
                      border: '1px solid rgba(139, 92, 246, 0.15)'
                    }}
                  >
                    {account.platformName}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '12px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  <span>粉丝: {account.followers}</span>
                  <span>已发: {account.postsCount} 篇</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                onClick={() => onToggleStatus(account.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--input-bg)',
                  border: '1px solid var(--border-light)',
                  fontSize: '12px',
                  userSelect: 'none',
                  transition: 'all 0.4s'
                }}
                title="点击切换授权状态以进行演示测试"
              >
                {getStatusIcon(account.status)}
                <span style={{ fontSize: '11px', color: account.status === 'connected' ? '#a7f3d0' : '#fca5a5' }}>
                  {getStatusText(account.status)}
                </span>
              </div>
              <button
                onClick={() => onDeleteAccount(account.id)}
                style={{ background: 'none', border: 'none', color: 'rgba(239, 68, 68, 0.6)', cursor: 'pointer', padding: '4px', borderRadius: '4px', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-error)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.6)'}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}
        >
          <div className="glass-card" style={{ padding: '24px', width: '90%', maxWidth: '400px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', transition: 'all 0.4s' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Key size={18} style={{ color: 'var(--accent-primary)' }} />
              绑定新矩阵账号
            </h4>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>目标平台</label>
                <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value as any)}>
                  <option value="xiaohongshu">小红书 (Xiaohongshu)</option>
                  <option value="weibo">新浪微博 (Weibo)</option>
                  <option value="wechat">微信公众号 (WeChat)</option>
                  <option value="bilibili">哔哩哔哩 (Bilibili)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)' }}>博主/运营昵称</label>
                <input
                  type="text"
                  placeholder="例如: 极客小明"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>本地加密 Session Cookie</span>
                  <span style={{ color: 'var(--color-success)', fontSize: '10px' }}>安全隔离加密</span>
                </label>
                <textarea
                  placeholder="填入登录 Cookie (选填，不填展示为未授权状态)"
                  value={newCookie}
                  onChange={(e) => setNewCookie(e.target.value)}
                  rows={3}
                  style={{ resize: 'none', fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '8px' }} onClick={() => setShowAddModal(false)}>
                  取消
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '8px', justifyContent: 'center' }}>
                  安全保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
