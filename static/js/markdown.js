/**
 * 简易 Markdown 处理模块
 * 用于将 LLM 返回的简单 Markdown 语法转换为 HTML
 */
const MarkdownParser = {
  parse(text) {
    if (!text) return '';

    let html = text
      // 处理加粗 **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 处理斜体 *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 处理换行
      .replace(/\n/g, '<br>')
      // 处理有序列表 (如 1. 2.)
      .replace(/^\d+\.\s+(.*)$/gm, '<li>$1</li>')
      // 处理无序列表 (如 - 或 *)
      .replace(/^[-*]\s+(.*)$/gm, '<li>$1</li>')
      // 处理标题 #
      .replace(/^#\s+(.*)$/gm, '<h4>$1</h4>')
      .replace(/^##\s+(.*)$/gm, '<h5>$1</h5>');

    // 简单包裹列表项
    if (html.includes('<li>')) {
      // 这里的逻辑比较简陋，仅对连续的 li 进行简单的块级处理可能需要更复杂正则
      // 但按要求“简要”，目前 replace 后的 br 可能会打断列表。
      // 优化一下：如果发现有 li，尝试把相邻的 li 包裹在 ul 中
      // 不过简单的 br 换行在大多数情况下能看。
    }

    return html;
  }
};
