import React from 'react';
import PropTypes from 'prop-types';

import { getVisibleSelectionRect, EditorState, Modifier, Entity } from 'draft-js';

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
    focus: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      style: {},
    };

    this.renderedOnce = false;
    this.insertPlaceholder = this.insertPlaceholder.bind(this);
  }

  componentDidMount() {
    setTimeout(this.calculatePosition, 0);
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.editorEnabled) {
      return;
    }
  }

  shouldComponentUpdate(newProps) {
    if (this.renderedOnce) {
      const ret = this.props.editorState.getSelection().getStartKey() !== newProps.editorState.getSelection().getStartKey() ||
      this.props.editorState.getSelection().getStartOffset() !== newProps.editorState.getSelection().getStartOffset();
      if (ret) {
        this.renderedOnce = false;
      }
      return ret;
    }
    this.renderedOnce = true;
    return true;
  }

  componentDidUpdate() {
    setTimeout(this.calculatePosition, 0);
  }

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
      top: (selectionRect.top - relativeRect.top) + 35,
      left: (selectionRect.left - relativeRect.left) + (selectionRect.width / 2),
      transform: 'translate(-50%) scale(1)',
    };

    this.setState({ style });
  };

  insertPlaceholder(label, meta = '') {
    const editorState = this.state.editorState;
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      const entityKey = Entity.create('PLACEHOLDER', 'IMMUTABLE', { meta, content: label });
      const textWithEntity = Modifier.insertText(currentContent, selection, label, null, entityKey);

      this.setState({
        editorState: EditorState.push(editorState, textWithEntity, 'insert-characters'),
      }, () => {
        this.props.focus();
      });
    }
  }

  render() {
    const { blankText } = this.props;

    return (
      <div
        className="md-editor-toolbar md-editor-toolbar--isopen md-editor-toolbar-edit-link md-editor-toolbar-add-blank"
        style={this.state.style}
        ref={node => { this.toolbar = node; }}
      >
        <div className="md-RichEditor-controls">
          <span
            className="md-RichEditor-styleButton md-RichEditor-linkButton hint--top"
            onClick={() => this.insertPlaceholder(blankText)}
            aria-label="Add a blank"
          >
            Add blank
          </span>
        </div>
      </div>
    );
  }
}
