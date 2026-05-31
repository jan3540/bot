import React, { useState } from 'react';
import type { DraftPost, PlatformAccount } from '../utils/mockData';
import { Send, Calendar, Image, X, AlertCircle, RefreshCw, Crop, Wand2, ShieldCheck, Check } from 'lucide-react';

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

  // 1. 画幅裁剪模块状态
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedCropImg, setSelectedCropImg] = useState<string | null>(null);
  const [cropRatio, setCropRatio] = useState<'3:4' | '2.35:1' | '1:1' | '16:9'>('3:4');
  const [cropping, setCropping] = useState(false);

  // 2. AI 智能海报封面生成器状态
  const [generatingPoster, setGeneratingPoster] = useState(false);

  // 3. 防风控/防截流高级配置
  const [enableJitter, setEnableJitter] = useState(true);
  const [enableABVariation, setEnableABVariation] = useState(true);
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);

  // 一些高颜值模拟配图
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

  // 一键渲染排版 AI 封面海报
  const handleGeneratePoster = () => {
    const textToUse = draft.title || '春日自媒体灵感创作';
    setGeneratingPoster(true);
    
    // 模拟高阶 Canvas 封面绘制渲染时间
    setTimeout(() => {
      // 选取一个极其高大气的 Unsplash 背景图，代表渲染成功的 AI 海报封面
      const highEndPosters = [
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80'
      ];
      const randomPoster = highEndPosters[Math.floor(Math.random() * highEndPosters.length)];
      
      onChangeDraft({
        ...draft,
        images: [randomPoster, ...draft.images]
      });
      
      setGeneratingPoster(false);
      alert(`AI 海报封面生成完毕！已成功为标题「${textToUse}」进行春日燕麦美学智能排版并自动附加至草稿首图！`);
    }, 1200);
  };

  // 模拟裁剪保存
  const handleSaveCrop = () => {
    if (!selectedCropImg) return;
    setCropping(true);
    setTimeout(() => {
      // 模拟将裁剪后的图替换回去
      alert(`已将图片成功裁剪为【小红书 ${cropRatio}】主流审美画幅！噪点已自动填充。`);
      setCropping(false);
      setShowCropModal(false);
      setSelectedCropImg(null);
    }, 900);
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
            DRAFT ARTICLE / 草稿画布
          </h3>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>字数计数: {draft.content.length} 字</span>
      </div>

      {/* 标题输入 - 去框沉浸式 */}
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

      {/* 正文输入 - 极简宽距 */}
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

      {/* 媒体管理器与标签聚合 - 整合底置防臃肿 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', borderTop: '1px dashed var(--border-light)', paddingTop: '16px' }}>
        {/* 左侧：多媒体附加，含裁剪与AI封面 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Image size={13} /> 媒体资源管理器 ({draft.images.length}/9)
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {draft.images.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedCropImg(draft.images[0]);
                    setShowCropModal(true);
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', outline: 'none' }}
                >
                  <Crop size={10} /> 画幅裁切
                </button>
              )}
              <button
                onClick={handleGeneratePoster}
                disabled={generatingPoster}
                style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', outline: 'none' }}
              >
                {generatingPoster ? <RefreshCw size={10} className="spin-animation" /> : <Wand2 size={10} />}
                AI 海报封面
              </button>
            </div>
          </div>

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
            🏷️ 话题讨论与平台聚合标签
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
                placeholder="+ 标签"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                style={{ padding: '1px 4px', fontSize: '10px', borderRadius: '4px', width: '60px', height: '18px', border: '1px solid var(--border-light)' }}
              />
            </form>
          </div>
        </div>
      </div>

      {/* 底部高级配置面板折叠触发 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
        <button
          onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', outline: 'none' }}
        >
          <ShieldCheck size={13} style={{ color: 'var(--color-success)' }} />
          <span>防风控高级安全策略设定 {showAdvancedConfig ? '▼' : '▲'}</span>
        </button>
        {enableJitter && enableABVariation && (
          <span style={{ fontSize: '10px', color: 'var(--color-success)', fontWeight: 'bold' }}>🛡️ 安全防风控盾已启动保护</span>
        )}
      </div>

      {/* 高级策略面板展开展现 */}
      {showAdvancedConfig && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--input-bg)', border: '1px solid var(--border-light)', padding: '16px', borderRadius: '16px', animation: 'slideUp 0.3s ease' }}>
          {/* 1. 错峰时序抖动开关 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>防关联错峰时序队列 (Safe Jitter Queue)</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>自动对不同分发渠道添加随机延迟，防止同秒发布引发的限流</div>
            </div>
            <input
              type="checkbox"
              checked={enableJitter}
              onChange={(e) => setEnableJitter(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
          </div>
          {enableJitter && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-light)', borderRadius: '8px', padding: '8px 12px', fontSize: '10px', display: 'flex', gap: '16px', color: 'var(--accent-secondary)' }}>
              <span>小红书: +2分钟</span>
              <span>微博: +7分钟</span>
              <span>公众号: +14分钟</span>
            </div>
          )}

          {/* 2. A/B 变体微调改写 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-light)', paddingTop: '10px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600 }}>AI 同质化 A/B 文本置换 (Variant Protection)</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>利用 AI 对各个渠道生成 5% 的形容词句式微调，避免雷同审查</div>
            </div>
            <input
              type="checkbox"
              checked={enableABVariation}
              onChange={(e) => setEnableABVariation(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
          </div>
          {enableABVariation && (
            <div style={{ fontSize: '10px', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-light)', borderRadius: '8px', color: 'var(--text-muted)' }}>
              <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '4px', marginBottom: '4px', fontWeight: 600 }}>A/B 差异化改写即时效果预览:</div>
              <div><strong>原标题</strong>: {draft.title || '无标题草稿'}</div>
              <div style={{ color: 'var(--accent-primary)', marginTop: '4px' }}><strong>小红书变体</strong>: {draft.title ? `✨家人们！${draft.title}` : '✨家人们！自媒体矩阵分发爆款攻略'}</div>
            </div>
          )}
        </div>
      )}

      {/* 底部融合工具栏 (Action Bar) - 极简大气 */}
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

      {/* 画幅裁剪模态窗 */}
      {showCropModal && selectedCropImg && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div className="glass-card" style={{ padding: '24px', width: '90%', maxWidth: '440px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', transition: 'all 0.4s' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crop size={18} style={{ color: 'var(--accent-primary)' }} />
              自媒体图片画幅裁剪模拟器
            </h4>

            {/* 裁剪预览大图 */}
            <div style={{ position: 'relative', width: '100%', height: '240px', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <img src={selectedCropImg} alt="crop-preview" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.8 }} />
              
              {/* 模拟裁剪框阴影罩 */}
              <div
                style={{
                  position: 'absolute',
                  top: cropRatio === '3:4' ? '20px' : cropRatio === '1:1' ? '40px' : cropRatio === '16:9' ? '70px' : '90px',
                  bottom: cropRatio === '3:4' ? '20px' : cropRatio === '1:1' ? '40px' : cropRatio === '16:9' ? '70px' : '90px',
                  left: cropRatio === '2.35:1' ? '20px' : cropRatio === '1:1' ? '120px' : cropRatio === '16:9' ? '40px' : '80px',
                  right: cropRatio === '2.35:1' ? '20px' : cropRatio === '1:1' ? '120px' : cropRatio === '16:9' ? '40px' : '80px',
                  border: '2px dashed var(--accent-primary)',
                  boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                  transition: 'all 0.3s ease'
                }}
              />
            </div>

            {/* 比例选择切换 */}
            <div style={{ display: 'flex', gap: '8px', margin: '16px 0', background: 'var(--tab-container-bg)', padding: '4px', borderRadius: '8px' }}>
              {(['3:4', '1:1', '16:9', '2.35:1'] as const).map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setCropRatio(ratio)}
                  style={{
                    flex: 1, padding: '6px', border: 'none', borderRadius: '6px',
                    background: cropRatio === ratio ? 'var(--accent-primary)' : 'transparent',
                    color: cropRatio === ratio ? '#fff' : 'var(--text-muted)',
                    fontSize: '11px', fontWeight: 600, cursor: 'pointer', outline: 'none'
                  }}
                >
                  {ratio === '3:4' ? '小红书 3:4' : ratio === '1:1' ? '微博 1:1' : ratio === '16:9' ? 'B站 16:9' : '微信 2.35:1'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, padding: '8px' }}
                onClick={() => {
                  setShowCropModal(false);
                  setSelectedCropImg(null);
                }}
              >
                取消
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ flex: 1, padding: '8px', justifyContent: 'center' }}
                onClick={handleSaveCrop}
                disabled={cropping}
              >
                {cropping ? <RefreshCw size={12} className="spin-animation" /> : <Check size={12} />}
                {cropping ? '正在处理裁剪...' : '保存裁剪结果'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
