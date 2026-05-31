import React, { useState } from 'react';
import { Eye, Sparkles, ShieldCheck } from 'lucide-react';

interface SidebarTabsProps {
  previewComponent: React.ReactNode;
  aiComponent: React.ReactNode;
  accountsComponent: React.ReactNode;
}

export const SidebarTabs: React.FC<SidebarTabsProps> = ({
  previewComponent,
  aiComponent,
  accountsComponent
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'ai' | 'accounts'>('preview');

  const tabs = [
    { id: 'preview', label: '实时预览', icon: <Eye size={16} />, component: previewComponent },
    { id: 'ai', label: 'AI风格室', icon: <Sparkles size={16} />, component: aiComponent },
    { id: 'accounts', label: '矩阵安全', icon: <ShieldCheck size={16} />, component: accountsComponent }
  ] as const;

  return (
    <div
      className="glass-card-modern"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: '100%',
        minHeight: '620px',
        textAlign: 'left'
      }}
    >
      {/* 选项卡头部 */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-light)',
          paddingBottom: '2px',
          position: 'relative',
          gap: '8px'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 6px',
                border: 'none',
                background: 'transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                outline: 'none'
              }}
            >
              {tab.icon}
              <span style={{ whiteSpace: 'nowrap' }}>{tab.label}</span>
              
              {/* 微动效下划线 */}
              {isActive && (
                <div
                  className="tab-active-indicator"
                  style={{
                    left: 0,
                    right: 0,
                    bottom: '-1px',
                    height: '2px'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 选项卡内容区 (带平滑淡入动效) */}
      <div
        style={{
          flex: 1,
          animation: 'fadeIn 0.3s ease',
          display: 'flex',
          flexDirection: 'column'
        }}
        key={activeTab} // 触发切换时的淡入动画
      >
        {tabs.find(t => t.id === activeTab)?.component}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
