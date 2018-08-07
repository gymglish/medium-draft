import React from 'react';
import PropTypes from 'prop-types';

import { getVisibleSelectionRect } from 'draft-js';

const getRelativeParent = (element) => {
  if (!element) {
    return null;
  }

  const position = window.getComputedStyle(element).getPropertyValue('position');
  if (position !== 'static') {
    return element;
  }

  return getRelativeParent(element.parentElement);
};

export default class AddPlaceholderButton extends React.Component {

  static propTypes = {
    editorEnabled: PropTypes.bool,
    editorState: PropTypes.object,
    blankText: PropTypes.string,
    insertPlaceholder: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      style: {},
    };

    this.renderedOnce = false;
  }

  componentDidMount() {
    setTimeout(this.setNewPosition(this.calculatePosition()), 0);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.editorEnabled) {
      return;
    }
  }

  shouldComponentUpdate(newProps) {
    if (this.renderedOnce) {
      const cursorPositionChanged =
        this.props.editorState.getSelection().getStartKey() !== newProps.editorState.getSelection().getStartKey() ||
        this.props.editorState.getSelection().getStartOffset() !== newProps.editorState.getSelection().getStartOffset();
      if (!cursorPositionChanged) {
        this.renderedOnce = false;
      }
      return cursorPositionChanged;
    }
    this.renderedOnce = true;
    return true;
  }

  componentDidUpdate() {
    setTimeout(this.setNewPosition(this.calculatePosition()), 0);
  }

  setNewPosition(style = {}) {
    this.setState({ style });
  }

  /* eslint-disable consistent-return */
  calculatePosition = () => {
    if (!this.toolbar) {
      return;
    }

    const relativeParent = getRelativeParent(this.toolbar.parentElement);
    const relativeRect = relativeParent ? relativeParent.getBoundingClientRect() : window.document.body.getBoundingClientRect();

    const selectionRect = getVisibleSelectionRect(window);

    if (!selectionRect) {
      return;
    }

    const style = {
      top: (selectionRect.top - relativeRect.top) - 35,
      left: (selectionRect.left - relativeRect.left) + (selectionRect.width / 2),
      transform: 'translate(-50%) scale(1)',
    };

    return style;
  };
  /* eslint-enable */

  render() {
    const { blankText, insertPlaceholder, editorState } = this.props;
    // Don't show add blank button if user selected a range
    if (!editorState.getSelection().isCollapsed()) return null;

    return (
      <div
        className="md-editor-toolbar md-editor-toolbar--isopen md-editor-toolbar-add-blank"
        style={this.state.style}
        ref={node => { this.toolbar = node; }}
      >
        <div className="md-RichEditor-controls">
          <span
            className="md-RichEditor-styleButton md-RichEditor-linkButton hint--top"
            onClick={(event) => { event.preventDefault(); event.stopPropagation(); insertPlaceholder(blankText); }}
            aria-label="Add a blank"
          >
            Add blank
          </span>
        </div>
      </div>
    );
  }
}
