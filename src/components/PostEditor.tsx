import { useState } from 'react';
import type { DraftPost, PlatformAccount } from '../utils/mockData';
import { Send, Calendar, Image, X, AlertCircle, RefreshCw } from 'lucide-react';

interface PostEditorProps {
  draft: DraftPost;
  onChangeDraft: (draft: DraftPost) => void;
  accounts: PlatformAccount[];
  onPublish: (targetPlatforms: string[]) => void;
  isPublishing: boolean;
}

export const PostEditor: React.FC<PostEditorProps> = ({
  draft,
  onChangeDraft,
  accounts,
  onPublish,
  isPublishing
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['xiaohongshu', 'weibo']);
  const [newTag, setNewTag] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showScheduleInput, setShowScheduleInput] = useState(false);

  // 一些高颜值模拟配图供用户一键附加
  const PRESET_IMAGES = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&auto=format&fit=crop&q=80'
  ];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeDraft({ ...draft, title: e.target.value });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeDraft({ ...draft, content: e.target.value });
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !draft.tags.includes(newTag.trim())) {
      onChangeDraft({
        ...draft,
        tags: [...draft.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChangeDraft({
      ...draft,
      tags: draft.tags.filter(t => t !== tagToRemove)
    });
  };

  const handleAddPresetImage = (url: string) => {
    if (!draft.images.includes(url)) {
      onChangeDraft({
        ...draft,
        images: [...draft.images, url]
      });
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    onChangeDraft({
      ...draft,
      images: draft.images.filter(img => img !== urlToRemove)
    });
  };

  const handlePublishClick = () => {
    if (selectedPlatforms.length === 0) return;
    onPublish(selectedPlatforms);
  };

  return (
    <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      {/* 头部状态 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--accent-primary)' }}>
          创作编辑器 (Publisher Core)
        </h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>草稿已自动保存至本地</span>
      </div>

      {/* 标题输入 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>分发主标题</label>
        <input
          type="text"
          placeholder="给你的内容起一个引人注目的标题吧..."
          value={draft.title}
          onChange={handleTitleChange}
          style={{ fontSize: '15px', fontWeight: 600, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
        />
      </div>

      {/* 正文输入 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
          <span>原创正文内容 (支持富文本与 Emoji)</span>
          <span>当前字数: {draft.content.length} 字</span>
        </label>
        <textarea
          placeholder="在此处撰写文章的原创段落核心观点，可以是一篇长博文..."
          value={draft.content}
          onChange={handleContentChange}
          rows={10}
          style={{
            lineHeight: '1.6',
            resize: 'none',
            flex: 1,
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        />
      </div>

      {/* 图片资源管理器 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Image size={14} /> 媒体资源管理器 ({draft.images.length}/9)
        </label>
        
        {/* 已选图片展示 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {draft.images.map((img, idx) => (
            <div key={idx} style={{ position: 'relative', width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <img src={img} alt="attached" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                onClick={() => handleRemoveImage(img)}
                style={{
                  position: 'absolute', top: '2px', right: '2px',
                  background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                  color: '#fff', width: '16px', height: '16px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px'
                }}
              >
                <X size={10} />
              </button>
            </div>
          ))}

          {/* 快速添加预设图片库以丰富视觉效果 */}
          {draft.images.length < 9 && (
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-dark)', marginRight: '4px' }}>推荐配图:</span>
              {PRESET_IMAGES.filter(img => !draft.images.includes(img)).slice(0, 3).map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAddPresetImage(img)}
                  style={{
                    width: '32px', height: '32px', borderRadius: '6px', overflow: 'hidden',
                    cursor: 'pointer', border: '1px solid rgba(255,255,255,0.06)', opacity: 0.7,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                >
                  <img src={img} alt="preset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 标签管理 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>话题标签聚合</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', minHeight: '24px' }}>
          {draft.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: 'var(--accent-primary)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '11px'
              }}
            >
              #{tag}
              <X size={10} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)} />
            </span>
          ))}
          <form onSubmit={handleAddTag} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="+ 新建标签"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              style={{ padding: '2px 6px', fontSize: '11px', borderRadius: '4px', width: '80px', height: '22px' }}
            />
          </form>
        </div>
      </div>

      {/* 目标渠道与发布动作 */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>选择发布的目标渠道</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {accounts.map(acc => {
              const isSelected = selectedPlatforms.includes(acc.platform);
              const isConnected = acc.status === 'connected';

              return (
                <div
                  key={acc.id}
                  onClick={() => isConnected && handlePlatformToggle(acc.platform)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: isConnected ? 'pointer' : 'not-allowed',
                    opacity: isConnected ? 1 : 0.4,
                    userSelect: 'none',
                    transition: 'all 0.2s'
                  }}
                  title={isConnected ? '' : '请先在右侧面板授权登录此账户'}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    disabled={!isConnected}
                    style={{ cursor: isConnected ? 'pointer' : 'not-allowed', width: '14px', height: '14px' }}
                  />
                  <img src={acc.avatar} alt="platform-avatar" style={{ width: '18px', height: '18px', borderRadius: '50%' }} />
                  <span style={{ fontSize: '12px', fontWeight: 500 }}>{acc.platformName}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 按钮控制 */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn-primary"
            onClick={handlePublishClick}
            disabled={isPublishing || selectedPlatforms.length === 0}
            style={{ flex: 2, justifyContent: 'center', padding: '12px', fontSize: '14px', opacity: selectedPlatforms.length === 0 ? 0.6 : 1 }}
          >
            {isPublishing ? (
              <>
                <RefreshCw size={16} className="spin-animation" />
                正在智能并行分发中...
              </>
            ) : (
              <>
                <Send size={16} />
                一键多平台并行发布
              </>
            )}
          </button>
          
          <button
            className="btn-secondary"
            onClick={() => setShowScheduleInput(!showScheduleInput)}
            style={{ padding: '12px', display: 'flex', justifyContent: 'center' }}
            title="队列定时发布任务"
          >
            <Calendar size={16} />
          </button>
        </div>

        {showScheduleInput && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              animation: 'slideDown 0.3s ease'
            }}
          >
            <AlertCircle size={14} style={{ color: 'var(--accent-secondary)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>设定定时发布:</span>
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              style={{ padding: '6px', fontSize: '11px', flex: 1 }}
            />
            {scheduleTime && (
              <button
                className="btn-primary"
                onClick={() => {
                  alert(`成功排期！内容将于 ${new Date(scheduleTime).toLocaleString()} 自动在所选平台静默推送！`);
                  setShowScheduleInput(false);
                }}
                style={{ padding: '6px 12px', fontSize: '11px', background: 'var(--accent-secondary)' }}
              >
                确认定时
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
