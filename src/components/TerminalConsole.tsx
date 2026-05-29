import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, Cpu, Play } from 'lucide-react';

interface TerminalConsoleProps {
  logs: string[];
  isPublishing: boolean;
  onClearLogs: () => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  logs,
  isPublishing,
  onClearLogs
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div
      className="glass-card"
      style={{
        background: '#04060f',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        borderRadius: '16px',
        padding: '20px',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        height: '300px',
        boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8), var(--glass-shadow)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)' }}>
          <Terminal size={18} />
          <span style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>可视化跨平台分发仿真终端 (OmniEngine console)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isPublishing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-secondary)' }}>
              <Cpu size={12} className="spin-animation" />
              <span>引擎正在执行无头渲染...</span>
            </div>
          )}
          <button
            onClick={onClearLogs}
            disabled={isPublishing || logs.length === 0}
            style={{
              background: 'none',
              border: 'none',
              color: logs.length > 0 && !isPublishing ? 'var(--text-muted)' : 'var(--text-dark)',
              cursor: logs.length > 0 && !isPublishing ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              transition: 'all 0.2s'
            }}
          >
            <Trash2 size={12} /> 清理终端
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '6px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          fontSize: '12px',
          lineHeight: '1.5',
          textAlign: 'left'
        }}
      >
        {logs.length === 0 ? (
          <div style={{ margin: 'auto', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Play size={20} />
            <span>就绪。在上方编辑器中勾选分发账号并点击“一键多平台发布”，此处将输出自动化推送日志。</span>
          </div>
        ) : (
          logs.map((log, index) => {
            let color = '#d1d5db'; // text-gray-300
            if (log.includes('[SYSTEM]')) {
              color = '#a78bfa'; // accent purple
            } else if (log.includes('[XIAOHONGSHU]') || log.includes('[小红书]')) {
              color = '#f87171'; // red/pink
            } else if (log.includes('[WEIBO]') || log.includes('[微博]')) {
              color = '#fbbf24'; // yellow
            } else if (log.includes('[WECHAT]') || log.includes('[微信]')) {
              color = '#34d399'; // green
            } else if (log.includes('[BILIBILI]') || log.includes('[哔哩哔哩]')) {
              color = '#60a5fa'; // light blue
            }

            if (log.trim() === '') return <div key={index} style={{ height: '8px' }} />;

            return (
              <div key={index} style={{ color, whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }}>
                {log}
              </div>
            );
          })
        )}
        {isPublishing && <div className="terminal-cursor" style={{ width: '8px', height: '14px', backgroundColor: 'var(--accent-secondary)' }} />}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};
