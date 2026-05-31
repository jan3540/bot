import { useState } from 'react';
import { Eye, Heart, MessageCircle, Share2, Award, Star } from 'lucide-react';

interface PreviewSimulatorsProps {
  title: string;
  content: string;
  tags: string[];
  images: string[];
}

export const PreviewSimulators: React.FC<PreviewSimulatorsProps> = ({
  title,
  content,
  tags,
  images
}) => {
  const [activePlatform, setActivePlatform] = useState<'xiaohongshu' | 'weibo' | 'wechat' | 'bilibili'>('xiaohongshu');

  // 格式化文本为带话题的HTML或段落
  const formatHashtags = (text: string) => {
    if (!text) return '';
    // 替换换行为 br
    let formatted = text.replace(/\n/g, '<br />');
    // 解析 #话题 为蓝色高亮
    formatted = formatted.replace(/(#[\u4e00-\u9fa5a-zA-Z0-9_-]+)/g, '<span style="color: #3b82f6; cursor: pointer;">$1</span>');
    return formatted;
  };

  const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="glass-card" style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={20} style={{ color: 'var(--accent-secondary)' }} />
            多端实时渲染仿真视口
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            📱 实时对比渲染各终端视窗效果，保障全网排版零变形
          </p>
        </div>
      </div>

      {/* 平台切换 Tab */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--tab-container-bg)', padding: '4px', borderRadius: '10px', border: '1px solid var(--tab-container-border)', transition: 'all 0.4s' }}>
        {(['xiaohongshu', 'weibo', 'wechat', 'bilibili'] as const).map((plat) => {
          const names = { xiaohongshu: '小红书', weibo: '新浪微博', wechat: '微信公众号', bilibili: '哔哩哔哩' };
          const activeColor = {
            xiaohongshu: 'var(--color-error)',
            weibo: 'var(--color-warning)',
            wechat: 'var(--color-success)',
            bilibili: 'var(--color-info)'
          };
          const isActive = activePlatform === plat;
          return (
            <button
              key={plat}
              onClick={() => setActivePlatform(plat)}
              style={{
                flex: 1,
                padding: '8px 10px',
                border: 'none',
                borderRadius: '8px',
                background: isActive ? activeColor[plat] : 'transparent',
                color: isActive ? '#fff' : 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: isActive ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {names[plat]}
            </button>
          );
        })}
      </div>

      {/* 视口展示区 */}
      <div
        style={{
          flex: 1,
          background: 'rgba(0, 0, 0, 0.15)',
          border: '1px solid var(--border-light)',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '20px',
          overflowY: 'auto',
          minHeight: '400px',
          maxHeight: '520px',
          transition: 'all 0.4s'
        }}
      >
        {/* 小红书手机端模拟 */}
        {activePlatform === 'xiaohongshu' && (
          <div
            style={{
              width: '320px',
              background: '#fff',
              color: '#111',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
              border: '8px solid #2e3039',
              textAlign: 'left',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
          >
            {/* 顶部手机状态栏 */}
            <div style={{ background: '#f3f4f6', height: '18px', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: '#666' }}>
              <span>09:41</span>
              <div style={{ display: 'flex', gap: '3px' }}>📶 🪫</div>
            </div>

            {/* 顶栏用户资料 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={defaultAvatar} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 'bold' }}>极客创作者酱</div>
                  <div style={{ fontSize: '8px', color: '#999' }}>上海市</div>
                </div>
              </div>
              <button style={{ background: '#ff2442', color: '#fff', border: 'none', borderRadius: '14px', padding: '4px 10px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}>
                关注
              </button>
            </div>

            {/* 图片区域 */}
            <div style={{ position: 'relative', width: '100%', height: '240px', background: '#e5e7eb' }}>
              {images.length > 0 ? (
                <img src={images[0]} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '12px' }}>
                  🖼️ 暂无封面图 (在编辑器中上传)
                </div>
              )}
              {images.length > 1 && (
                <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '9px', padding: '2px 6px', borderRadius: '10px' }}>
                  1/{images.length}
                </span>
              )}
            </div>

            {/* 内容主体 */}
            <div style={{ padding: '12px 14px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px', color: '#000' }}>
                {title || '在此处键入爆款标题 ✨'}
              </h4>
              <p
                style={{ fontSize: '12px', color: '#333', lineHeight: '1.6', maxHeight: '120px', overflowY: 'auto' }}
                dangerouslySetInnerHTML={{ __html: formatHashtags(content) || '在这里输入正文内容...' }}
              />

              {/* 话题包渲染 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                {tags.map((tag, idx) => (
                  <span key={idx} style={{ color: '#134e4a', background: '#ccfbf1', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 500 }}>
                    #{tag}
                  </span>
                ))}
              </div>

              <div style={{ fontSize: '9px', color: '#999', marginTop: '12px' }}>
                编辑于 刚刚 · 版权所有禁止转载
              </div>
            </div>

            {/* 底栏互动 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderTop: '1px solid #f3f4f6', background: '#fff' }}>
              <input type="text" placeholder="说点什么吧..." style={{ flex: 1, border: 'none', background: '#f3f4f6', borderRadius: '14px', padding: '6px 12px', fontSize: '10px', marginRight: '10px' }} readOnly />
              <div style={{ display: 'flex', gap: '12px', color: '#666' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px' }}><Heart size={14} /> 2.8w</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '10px' }}><MessageCircle size={14} /> 489</span>
              </div>
            </div>
          </div>
        )}

        {/* 微博模拟 */}
        {activePlatform === 'weibo' && (
          <div
            style={{
              width: '340px',
              background: '#18181f',
              color: '#e5e7eb',
              border: '1px solid var(--border-light)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'left',
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              transition: 'border-color 0.4s'
            }}
          >
            {/* 微博作者 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img src={defaultAvatar} alt="avatar" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#f59e0b' }}>OmniPublisher官方微博</span>
                  <Award size={12} style={{ color: '#f59e0b' }} />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>刚刚 来自 智能发布终端</div>
              </div>
            </div>

            {/* 微博内容 */}
            <div style={{ fontSize: '13px', lineHeight: '1.6', color: '#e5e7eb', marginBottom: '12px' }}>
              <span style={{ color: '#3b82f6', fontWeight: 600, marginRight: '4px' }}>#自媒体矩阵提效#</span>
              <span dangerouslySetInnerHTML={{ __html: formatHashtags(content) || '输入微博内容...' }} />
            </div>

            {/* 多图排版 (两图并排或网格) */}
            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr', gap: '4px', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                {images.slice(0, 4).map((img, idx) => (
                  <img key={idx} src={img} alt="media" style={{ width: '100%', height: images.length > 1 ? '100px' : '180px', objectFit: 'cover' }} />
                ))}
              </div>
            )}

            {/* 话题标签 */}
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                {tags.map((tag, idx) => (
                  <span key={idx} style={{ color: '#fbbf24', fontSize: '11px' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 底栏三连 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><Share2 size={13} /> 转发</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><MessageCircle size={13} /> 评论</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><Heart size={13} /> 点赞</span>
            </div>
          </div>
        )}

        {/* 微信公众号模拟 */}
        {activePlatform === 'wechat' && (
          <div
            style={{
              width: '350px',
              background: '#ffffff',
              color: '#333333',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              padding: '24px 20px',
              textAlign: 'left',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
            }}
          >
            {/* 文章头部 */}
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111', lineHeight: '1.4', marginBottom: '12px' }}>
              {title || '微信公众号精美大标题'}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#999', marginBottom: '20px' }}>
              <span style={{ color: '#576b95', fontWeight: 600 }}>极客前沿探索</span>
              <span>2026-05-29</span>
              <span style={{ color: '#576b95' }}>收录于合集</span>
            </div>

            {/* 公众号首图/大图 */}
            {images.length > 0 && (
              <div style={{ width: '100%', height: '150px', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px' }}>
                <img src={images[0]} alt="wechat-cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            {/* 正文样式 */}
            <div
              style={{
                fontSize: '14px',
                lineHeight: '1.7',
                color: '#3e3e3e',
                letterSpacing: '0.5px',
                maxHeight: '180px',
                overflowY: 'auto'
              }}
              dangerouslySetInnerHTML={{ __html: formatHashtags(content) || '在这里编写深度原创干货文章...' }}
            />

            {/* 公众号底部 */}
            <div style={{ marginTop: '24px', borderTop: '1px dashed #e5e7eb', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#999' }}>
              <span style={{ cursor: 'pointer', color: '#576b95' }}>阅读原文</span>
              <div style={{ display: 'flex', gap: '14px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}><Star size={13} /> 分享</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}><Heart size={13} /> 在看</span>
              </div>
            </div>
          </div>
        )}

        {/* 哔哩哔哩动态模拟 */}
        {activePlatform === 'bilibili' && (
          <div
            style={{
              width: '340px',
              background: '#1e202e',
              border: '1px solid var(--border-light)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'left',
              fontFamily: 'sans-serif',
              transition: 'border-color 0.4s'
            }}
          >
            {/* UP主头部 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <img src={defaultAvatar} alt="avatar" style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1.5px solid #00aeec' }} />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#00aeec' }}>Antigravity的奇妙空间</div>
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>刚刚发布了动态</div>
              </div>
            </div>

            {/* 动态文本 */}
            <div
              style={{ fontSize: '13px', lineHeight: '1.6', color: '#e5e7eb', whiteSpace: 'pre-wrap', marginBottom: '12px' }}
              dangerouslySetInnerHTML={{ __html: formatHashtags(content) || '在这里输入发布到Bilibili的内容...' }}
            />

            {/* 图片集 */}
            {images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr', gap: '6px', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
                {images.slice(0, 2).map((img, idx) => (
                  <img key={idx} src={img} alt="bili-attach" style={{ width: '100%', height: '110px', objectFit: 'cover' }} />
                ))}
              </div>
            )}

            {/* 标签 */}
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                {tags.map((tag, idx) => (
                  <span key={idx} style={{ color: '#00aeec', background: 'rgba(0, 174, 236, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 动态底栏 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-light)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><Share2 size={13} /> 转发 (45)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><MessageCircle size={13} /> 评论 (182)</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><Heart size={13} /> 点赞 (891)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
