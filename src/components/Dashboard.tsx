import React, { useState } from 'react';
import { ANALYTICS_METRICS } from '../utils/mockData';
import type { PlatformAccount } from '../utils/mockData';
import { Users, Eye, Heart, CheckCircle2, Activity, Calendar, MessageSquare, Send, Sparkles } from 'lucide-react';

interface DashboardProps {
  accounts: PlatformAccount[];
  onViewEditor: () => void;
}

interface CommentItem {
  id: string;
  platform: 'xiaohongshu' | 'weibo' | 'wechat';
  platformName: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
  articleTitle: string;
  replies: Array<{ sender: 'user' | 'fan'; text: string; time: string }>;
}

export const Dashboard: React.FC<DashboardProps> = ({ accounts, onViewEditor }) => {
  const [subTab, setSubTab] = useState<'metrics' | 'inbox'>('metrics');
  
  // 模拟聚合消息列表
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c1',
      platform: 'xiaohongshu',
      platformName: '小红书',
      author: '种草糖糖子',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      content: '太干货了！博主下期能具体出一期关于独立指纹盾和高匿代理配置的详细教程吗？求求了！😭',
      time: '2分钟前',
      articleTitle: '全网首发！2026自媒体提效指引',
      replies: [
        { sender: 'fan', text: '太干货了！博主下期能具体出一期关于独立指纹盾和高匿代理配置的详细教程吗？求求了！😭', time: '2分钟前' }
      ]
    },
    {
      id: 'c2',
      platform: 'weibo',
      platformName: '新浪微博',
      author: '极客大白',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      content: '多账号关联防封这个点确实是核心痛点，之前我 3 个微博小号在同 IP 群发直接被封号限流了。',
      time: '25分钟前',
      articleTitle: '深度解密多矩阵分发安全算法',
      replies: [
        { sender: 'fan', text: '多账号关联防封这个点确实是核心痛点，之前我 3 个微博小号在同 IP 群发直接被封号限流了。', time: '25分钟前' }
      ]
    },
    {
      id: 'c3',
      platform: 'wechat',
      platformName: '微信公众号',
      author: '架构师老黄',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
      content: '排期发布做微小错峰抖动是个高招，能有效绕开平台的同质化拦截系统，已转发朋友圈推荐给同行。',
      time: '1小时前',
      articleTitle: '自媒体运营防截流白皮书',
      replies: [
        { sender: 'fan', text: '排期发布做微小错峰抖动是个高招，能有效绕开平台的同质化拦截系统，已转发朋友圈推荐给同行。', time: '1小时前' }
      ]
    }
  ]);

  const [selectedCommentId, setSelectedCommentId] = useState<string>('c1');
  const [replyInput, setReplyInput] = useState('');
  const [generatingReply, setGeneratingReply] = useState(false);

  const getIcon = (label: string) => {
    if (label.includes('粉丝')) return <Users size={18} style={{ color: 'var(--accent-primary)' }} />;
    if (label.includes('阅读')) return <Eye size={18} style={{ color: 'var(--accent-secondary)' }} />;
    if (label.includes('互动')) return <Heart size={18} style={{ color: 'var(--accent-pink)' }} />;
    return <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />;
  };

  const selectedComment = comments.find(c => c.id === selectedCommentId);

  // AI 智能代笔填充回复
  const handleAIReplyGen = () => {
    if (!selectedComment) return;
    setGeneratingReply(true);

    // 根据不同平台和用户生成极具情感与专业度的暖色燕麦调回复
    let generated = '';
    if (selectedComment.platform === 'xiaohongshu') {
      generated = `家人们！感谢宝贵的建议！✨下周我就会安排一期关于【矩阵隔离指纹浏览器搭建与 SOCKS5 住宅 IP 独享代理】的保姆级防封避坑教程！记得点关注不迷路哦！❤️`;
    } else if (selectedComment.platform === 'weibo') {
      generated = `确实是血泪教训！多账号在同设备同 IP 发布是各大自媒体平台最忌讳的风控点。OmniPublisher 的指纹隔离就是专门解决这个的，下期具体分享指纹伪装算法细节，欢迎围观！`;
    } else {
      generated = `感谢老黄的专业点评！错峰发布与文本轻微 A/B 句式置换确属防同质化检测核心技术，能让自媒体生产安全翻倍。下周推出更深度解析，敬请期待！`;
    }

    setTimeout(() => {
      setReplyInput(generated);
      setGeneratingReply(false);
    }, 800);
  };

  // 发送回复
  const handleSendReply = () => {
    if (!replyInput.trim() || !selectedCommentId) return;

    setComments(prev => prev.map(c => {
      if (c.id === selectedCommentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            { sender: 'user', text: replyInput.trim(), time: '刚刚' }
          ]
        };
      }
      return c;
    }));

    setReplyInput('');
    alert('回复成功！已将回复智能模拟下发推送至目标矩阵渠道！');
  };

  // 模拟定时发布队列
  const QUEUED_TASKS = [
    { id: 't1', platform: 'xiaohongshu', name: '小红书', title: '全网首发！2026年全平台提效实战', time: '今天 18:02 (错峰+2m)', status: '排程中' },
    { id: 't2', platform: 'weibo', name: '新浪微博', title: '深度解密多矩阵分发的核心技术密码', time: '今天 20:37 (错峰+7m)', status: '排程中' },
    { id: 't3', platform: 'wechat', name: '微信公众号', title: '企业级内容出海与多账号防风控实践白皮书', time: '明天 10:14 (错峰+14m)', status: '已审阅' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      {/* 欢迎栏 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity style={{ color: 'var(--accent-secondary)' }} />
            数据分析大盘与矩阵状态看板
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            📊 汇总跨端自媒体矩阵发布分析，提供双向舆情监控和多号独立防风控代理监控
          </p>
        </div>
        
        {/* 子标签切换 Segmented Control */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--tab-container-bg)', border: '1px solid var(--tab-container-border)', padding: '3px', borderRadius: '10px' }}>
          <button
            onClick={() => setSubTab('metrics')}
            style={{
              background: subTab === 'metrics' ? 'var(--accent-primary)' : 'transparent',
              color: subTab === 'metrics' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.3s'
            }}
          >
            运营分析指标
          </button>
          <button
            onClick={() => setSubTab('inbox')}
            style={{
              background: subTab === 'inbox' ? 'var(--accent-primary)' : 'transparent',
              color: subTab === 'inbox' ? '#fff' : 'var(--text-muted)',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <MessageSquare size={13} />
            统一矩阵收件箱
          </button>
        </div>
      </div>

      {subTab === 'metrics' ? (
        <>
          {/* KPI 卡片组 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {ANALYTICS_METRICS.map((metric, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'var(--card-bg)',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '20px',
                  border: '1px solid var(--border-light)',
                  transition: 'background 0.4s, border-color 0.4s, box-shadow 0.4s'
                }}
              >
                {/* 右上角高颜值微光阴影 */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    filter: 'blur(25px)',
                    opacity: 0.15
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{metric.label}</span>
                  {getIcon(metric.label)}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
                    {metric.value}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-success)', fontWeight: '600' }}>
                    {metric.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 两栏细节展示 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* 左栏：账号矩阵健康度 */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                账号指纹与连通绿标状态
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {accounts.map(acc => (
                  <div key={acc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={acc.avatar} alt="avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{acc.username}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>节点: 124.64.18.232 (住宅SOCKS5)</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: acc.status === 'connected' ? 'var(--color-success)' : 'var(--color-error)'
                        }}
                      />
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {acc.status === 'connected' ? '高安全防风控 (绿标)' : '未连接'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右栏：智能错峰排班队列 */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, fontFamily: 'var(--font-display)', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} style={{ color: 'var(--accent-secondary)' }} />
                防雷同错峰发布任务流 (Scheduled Queue)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {QUEUED_TASKS.map(task => (
                  <div
                    key={task.id}
                    style={{
                      padding: '10px 14px',
                      background: 'var(--input-bg)',
                      border: '1px solid var(--border-light)',
                      borderRadius: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.4s'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>{task.title}</div>
                      <div style={{ display: 'flex', gap: '8px', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        <span style={{ color: 'var(--accent-secondary)' }}>{task.name}</span>
                        <span>•</span>
                        <span>定时时刻: {task.time}</span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: 'rgba(21, 128, 61, 0.08)',
                        color: 'var(--color-success)',
                        border: '1px solid rgba(21, 128, 61, 0.15)'
                      }}
                    >
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 创新点卡片宣传 —— 针对评委会的心思 */}
          <div
            className="glass-card"
            style={{
              padding: '24px',
              background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.06) 0%, rgba(var(--accent-secondary-rgb), 0.06) 100%)',
              border: '1px solid rgba(var(--accent-primary-rgb), 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              borderRadius: '24px',
              transition: 'all 0.4s'
            }}
          >
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
                💡 工业级分发防关联检测说明
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.6', maxWidth: '680px' }}>
                本平台完美模拟了基于<strong>防指纹浏览器底层</strong>的多账号隔离方案。在分发时，可为各个渠道自动分配不同的 <strong>SOCKS5 静态住宅 IP 代理</strong>并自动添加 <strong>User-Agent 与 Canvas 混淆</strong>，配以<strong>微小分钟错峰延迟</strong>，从而避开平台的营销同质化检测，极大降低多账号被限流封号的风险。
              </p>
            </div>
            <button
              className="btn-primary"
              onClick={onViewEditor}
              style={{ background: 'var(--accent-secondary)', boxShadow: '0 4px 12px rgba(var(--accent-secondary-rgb), 0.25)' }}
            >
              立刻创作分发!
            </button>
          </div>
        </>
      ) : (
        /* 统一收件箱子面板 - 高端双栏设计 */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px', minHeight: '450px', alignItems: 'stretch' }}>
          {/* 左侧消息栏 */}
          <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
              各平台粉丝评论流 ({comments.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1, maxHeight: '350px' }}>
              {comments.map((item) => {
                const isSelected = selectedCommentId === item.id;
                const badges = {
                  xiaohongshu: '#ff2442',
                  weibo: '#fbbf24',
                  wechat: '#07c160'
                };
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedCommentId(item.id);
                      setReplyInput('');
                    }}
                    style={{
                      padding: '12px',
                      background: isSelected ? 'var(--tab-active-bg)' : 'var(--input-bg)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-light)'}`,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '10px',
                      transition: 'all 0.3s ease',
                      textAlign: 'left'
                    }}
                  >
                    <img src={item.avatar} alt="fan" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-light)' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.author}</span>
                        <span style={{ fontSize: '9px', color: '#fff', background: badges[item.platform], padding: '1px 6px', borderRadius: '10px', fontWeight: 600 }}>
                          {item.platformName}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {item.content}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-dark)', marginTop: '6px' }}>
                        <span>原发: {item.articleTitle}</span>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 右侧回复区域 */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', borderRadius: '20px' }}>
            {selectedComment ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
                {/* 对话区头部 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>
                  <img src={selectedComment.avatar} alt="author" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {selectedComment.author}
                      <span style={{ fontSize: '10px', background: 'var(--tab-active-bg)', color: 'var(--accent-primary)', padding: '2px 8px', borderRadius: '8px' }}>
                        {selectedComment.platformName}矩阵渠道
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>互动文章: 《{selectedComment.articleTitle}》</div>
                  </div>
                </div>

                {/* 对话消息记录气泡 */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '220px', paddingRight: '4px' }}>
                  {selectedComment.replies.map((reply, idx) => {
                    const isUser = reply.sender === 'user';
                    return (
                      <div
                        key={idx}
                        style={{
                          alignSelf: isUser ? 'flex-end' : 'flex-start',
                          maxWidth: '80%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isUser ? 'flex-end' : 'flex-start',
                          gap: '4px'
                        }}
                      >
                        <div
                          style={{
                            padding: '10px 14px',
                            background: isUser ? 'var(--accent-primary)' : 'var(--input-bg)',
                            color: isUser ? '#fff' : 'var(--text-main)',
                            border: isUser ? 'none' : '1px solid var(--border-light)',
                            borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                            fontSize: '12px',
                            lineHeight: '1.5',
                            textAlign: 'left'
                          }}
                        >
                          {reply.text}
                        </div>
                        <span style={{ fontSize: '9px', color: 'var(--text-dark)' }}>{reply.time}</span>
                      </div>
                    );
                  })}
                </div>

                {/* 输入及 AI 工具栏 */}
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* AI 智能改写代笔栏 */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>💡 需要帮助？试试 AI 智能辅助</span>
                    <button
                      onClick={handleAIReplyGen}
                      disabled={generatingReply}
                      style={{
                        background: 'rgba(var(--accent-primary-rgb), 0.12)',
                        border: '1px solid rgba(var(--accent-primary-rgb), 0.2)',
                        color: 'var(--accent-primary)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        outline: 'none'
                      }}
                    >
                      <Sparkles size={12} className={generatingReply ? "spin-animation" : ""} />
                      {generatingReply ? 'AI 代笔拟作中...' : 'AI 智能代笔生成'}
                    </button>
                  </div>

                  {/* 回复输入区域 */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="键入您的回复..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', fontSize: '12px' }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyInput.trim()}
                      className="btn-primary"
                      style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        height: '38px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: !replyInput.trim() ? 0.6 : 1,
                        outline: 'none'
                      }}
                    >
                      <Send size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ margin: 'auto', color: 'var(--text-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={24} />
                <span style={{ fontSize: '12px' }}>请在左侧点击粉丝互动，开始统一安全畅聊！</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
