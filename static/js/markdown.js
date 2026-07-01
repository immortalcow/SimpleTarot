/**
 * 简易 Markdown 处理模块
 * 用于将 LLM 返回的简单 Markdown 语法转换为 HTML
 */
const MarkdownParser = {
  parse(text) {
    if (!text) return '';

    let html = text
      // 处理标题 #
      .replace(/^### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^## (.*$)/gm, '<h5>$1</h5>')
      .replace(/^# (.*$)/gm, '<h3>$1</h3>')
      // 处理加粗 **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // 处理斜体 *text*
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // 处理列表并合并 (简单处理，不包裹 ul/ol 也可以，但去除前面的 br 会更好看)
      .replace(/^\s*[\d+\.\-\*]\s+/gm, '• ');

    // 处理换行（不在标签内的换行）
    html = html.replace(/\n(?!$)/g, '<br>');
    return html;
  }
};
