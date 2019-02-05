/*
Some of the constants which are used throughout this project instead of
directly using string.
*/

export const Block = {
  UNSTYLED: 'unstyled',
  PARAGRAPH: 'unstyled',
  OL: 'ordered-list-item',
  UL: 'unordered-list-item',
  H1: 'header-one',
  H2: 'header-two',
  H3: 'header-three',
  H4: 'header-four',
  H5: 'header-five',
  H6: 'header-six',
  CODE: 'code-block',
  BLOCKQUOTE: 'blockquote',
  PULLQUOTE: 'pullquote',
  ATOMIC: 'atomic',
  BLOCKQUOTE_CAPTION: 'block-quote-caption',
  CAPTION: 'caption',
  TODO: 'todo',
  IMAGE: 'atomic:image',
  BREAK: 'atomic:break',
  ALIGN_LEFT: 'align-left',
  ALIGN_CENTER: 'align-center',
  ALIGN_RIGHT: 'align-right',
};

export const Inline = {
  BOLD: 'BOLD',
  CODE: 'CODE',
  ITALIC: 'ITALIC',
  STRIKETHROUGH: 'STRIKETHROUGH',
  UNDERLINE: 'UNDERLINE',
  HIGHLIGHT: 'HIGHLIGHT',
  FONT_SMALL: 'FONT_SMALL',
  FONT_LARGE: 'FONT_LARGE',
  SUPERSCRIPT: 'SUPERSCRIPT',
  SUBSCRIPT: 'SUBSCRIPT',
};

export const Entity = {
  LINK: 'LINK',
  COVER_REQUEST: 'COVER_REQUEST',
  PLACEHOLDER: 'PLACEHOLDER',
};

export const HYPERLINK = 'hyperlink';
export const HANDLED = 'handled';
export const NOT_HANDLED = 'not_handled';

export const KEY_COMMANDS = {
  addNewBlock: () => 'add-new-block',
  changeType: (type = '') => `changetype:${type}`,
  showLinkInput: () => 'showlinkinput',
  unlink: () => 'unlink',
  toggleInline: (type = '') => `toggleinline:${type}`,
  deleteBlock: () => 'delete-block',
};

export default {
  Block,
  Inline,
  Entity,
};
