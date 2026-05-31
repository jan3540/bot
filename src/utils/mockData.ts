export interface PlatformAccount {
  id: string;
  platform: 'xiaohongshu' | 'weibo' | 'wechat' | 'bilibili';
  platformName: string;
  username: string;
  avatar: string;
  status: 'connected' | 'expired' | 'disconnected';
  followers: string;
  postsCount: number;
}

export interface AnalyticsMetric {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface DraftPost {
  id: string;
  title: string;
  content: string;
  tags: string[];
  images: string[];
  updatedAt: string;
}

export const INITIAL_ACCOUNTS: PlatformAccount[] = [
  {
    id: '1',
    platform: 'xiaohongshu',
    platformName: '小红书',
    username: '极客创作者酱',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'connected',
    followers: '28.4K',
    postsCount: 142
  },
  {
    id: '2',
    platform: 'weibo',
    platformName: '新浪微博',
    username: 'OmniPublisher官方微博',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'connected',
    followers: '105.3K',
    postsCount: 689
  },
  {
    id: '3',
    platform: 'wechat',
    platformName: '微信公众号',
    username: '极客前沿探索',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'connected',
    followers: '15.9K',
    postsCount: 78
  },
  {
    id: '4',
    platform: 'bilibili',
    platformName: '哔哩哔哩',
    username: 'Antigravity的奇妙空间',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    status: 'disconnected',
    followers: '3.1K',
    postsCount: 12
  }
];

export const ANALYTICS_METRICS: AnalyticsMetric[] = [
  {
    label: '多端矩阵总粉丝数',
    value: '152,700',
    change: '+12.4%',
    isPositive: true
  },
  {
    label: '本周内容阅读总量',
    value: '489.2K',
    change: '+24.8%',
    isPositive: true
  },
  {
    label: '内容互动次数 (赞评转)',
    value: '35,821',
    change: '+18.2%',
    isPositive: true
  },
  {
    label: '渠道发布成功率',
    value: '99.8%',
    change: '0.0%',
    isPositive: true
  }
];

export const INITIAL_DRAFT: DraftPost = {
  id: 'draft-01',
  title: '为什么说 2026 年是跨端内容创作的黄金爆发期？',
  content: `作为一名内容创作者，你是否曾被这些琐事折磨：
1. 复制文章，在 5 个平台反复排版。
2. 小红书需要高颜值的卡片和一堆表情，公众号需要严谨的三段式和高清封面，微博只有 140 字还要带热门话题。
3. 每天都要登录不同的后台查看数据。

其实，真正能够实现效率倍增的，是拥有一套属于自己的多渠道分发体系！

通过极简的工作流，我们只需要把注意力集中在内容的核心价值上，其余的排版优化和平台自适应，都可以交给 AI 和自动化工具来搞定。`,
  tags: ['跨端创作', '自媒体提效', 'AI排版', '效率工具'],
  images: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80'
  ],
  updatedAt: '刚刚'
};

// 模拟自动化发布的阶段日志数据生成器 (支持防风控及指纹盾仿真日志输出)
export const getPublishingLogs = (platforms: string[], title: string) => {
  const logs: string[] = [];
  logs.push(`[SYSTEM] [${new Date().toLocaleTimeString()}] 🚀 启动多端智能分发安全引擎...`);
  logs.push(`[SYSTEM] [${new Date().toLocaleTimeString()}] 🛡️ 启动指纹盾隔离守护机制，分配高匿名沙箱浏览器示例`);
  logs.push(`[SYSTEM] [${new Date().toLocaleTimeString()}] 📁 正在解析原创草稿包 [标题: "${title}"]`);
  logs.push(`[SYSTEM] [${new Date().toLocaleTimeString()}] 🔑 正在提取本地 LocalStorage 中的加密安全凭证与加密 Session...`);

  platforms.forEach((platform) => {
    const name = platform === 'xiaohongshu' ? '小红书'
               : platform === 'weibo' ? '新浪微博'
               : platform === 'wechat' ? '微信公众号'
               : '哔哩哔哩';
    
    logs.push(`\n[${platform.toUpperCase()}] === 开始安全分发渠道: ${name} ===`);
    logs.push(`[${platform.toUpperCase()}] 🌐 挂载独立家庭住宅 IP 代理: 124.64.18.232 (高匿 SOCKS5)`);
    logs.push(`[${platform.toUpperCase()}] 💻 注入隔离指纹盾: 模拟 Chrome 124 (Win10) / WebGL GPU: RTX 4060`);
    logs.push(`[${platform.toUpperCase()}] 🔄 检测到本地有效的 Session Cookie，执行安全特征绕过二次验证...`);
    logs.push(`[${platform.toUpperCase()}] 🟢 账号指纹认证成功，节点通畅度 99.8%`);
    
    // AI 变体
    logs.push(`[${platform.toUpperCase()}] ✍️ 开启同质化文本防护，执行 AI 差异化 A/B 改写置换...`);
    if (platform === 'xiaohongshu') {
      logs.push(`[小红书] 📝 编译标题变体: "✨家人们！${title.slice(0, 15)}..."`);
    } else if (platform === 'weibo') {
      logs.push(`[微博] 📝 编译内容变体: "【首发爆料】${title.slice(0, 15)}..."`);
    }

    logs.push(`[${platform.toUpperCase()}] 📤 正在通过隔离会话分块编码并上传多媒体图片附件...`);
    logs.push(`[${platform.toUpperCase()}] ✍️ 正在定位目标编辑器 DOM 元素并注入富文本格式...`);
    
    if (platform === 'xiaohongshu') {
      logs.push(`[小红书] 📝 自动匹配卡片编辑器，完成表情 Emoji 智能段落间隔排版`);
    } else if (platform === 'weibo') {
      logs.push(`[微博] ⚡ 校验 140 字短文限制，自动过滤长空行，嵌入高权对话题`);
    } else if (platform === 'wechat') {
      logs.push(`[微信] 📄 注入微信公众号专用 CSS 富文本格式，选用【春日燕麦】配色排版`);
    }

    // 错峰时序
    logs.push(`[${platform.toUpperCase()}] ⏳ 开启错峰避风控发布机制，防大规模并发群发检测`);
    if (platform === 'xiaohongshu') {
      logs.push(`[小红书] ⏳ 触发排期错峰机制，自动延迟 2 分钟发布`);
    } else if (platform === 'weibo') {
      logs.push(`[微博] ⏳ 触发排期错峰机制，自动延迟 7 分钟发布`);
    } else if (platform === 'wechat') {
      logs.push(`[微信] ⏳ 触发排期错峰机制，自动延迟 14 分钟发布`);
    }

    logs.push(`[${platform.toUpperCase()}] 🔘 执行物理点击事件，模拟真实人手点击 (坐标: X=452, Y=812)`);
    logs.push(`[${platform.toUpperCase()}] 🎉 [${name}] 发布成功！分发安全级别: EXCELLENT`);
    logs.push(`[${platform.toUpperCase()}] 📄 推送回执链接: https://www.${platform}.com/post/omni_${Math.floor(100000 + Math.random() * 900000)}`);
  });

  logs.push(`\n[SYSTEM] [${new Date().toLocaleTimeString()}] ✅ 所有渠道错峰队列分发完毕！发布耗时: 1.82s (防风控守护生效中)。`);
  return logs;
};
