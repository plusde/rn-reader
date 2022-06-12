export const replaceText = (text, ellipsis = text.length) => {
  text = text
    ?.replace(/&quot;/g,'"')
    .replace(/&#039;/g,'\'')
    .replace(/&amp;/g,'&')
    .replace(/&gt;/g,'>')
    .replace(/<br>/g,'\n')
    .replace(/<wbr>|\[Embed]|\[Open]/g,'')

  return text?.substr(0, ellipsis).length < text?.length ?
    text?.substr(0, ellipsis).trim() + "..." :
    text
};