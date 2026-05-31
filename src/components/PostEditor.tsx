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
    <div
      style={{
        padding: '16px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        height: '100%',
        minHeight: '620px',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        textAlign: 'left'
      }}
    >
      {/* 头部状态与字数统计 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', transition: 'border-color 0.4s' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--text-muted)' }}>
            DRAFT ARTICLE / 草稿创作
          </h3>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>已发字数: {draft.content.length} 字</span>
      </div>

      {/* 标题输入 - 宣纸级去框超大输入域 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <input
          type="text"
          placeholder="给你的内容起一个引人注目的标题吧..."
          value={draft.title}
          onChange={handleTitleChange}
          className="borderless-input"
          style={{
            fontSize: '24px',
            fontWeight: '800',
            color: 'var(--text-main)',
            paddingBottom: '8px',
            width: '100%',
            transition: 'border-bottom-color 0.3s ease'
          }}
        />
      </div>

      {/* 正文输入 - 极简宽距沉沉浸式 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <textarea
          placeholder="在此处撰写文章的原创段落核心观点，可附带表情 Emoji 与话题讨论..."
          value={draft.content}
          onChange={handleContentChange}
          rows={12}
          style={{
            lineHeight: '1.8',
            fontSize: '15px',
            resize: 'none',
            flex: 1,
            background: 'transparent',
            border: 'none',
            padding: '8px 0px',
            color: 'var(--text-main)',
            outline: 'none',
            boxShadow: 'none',
            fontFamily: 'var(--font-sans)',
            transition: 'color 0.4s'
          }}
        />
      </div>

      {/* 媒体资源与标签管理 - 整合为一行，降低视觉噪音 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px dashed var(--border-light)', paddingTop: '16px' }}>
        {/* 左侧：图片媒体附着 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Image size={13} /> 媒体资源管理器 ({draft.images.length}/9)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            {draft.images.map((img, idx) => (
              <div key={idx} style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <img src={img} alt="attached" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  onClick={() => handleRemoveImage(img)}
                  style={{
                    position: 'absolute', top: '1px', right: '1px',
                    background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                    color: '#fff', width: '12px', height: '12px', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '8px'
                  }}
                >
                  <X size={8} />
                </button>
              </div>
            ))}
            {draft.images.length < 9 && (
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {PRESET_IMAGES.filter(img => !draft.images.includes(img)).slice(0, 2).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAddPresetImage(img)}
                    style={{
                      width: '26px', height: '26px', borderRadius: '4px', overflow: 'hidden',
                      cursor: 'pointer', border: '1px solid var(--border-light)', opacity: 0.6,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                    title="点击快速添加推荐插图"
                  >
                    <img src={img} alt="preset" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 右侧：话题标签 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
            🏷️ 话题标签讨论
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
            {draft.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px',
                  background: 'rgba(var(--accent-primary-rgb), 0.1)',
                  border: '1px solid rgba(var(--accent-primary-rgb), 0.2)',
                  color: 'var(--accent-primary)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  transition: 'all 0.4s'
                }}
              >
                #{tag}
                <X size={8} style={{ cursor: 'pointer' }} onClick={() => handleRemoveTag(tag)} />
              </span>
            ))}
            <form onSubmit={handleAddTag} style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="+ 话题"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                style={{ padding: '1px 4px', fontSize: '10px', borderRadius: '4px', width: '60px', height: '18px', border: '1px solid var(--border-light)' }}
              />
            </form>
          </div>
        </div>
      </div>

      {/* 底部融合工具栏 (Action Bar) - 极简大气，主流审美 */}
      <div
        style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginTop: 'auto'
        }}
      >
        {/* 左侧平台图标微章列表 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>分发矩阵:</span>
          {accounts.map(acc => {
            const isSelected = selectedPlatforms.includes(acc.platform);
            const isConnected = acc.status === 'connected';

            return (
              <button
                key={acc.id}
                onClick={() => isConnected && handlePlatformToggle(acc.platform)}
                disabled={!isConnected}
                style={{
                  background: isSelected ? 'var(--tab-active-bg)' : 'transparent',
                  border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: isConnected ? 'pointer' : 'not-allowed',
                  opacity: isConnected ? 1 : 0.35,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  outline: 'none',
                  padding: 0
                }}
                title={isConnected ? `分发至 ${acc.platformName} (${acc.username})` : `${acc.platformName} (未连接)`}
              >
                <img src={acc.avatar} alt="platform-avatar" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />
                {/* 选中指示小微标 */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      background: 'var(--accent-primary)',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '2px solid var(--bg-secondary)',
                      boxShadow: '0 0 4px var(--accent-primary)'
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* 右侧定时发布与一键分发动作 */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            className="btn-secondary"
            onClick={() => setShowScheduleInput(!showScheduleInput)}
            style={{ width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}
            title="队列定时发布任务"
          >
            <Calendar size={15} />
          </button>

          <button
            className="btn-primary"
            onClick={handlePublishClick}
            disabled={isPublishing || selectedPlatforms.length === 0}
            style={{
              padding: '10px 24px',
              borderRadius: '10px',
              fontSize: '13px',
              opacity: selectedPlatforms.length === 0 ? 0.6 : 1,
              minWidth: '160px',
              justifyContent: 'center'
            }}
          >
            {isPublishing ? (
              <>
                <RefreshCw size={14} className="spin-animation" />
                正在并行分发...
              </>
            ) : (
              <>
                <Send size={14} />
                一键多端发布
              </>
            )}
          </button>
        </div>
      </div>

      {/* 定时发布输入栏滑动抽出来 */}
      {showScheduleInput && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: 'var(--input-bg)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            animation: 'slideDown 0.3s ease',
            transition: 'all 0.4s',
            marginTop: '8px'
          }}
        >
          <AlertCircle size={14} style={{ color: 'var(--accent-secondary)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>设定排期:</span>
          <input
            type="datetime-local"
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            style={{ padding: '6px 10px', fontSize: '11px', flex: 1, borderRadius: '6px' }}
          />
          {scheduleTime && (
            <button
              className="btn-primary"
              onClick={() => {
                alert(`成功排期！内容将于 ${new Date(scheduleTime).toLocaleString()} 自动在所选渠道静默推送！`);
                setShowScheduleInput(false);
              }}
              style={{ padding: '6px 12px', fontSize: '11px', background: 'var(--accent-secondary)', borderRadius: '6px' }}
            >
              确认定时
            </button>
          )}
        </div>
      )}
    </div>
  );
};
