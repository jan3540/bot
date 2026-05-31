import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, Cpu, Play } from 'lucide-react';

interface TerminalConsoleProps {
  logs: string[];
  isPublishing: boolean;
  onClearLogs: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalConsole: React.FC<TerminalConsoleProps> = ({
  logs,
  isPublishing,
  onClearLogs,
  isOpen,
  onClose
}) => {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div
      className={`drawer-console ${isOpen ? 'drawer-active' : ''}`}
      style={{
        padding: '12px 24px 24px 24px',
        fontFamily: 'var(--font-mono)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.4), 0 -10px 40px rgba(0, 0, 0, 0.4)',
        textAlign: 'left'
      }}
    >
      {/* 顶部点击折叠的手势触控条 */}
      <div className="drawer-handle" onClick={onClose} title="点击收起控制台" />

      {/* 顶部动作区 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', transition: 'border-color 0.4s' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-secondary)' }}>
          <Terminal size={16} />
          <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px' }}>可视化跨平台分发仿真终端 (OmniEngine console)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isPublishing && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--accent-secondary)' }}>
              <Cpu size={12} className="spin-animation" />
              <span>引擎正在执行无头分发渲染...</span>
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
              transition: 'all 0.2s',
              outline: 'none'
            }}
          >
            <Trash2 size={12} /> 清理终端
          </button>
        </div>
      </div>

      {/* 日志流显示区 */}
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
            <Play size={18} />
            <span style={{ fontSize: '11px' }}>控制台空闲。请选择账号并在编辑器点击“一键多端发布”以唤出日志。</span>
          </div>
        ) : (
          logs.map((log, index) => {
            let color = '#d1d5db'; // text-gray-300
            if (log.includes('[SYSTEM]')) {
              color = 'var(--accent-primary)'; // accent color
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
