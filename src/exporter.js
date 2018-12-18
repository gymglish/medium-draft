import React from 'react';
import { convertToHTML } from 'draft-convert';

import { Inline, Block, Entity } from './util/constants';

export const styleToHTML = (style) => {
  switch (style) {
    case Inline.ITALIC:
      return <em />;
    case Inline.BOLD:
      return <strong />;
    case Inline.STRIKETHROUGH:
      return <strike />;
    case Inline.UNDERLINE:
      return <u />;
    case Inline.HIGHLIGHT:
      return <span />;
    case Inline.CODE:
      return <code />;
    case 'FONT_SMALL':
      return {
        start: '<span style="font-size: 0.8em">',
        end: '</span>',
      };
    case 'FONT_MEDIUM':
      return {
        start: '<span style="font-size: 1em">',
        end: '</span>',
      };
    case 'FONT_LARGE':
      return {
        start: '<span style="font-size: 1.2em">',
        end: '</span>',
      };
    default:
      return null;
  }
};

export const blockToHTML = (block) => {
  const blockType = block.type;
  switch (blockType) {
    case Block.H1:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h1 />;
    case Block.H2:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h2 />;
    case Block.H3:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h3 />;
    case Block.H4:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h4 />;
    case Block.H5:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h5 />;
    case Block.H6:
      // eslint-disable-next-line jsx-a11y/heading-has-content
      return <h6 />;
    case Block.BLOCKQUOTE_CAPTION:
    case Block.CAPTION:
      return {
        start: '<p><caption>',
        end: '</caption></p>',
      };
    case Block.IMAGE: {
      const imgData = block.data;
      return {
        start: `<figure><img src="${imgData.src}" alt="${block.text}" /><figcaption className="md-block-image-caption">`,
        end: '</figcaption></figure>',
      };
    }
    case Block.ATOMIC:
      return <figure />;
    case Block.TODO: {
      const checked = block.data.checked || false;
      let inp = '';
      let containerClass = '';
      if (checked) {
        inp = '<input type=checkbox disabled checked="checked" />';
        containerClass = 'md-block-todo-checked';
      } else {
        inp = '<input type=checkbox disabled />';
        containerClass = 'md-block-todo-unchecked';
      }
      return {
        start: `<div class="md-block-${blockType.toLowerCase()} ${containerClass}">${inp}<p>`,
        end: '</p></div>',
      };
    }
    case Block.BREAK:
      return <hr />;
    case Block.BLOCKQUOTE:
      return <blockquote />;
    case Block.OL:
      return {
        element: <li />,
        nest: <ol />,
      };
    case Block.UL:
      return {
        element: <li />,
        nest: <ul />,
      };
    case Block.UNSTYLED:
      if (block.text.length < 1) {
        return <p><br /></p>;
      }
      return <p />;
    case Block.ALIGN_CENTER:
      return {
        start: '<div style="text-align: center;">',
        end: '</div>',
      };
    case Block.ALIGN_RIGHT:
      return {
        start: '<div style="text-align: right;">',
        end: '</div>',
      };
    default: return null;
  }
};

export const entityToHTML = (entity, originalText) => {
  if (entity.type === Entity.LINK) {
    return (
      <a
        href={entity.data.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {originalText}
      </a>
    );
  }
  return originalText;
};

export const options = {
  styleToHTML,
  blockToHTML,
  entityToHTML,
};

export const setRenderOptions = (htmlOptions = options) => convertToHTML(htmlOptions);


export default (contentState, htmlOptions = options) => convertToHTML(htmlOptions)(contentState);
