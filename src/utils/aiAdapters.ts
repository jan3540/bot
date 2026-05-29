export interface AIAdaptationResult {
  title: string;
  content: string;
  tags: string[];
}

export const convertToXiaohongshu = (title: string, content: string): AIAdaptationResult => {
  return {
    title: `✨ 绝了！${title} 爆款提效指南来啦！`,
    content: `💡 答应我！自媒体人一定要点赞收藏这篇！

${content.split('\n').map(line => {
  if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.')) {
    return `🔥 ${line.trim()}`;
  }
  if (line.trim() === '') return '';
  return `📌 ${line}`;
}).filter(Boolean).join('\n\n')}

姐妹们/兄弟们，听懂掌声！这个风口再不抓住就真的晚了！赶紧用起来吧！👇`,
    tags: ['多端发布', '自媒体运营', '效率神器', 'AI写作', '小红书博主']
  };
};

export const convertToWeibo = (title: string, content: string): AIAdaptationResult => {
  // 提取核心观点，限字
  return {
    title: `#自媒体矩阵提效#`,
    content: `【${title}】在如今的内容爆发期，你还在手动复制粘贴吗？多矩阵分发才是提效关键！

📋 原创摘要：${content.slice(0, 60).replace(/\n/g, ' ')}...

高效创作者的标配，赶紧转发马住！[作揖][打call] 网页链接`,
    tags: ['自媒体矩阵', '内容分发', 'AI创作']
  };
};

export const convertToWeChat = (title: string, content: string): AIAdaptationResult => {
  return {
    title: title, // 公众号通常使用原标题，或更加严肃深度
    content: `<blockquote>
前言：在这个信息过载的时代，如何快速让自己的优质声音被更多平台听到？本文将从企业级架构与自媒体矩阵的视角，为您深度剖析多渠道分发系统的关键演进。
</blockquote>

<h3>一、 创作生态的变革与挑战</h3>

${content}

<h3>二、 为什么需要安全的本地化架构？</h3>

保障数字资产安全至关重要。传统云端代登入机制面临极高的风控截流与隐私外泄隐患。而基于本地浏览器的 Session 状态复用，则是打通企业矩阵分发的唯一“破局解”。

<h3>三、 结语与未来展望</h3>

唯有将核心创作精力回归内容本身，将繁琐的排版分发自动化，方能在变幻莫测的内容浪潮中立于不败之地。欢迎点赞、在看并分享！`,
    tags: ['公众号运营', '深度阅读', '技术沙龙', '生产力工具']
  };
};

export const convertToBilibili = (title: string, content: string): AIAdaptationResult => {
  return {
    title: `【ANTG】${title} (速看！保姆级多渠道提效方案)`,
    content: `各位小伙伴，Up主又更新啦！本次带来的是《${title}》的超干货分享！

💡 【省流核心速览】
${content.slice(0, 80).replace(/\n/g, ' ')}...

🚀 快点击下方链接加入我们的实训营项目，三连（点赞、投币、收藏）支持一下，Up主将会在评论区随机抽取3位粉丝送出独家开发秘籍！`,
    tags: ['哔哩哔哩', 'UP主的日常', '前端开发', '干货分享', '开源项目']
  };
};
