/**
 * 安全的日期格式化工具
 */

export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  
  try {
    // 尝试解析日期字符串
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    // 返回本地化的日期时间字符串
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return '-';
  }
};

export const formatDateShort = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    // 返回短格式日期
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    console.warn('Date formatting error:', error);
    return '-';
  }
};

export const formatRelativeTime = (dateString: string | undefined | null): string => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks}周前`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months}个月前`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years}年前`;
    }
  } catch (error) {
    console.warn('Relative time formatting error:', error);
    return '-';
  }
};
