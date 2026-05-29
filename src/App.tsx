import { useState } from 'react';
import { INITIAL_ACCOUNTS, INITIAL_DRAFT, getPublishingLogs } from './utils/mockData';
import type { PlatformAccount, DraftPost } from './utils/mockData';
import { Dashboard } from './components/Dashboard';
import { PostEditor } from './components/PostEditor';
import { PreviewSimulators } from './components/PreviewSimulators';
import { AccountManager } from './components/AccountManager';
import { AIStudio } from './components/AIStudio';
import { TerminalConsole } from './components/TerminalConsole';
import type { AIAdaptationResult } from './utils/aiAdapters';
import { Sparkles, Activity, Layers, ExternalLink } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'editor'>('dashboard');
  const [accounts, setAccounts] = useState<PlatformAccount[]>(INITIAL_ACCOUNTS);
  const [draft, setDraft] = useState<DraftPost>(INITIAL_DRAFT);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    // 4秒后自动淡出消失
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  // 账号管理操作
  const handleToggleStatus = (id: string) => {
    setAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        const nextStatus: PlatformAccount['status'] = 
          acc.status === 'connected' ? 'disconnected' : 'connected';
        return { ...acc, status: nextStatus };
      }
      return acc;
    }));
  };

  const handleAddAccount = (newAcc: Omit<PlatformAccount, 'id'>) => {
    const accountWithId: PlatformAccount = {
      ...newAcc,
      id: `acc-${Date.now()}`
    };
    setAccounts(prev => [...prev, accountWithId]);
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  // AI 风格应用
  const handleApplyAIResult = (result: AIAdaptationResult, platform: 'xiaohongshu' | 'weibo' | 'wechat' | 'bilibili') => {
    setDraft({
      ...draft,
      title: result.title,
      content: result.content,
      tags: result.tags
    });
    const names = { xiaohongshu: '小红书', weibo: '新浪微博', wechat: '微信公众号', bilibili: '哔哩哔哩' };
    showToast(`成功！已将 AI 改写的【${names[platform]}风格】完美同步至主编辑器。`, 'info');
  };

  // 仿真发布
  const handlePublish = (targetPlatforms: string[]) => {
    if (targetPlatforms.length === 0) return;
    
    setIsPublishing(true);
    setLogs([]);

    const fullLogs = getPublishingLogs(targetPlatforms, draft.title);
    let currentLogIndex = 0;

    // 渐进式渲染日志以仿真 Puppeteer 运行状态
    const interval = setInterval(() => {
      if (currentLogIndex < fullLogs.length) {
        setLogs(prev => [...prev, fullLogs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsPublishing(false);
        
        // 发布成功，动态为对应账户加 1 篇已发文章
        setAccounts(prev => prev.map(acc => {
          if (targetPlatforms.includes(acc.platform)) {
            return { ...acc, postsCount: acc.postsCount + 1 };
          }
          return acc;
        }));

        showToast('恭喜！多平台矩阵一键分发与安全指纹推送圆满成功！', 'success');
      }
    }, 250); // 每250ms输出一条极客日志
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* 顶部绚丽导航栏 */}
      <header
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(9, 10, 15, 0.8)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {/* Logo 区域 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}
            >
              <Layers size={18} style={{ color: '#fff' }} />
            </div>
            <div>
              <h1
                className="gradient-text"
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  margin: 0,
                  letterSpacing: '0.5px',
                  lineHeight: '1.2'
                }}
              >
                OmniPublisher
              </h1>
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 600 }}>
                暑期实训营 MVP 创新作品
              </div>
            </div>
          </div>

          {/* 导航标签切换 */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                background: activeTab === 'dashboard' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: 'none',
                color: activeTab === 'dashboard' ? '#fff' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Activity size={14} /> 数据分析大盘
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              style={{
                background: activeTab === 'editor' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                border: 'none',
                color: activeTab === 'editor' ? '#fff' : 'var(--text-muted)',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Sparkles size={14} /> 智能多平台创作
            </button>
          </div>

          {/* 右侧小红标 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="https://github.com/gitcoffee-os/postbot"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.03)',
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              参考 PostBot <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </header>

      {/* 主面板内容区 */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {activeTab === 'dashboard' ? (
          <Dashboard
            accounts={accounts}
            onViewEditor={() => setActiveTab('editor')}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 上部双栏布局 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
              
              {/* 最左侧：创作编辑器 */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <PostEditor
                  draft={draft}
                  onChangeDraft={setDraft}
                  accounts={accounts}
                  onPublish={handlePublish}
                  isPublishing={isPublishing}
                />
              </div>

              {/* 中间/右侧：实时模拟预览器与 AI 实验室叠拼 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <PreviewSimulators
                  title={draft.title}
                  content={draft.content}
                  tags={draft.tags}
                  images={draft.images}
                />
                
                {/* 账号管理器 */}
                <AccountManager
                  accounts={accounts}
                  onToggleStatus={handleToggleStatus}
                  onAddAccount={handleAddAccount}
                  onDeleteAccount={handleDeleteAccount}
                />
              </div>

              {/* 右侧：AI 改写风格适配器 */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <AIStudio
                  draftTitle={draft.title}
                  draftContent={draft.content}
                  onApplyAIResult={handleApplyAIResult}
                />
              </div>
            </div>

            {/* 下部：可视化极客仿真发布控制台 */}
            <div>
              <TerminalConsole
                logs={logs}
                isPublishing={isPublishing}
                onClearLogs={() => setLogs([])}
              />
            </div>
          </div>
        )}
      </main>

      {/* 底部信息 */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '20px',
          fontSize: '11px',
          color: 'var(--text-dark)',
          textAlign: 'center',
          marginTop: 'auto'
        }}
      >
        OmniPublisher Studio © 2026. 专为暑期实训选拔匠心打造. Made with ♥ for high-performance self-media creators.
      </footer>

      {/* 极简玻璃拟物通知组件 */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: 'rgba(18, 20, 32, 0.85)',
            backdropFilter: 'blur(16px)',
            border: toast.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            padding: '16px 20px',
            zIndex: 9999,
            color: '#fff',
            fontSize: '13px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <span style={{ fontSize: '18px' }}>{toast.type === 'success' ? '🎉' : '✨'}</span>
          <div>{toast.message}</div>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '16px',
              marginLeft: '10px',
              padding: '0 4px'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
