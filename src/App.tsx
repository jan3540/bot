import { useState, useEffect } from 'react';
import { INITIAL_ACCOUNTS, INITIAL_DRAFT, getPublishingLogs } from './utils/mockData';
import type { PlatformAccount, DraftPost } from './utils/mockData';
import { Dashboard } from './components/Dashboard';
import { PostEditor } from './components/PostEditor';
import { PreviewSimulators } from './components/PreviewSimulators';
import { AccountManager } from './components/AccountManager';
import { AIStudio } from './components/AIStudio';
import { TerminalConsole } from './components/TerminalConsole';
import type { AIAdaptationResult } from './utils/aiAdapters';
import { Sparkles, Activity, Layers, ExternalLink, Palette } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'editor'>('dashboard');
  const [accounts, setAccounts] = useState<PlatformAccount[]>(INITIAL_ACCOUNTS);
  const [draft, setDraft] = useState<DraftPost>(INITIAL_DRAFT);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const [theme, setTheme] = useState<'warm-dark' | 'warm-light' | 'cyber-dark'>(() => {
    const saved = localStorage.getItem('omni-theme');
    return (saved as any) || 'warm-dark';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('omni-theme', theme);
  }, [theme]);

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

    try {
      const titleSafe = draft.title || '无标题发布';
      const fullLogs = getPublishingLogs(targetPlatforms, titleSafe);
      let currentLogIndex = 0;

      // 渐进式渲染日志以仿真 Puppeteer 运行状态
      const interval = setInterval(() => {
        try {
          if (currentLogIndex < fullLogs.length) {
            setLogs(prev => {
              const nextLog = fullLogs[currentLogIndex];
              return nextLog ? [...prev, nextLog] : prev;
            });
            currentLogIndex++;
          } else {
            clearInterval(interval);
            setIsPublishing(false);
            
            // 发布成功，动态为对应账户加 1 篇已发文章
            setAccounts(prev => {
              if (!Array.isArray(prev)) return prev;
              return prev.map(acc => {
                if (acc && acc.platform && targetPlatforms.includes(acc.platform)) {
                  return { ...acc, postsCount: (acc.postsCount || 0) + 1 };
                }
                return acc;
              });
            });

            showToast('恭喜！多平台矩阵一键分发与安全指纹推送圆满成功！', 'success');
          }
        } catch (innerError) {
          clearInterval(interval);
          setIsPublishing(false);
          console.error("Publishing interval runtime error:", innerError);
          showToast('分发日志流动过程中发生运行时异常，引擎已安全挂起。', 'error');
        }
      }, 250); // 每250ms输出一条极客日志
    } catch (err) {
      setIsPublishing(false);
      console.error("Failed to boot publishing logs engine:", err);
      showToast('启动多渠道分发引擎失败，请检查数据完整性。', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* 顶部绚丽导航栏 */}
      <header
        style={{
          borderBottom: '1px solid var(--border-light)',
          background: 'var(--header-bg)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          transition: 'background 0.4s ease, border-color 0.4s ease'
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
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
                boxShadow: '0 4px 12px rgba(var(--accent-primary-rgb), 0.25)',
                transition: 'all 0.4s ease'
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
          <div style={{ display: 'flex', gap: '8px', background: 'var(--tab-container-bg)', border: '1px solid var(--tab-container-border)', padding: '4px', borderRadius: '10px', transition: 'background 0.4s, border-color 0.4s' }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                background: activeTab === 'dashboard' ? 'var(--tab-active-bg)' : 'transparent',
                border: 'none',
                color: activeTab === 'dashboard' ? 'var(--text-main)' : 'var(--text-muted)',
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
                background: activeTab === 'editor' ? 'var(--tab-active-bg)' : 'transparent',
                border: 'none',
                color: activeTab === 'editor' ? 'var(--text-main)' : 'var(--text-muted)',
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

          {/* 右侧主题选择与小红标 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 动态主题切换器 (Segmented Controller) */}
            <div
              style={{
                display: 'flex',
                background: 'var(--tab-container-bg)',
                border: '1px solid var(--tab-container-border)',
                padding: '3px',
                borderRadius: '10px',
                alignItems: 'center',
                gap: '2px',
                transition: 'all 0.4s ease'
              }}
            >
              <Palette size={13} style={{ color: 'var(--text-muted)', marginLeft: '6px', marginRight: '4px' }} />
              {(['warm-dark', 'warm-light', 'cyber-dark'] as const).map((t) => {
                const names = {
                  'warm-dark': '暖阳大地',
                  'warm-light': '春日燕麦',
                  'cyber-dark': '极客幻彩'
                };
                const active = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    style={{
                      background: active ? 'var(--accent-primary)' : 'transparent',
                      color: active ? '#ffffff' : 'var(--text-muted)',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: active ? '600' : '400',
                      transition: 'all 0.3s ease',
                      outline: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {names[t]}
                  </button>
                );
              })}
            </div>

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
                border: '1px solid var(--border-light)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.background = 'var(--tab-active-bg)'; }}
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
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--glass-shadow)',
            borderRadius: '12px',
            padding: '16px 20px',
            zIndex: 9999,
            color: 'var(--text-main)',
            fontSize: '13px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            transition: 'all 0.4s'
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
