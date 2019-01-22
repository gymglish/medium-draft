import React from 'react';
import PropTypes from 'prop-types';
import { getVisibleSelectionRect } from 'draft-js';

import { Entity } from '../util/constants';

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

export default class LinkEditComponent extends React.Component {

  static propTypes = {
    editorState: PropTypes.object.isRequired,
    data: PropTypes.string.isRequired,
    blockKey: PropTypes.string.isRequired,
    entityKey: PropTypes.string.isRequired,
    entityType: PropTypes.string.isRequired,
    removeLink: PropTypes.func.isRequired,
    editLink: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      position: {},
    };
    this.renderedOnce = false;
  }

  componentDidMount() {
    setTimeout(this.calculatePosition, 0);
  }

  shouldComponentUpdate(newProps) {
    if (this.renderedOnce) {
      const ret = (this.props.blockKey !== newProps.blockKey || this.props.entityKey !== newProps.entityKey);
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
    const position = {
      top: (selectionRect.top - relativeRect.top) + 35,
      left: (selectionRect.left - relativeRect.left) + (selectionRect.width / 2),
      transform: 'translate(-50%) scale(1)',
    };
    this.setState({ position });
  };

  removeLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.removeLink(this.props.blockKey, this.props.entityKey);
  };

  editLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.editLink(this.props.blockKey, this.props.entityKey, this.props.entityType);
  };

  render() {
    let data = this.props.data;
    if (data.length > 30) {
      data = `${data.slice(0, 30)}...`;
    }
    return (
      <div
        className="md-editor-toolbar md-editor-toolbar--isopen md-editor-toolbar-edit-link"
        style={this.state.position}
        ref={(element) => {
          this.toolbar = element;
        }}
      >
        { this.props.entityType === Entity.LINK
            ? <a href={this.props.data} title={this.props.data} target="_blank" rel="noopener noreferrer">{data}</a>
            : data
        }
        <button className="md-editor-toolbar-unlink-button" onMouseDown={this.removeLink}>Unlink</button>
        <button className="md-editor-toolbar-edit-button" onMouseDown={this.editLink}>Edit</button>
      </div>
    );
  }
}
