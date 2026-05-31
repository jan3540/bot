import { useState } from 'react';
import { Sparkles, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { convertToXiaohongshu, convertToWeibo, convertToWeChat, convertToBilibili } from '../utils/aiAdapters';
import type { AIAdaptationResult } from '../utils/aiAdapters';

interface AIStudioProps {
  draftTitle: string;
  draftContent: string;
  onApplyAIResult: (result: AIAdaptationResult, platform: 'xiaohongshu' | 'weibo' | 'wechat' | 'bilibili') => void;
}

export const AIStudio: React.FC<AIStudioProps> = ({
  draftTitle,
  draftContent,
  onApplyAIResult
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'xiaohongshu' | 'weibo' | 'wechat' | 'bilibili'>('xiaohongshu');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<AIAdaptationResult | null>(null);
  const [displayedContent, setDisplayedContent] = useState('');

  const handleGenerate = () => {
    if (!draftContent.trim()) return;

    setIsGenerating(true);
    setGeneratedResult(null);
    setDisplayedContent('');

    // 计算改写结果
    let result: AIAdaptationResult;
    switch (selectedTarget) {
      case 'xiaohongshu':
        result = convertToXiaohongshu(draftTitle, draftContent);
        break;
      case 'weibo':
        result = convertToWeibo(draftTitle, draftContent);
        break;
      case 'wechat':
        result = convertToWeChat(draftTitle, draftContent);
        break;
      case 'bilibili':
        result = convertToBilibili(draftTitle, draftContent);
        break;
    }

    // 模拟流式大模型打字生成体验 (1.5秒完成)
    setTimeout(() => {
      setGeneratedResult(result);
      setIsGenerating(false);
      
      let index = 0;
      const fullText = result.content;
      const interval = setInterval(() => {
        if (index < fullText.length) {
          setDisplayedContent((prev) => prev + fullText[index]);
          index += 5; // 每次显示5个字符加速体验
        } else {
          setDisplayedContent(fullText);
          clearInterval(interval);
        }
      }, 20);
    }, 1200);
  };

  const handleApply = () => {
    if (generatedResult) {
      onApplyAIResult(generatedResult, selectedTarget);
    }
  };

  const platformNames = {
    xiaohongshu: '小红书',
    weibo: '新浪微博',
    wechat: '微信公众号',
    bilibili: '哔哩哔哩'
  };

  return (
    <div className="glass-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} style={{ color: 'var(--accent-secondary)' }} />
          AI 多矩阵风格实验室
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          ✨ 一键将您的草稿精准转译为各个主流平台爆款排版与语气调性
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: 500 }}>转译调性目标:</span>
        <select
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value as any)}
          style={{
            flex: 1,
            padding: '8px 12px',
            cursor: 'pointer',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-light)',
            color: 'var(--text-main)',
            borderRadius: '8px',
            outline: 'none',
            fontSize: '13px',
            fontWeight: 500,
            transition: 'all 0.4s'
          }}
        >
          <option value="xiaohongshu" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>小红书风 (丰富表情、种草卡片)</option>
          <option value="weibo" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>微博风 (精简痛点、爆款体话题)</option>
          <option value="wechat" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>微信公众号 (深度段落、结构引用)</option>
          <option value="bilibili" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>哔哩哔哩动态 (召唤三连、省流助手)</option>
        </select>

        <button
          className="btn-primary"
          onClick={handleGenerate}
          disabled={isGenerating || !draftContent.trim()}
          style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, var(--accent-secondary) 0%, #0891b2 100%)',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.25)',
            opacity: !draftContent.trim() ? 0.6 : 1
          }}
        >
          {isGenerating ? <RefreshCw size={14} className="spin-animation" /> : <Sparkles size={14} />}
          AI 生成
        </button>
      </div>

      <div
        style={{
          flex: 1,
          background: 'rgba(0,0,0,0.12)',
          border: '1px solid var(--border-light)',
          borderRadius: '12px',
          padding: '16px',
          fontFamily: 'var(--font-sans)',
          fontSize: '13px',
          overflowY: 'auto',
          minHeight: '180px',
          maxHeight: '300px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: displayedContent || isGenerating ? 'flex-start' : 'center',
          alignItems: displayedContent || isGenerating ? 'stretch' : 'center',
          color: 'var(--text-main)',
          transition: 'all 0.4s'
        }}
      >
        {isGenerating && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: 'var(--text-muted)' }}>
            <Sparkles size={24} className="pulse-glow spin-animation" style={{ color: 'var(--accent-secondary)' }} />
            <span>智能多维重写中，正在自适应排版规范...</span>
          </div>
        )}

        {!isGenerating && !displayedContent && (
          <span style={{ color: 'var(--text-dark)', textAlign: 'center' }}>
            在此选择平台并点击上方“AI生成”<br />即刻解锁各平台专属定制内容！
          </span>
        )}

        {displayedContent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border-light)', fontWeight: 600, color: 'var(--accent-secondary)' }}>
              🎯 生成平台: {platformNames[selectedTarget]}风格
            </div>
            {generatedResult?.title && (
              <div style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>
                标题: {generatedResult.title}
              </div>
            )}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: 'var(--text-main)' }}>
              {displayedContent}
              {displayedContent.length < (generatedResult?.content.length || 0) && <span className="terminal-cursor" />}
            </div>
            {generatedResult?.tags && generatedResult.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                {generatedResult.tags.map((tag, idx) => (
                  <span key={idx} style={{ color: 'var(--accent-secondary)', background: 'rgba(6, 182, 212, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {displayedContent && !isGenerating && (
        <button
          className="btn-primary"
          onClick={handleApply}
          style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #6d28d9 100%)' }}
        >
          <Check size={16} />
          同步应用改写结果至主编辑器
          <ArrowRight size={14} />
        </button>
      )}

      <style>{`
        .spin-animation {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
