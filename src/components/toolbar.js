import PropTypes from 'prop-types';
// import './toolbar.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import ReactAutocomplete from 'react-autocomplete';

import BlockToolbar from './blocktoolbar';
import InlineToolbar from './inlinetoolbar';

import { getSelection, getSelectionRect } from '../util/index';
import { getCurrentBlock } from '../model/index';
import { Entity, HYPERLINK } from '../util/constants';

export default class Toolbar extends React.Component {

  static propTypes = {
    editorEnabled: PropTypes.bool,
    editorState: PropTypes.object,
    toggleBlockType: PropTypes.func,
    toggleInlineStyle: PropTypes.func,
    inlineButtons: PropTypes.arrayOf(PropTypes.object),
    blockButtons: PropTypes.arrayOf(PropTypes.object),
    editorNode: PropTypes.object,
    setLink: PropTypes.func,
    focus: PropTypes.func,
    displayCoverRequest: PropTypes.bool,
    setCoverRequest: PropTypes.func,
    autocompleteItems: PropTypes.arrayOf(PropTypes.shape()),
    onAutocompleteSelect: PropTypes.func,
    addLinkLabel: PropTypes.string,
    addGrainRequestLabel: PropTypes.string,
  };

  static defaultProps = {
    blockButtons: BLOCK_BUTTONS,
    inlineButtons: INLINE_BUTTONS,
  };

  constructor(props) {
    super(props);
    this.state = {
      showURLInput: false,
      showCoverInput: false,
      urlInputValue: '',
      coverInputValue: '',
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleLinkInput = this.handleLinkInput.bind(this);
    this.hideLinkInput = this.hideLinkInput.bind(this);

    this.handleCoverInput = this.handleCoverInput.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    if (!newProps.editorEnabled) {
      return;
    }
    const selectionState = editorState.getSelection();
    if (selectionState.isCollapsed()) {
      if (this.state.showURLInput) {
        this.setState({
          showURLInput: false,
          urlInputValue: '',
        });
      }
      if (this.state.showCoverInput) {
        this.setState({
          showCoverInput: false,
          coverInputValue: '',
        });
      }
      return;
    }
  }

  // shouldComponentUpdate(newProps, newState) {
  //   console.log(newState, this.state);
  //   if (newState.showURLInput !== this.state.showURLInput && newState.urlInputValue !== this.state.urlInputValue) {
  //     return true;
  //   }
  //   return false;
  // }

  componentDidUpdate() {
    if (
        this.state.showURLInput ||
        this.state.showCoverInput
      ) {
      return;
    }
    const selectionState = this.props.editorState.getSelection();
    if (selectionState.isCollapsed()) {
      return;
    }
    // eslint-disable-next-line no-undef
    const nativeSelection = getSelection(window);
    if (!nativeSelection.rangeCount) {
      return;
    }
    const selectionBoundary = getSelectionRect(nativeSelection);

    // eslint-disable-next-line react/no-find-dom-node
    const toolbarNode = ReactDOM.findDOMNode(this);
    const toolbarBoundary = toolbarNode.getBoundingClientRect();

    // eslint-disable-next-line react/no-find-dom-node
    const parent = ReactDOM.findDOMNode(this.props.editorNode);
    const parentBoundary = parent.getBoundingClientRect();

    /*
    * Main logic for setting the toolbar position.
    */
    toolbarNode.style.top =
      `${(selectionBoundary.top - parentBoundary.top - toolbarBoundary.height - 5)}px`;
    toolbarNode.style.width = `${toolbarBoundary.width}px`;
    const widthDiff = selectionBoundary.width - toolbarBoundary.width;
    if (widthDiff >= 0) {
      toolbarNode.style.left = `${widthDiff / 2}px`;
    } else {
      const left = (selectionBoundary.left - parentBoundary.left);
      toolbarNode.style.left = `${left + (widthDiff / 2)}px`;
      // toolbarNode.style.width = toolbarBoundary.width + 'px';
      // if (left + toolbarBoundary.width > parentBoundary.width) {
        // toolbarNode.style.right = '0px';
        // toolbarNode.style.left = '';
        // toolbarNode.style.width = toolbarBoundary.width + 'px';
      // }
      // else {
      //   toolbarNode.style.left = (left + widthDiff / 2) + 'px';
      //   toolbarNode.style.right = '';
      // }
    }
  }

  onKeyDown(e) {
    if (e.which === 13) {
      e.preventDefault();
      e.stopPropagation();
      if (this.state.showURLInput) {
        this.props.setLink(this.state.urlInputValue);
      } else if (this.state.showCoverInput) {
        this.props.setCoverRequest(this.state.coverInputValue);
      }
      this.hideLinkInput();
    } else if (e.which === 27) {
      this.hideLinkInput();
    }
  }

  onChange = (field) => (e) => {
    const value = field === 'coverInputValue' ? e.target.value.toUpperCase().replace(/ /g, '-').replace(/[^\w-]/gi, '') : e.target.value;
    this.setState({
      [field]: value,
    });
  }

  handleLinkInput(e, direct = false) {
    if (direct !== true) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      this.props.focus();
      return;
    }
    const currentBlock = getCurrentBlock(editorState);
    let selectedEntity = '';
    let linkFound = false;
    currentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      selectedEntity = entityKey;
      return entityKey !== null && editorState.getCurrentContent().getEntity(entityKey).getType() === Entity.LINK;
    }, (start, end) => {
      let selStart = selection.getAnchorOffset();
      let selEnd = selection.getFocusOffset();
      if (selection.getIsBackward()) {
        selStart = selection.getFocusOffset();
        selEnd = selection.getAnchorOffset();
      }
      if (start === selStart && end === selEnd) {
        linkFound = true;
        const { url } = editorState.getCurrentContent().getEntity(selectedEntity).getData();
        this.setState({
          showURLInput: true,
          urlInputValue: url,
        }, () => {
          setTimeout(() => {
            this.urlinput.focus();
            this.urlinput.select();
          }, 0);
        });
      }
    });
    if (!linkFound) {
      this.setState({
        showURLInput: true,
      }, () => {
        setTimeout(() => {
          this.urlinput.focus();
        }, 0);
      });
    }
  }

  handleCoverInput(e, direct = false) {
    if (direct !== true) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { editorState } = this.props;
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      this.props.focus();
      return;
    }
    const currentBlock = getCurrentBlock(editorState);
    let selectedEntity = '';
    let coverFound = false;
    currentBlock.findEntityRanges((character) => {
      const entityKey = character.getEntity();
      selectedEntity = entityKey;
      return entityKey !== null && editorState.getCurrentContent().getEntity(entityKey).getType() === Entity.COVER_REQUEST;
    }, (start, end) => {
      let selStart = selection.getAnchorOffset();
      let selEnd = selection.getFocusOffset();
      if (selection.getIsBackward()) {
        selStart = selection.getFocusOffset();
        selEnd = selection.getAnchorOffset();
      }
      if (start === selStart && end === selEnd) {
        coverFound = true;
        const { cover } = editorState.getCurrentContent().getEntity(selectedEntity).getData();
        this.setState({
          showCoverInput: true,
          coverInputValue: cover,
        }, () => {
          setTimeout(() => {
            this.coverinput.focus();
            this.coverinput.select();
          }, 0);
        });
      }
    });
    if (!coverFound) {
      this.setState({
        showCoverInput: true,
      }, () => {
        setTimeout(() => {
          this.coverinput.focus();
        }, 0);
      });
    }
  }

  hideLinkInput(e = null) {
    if (e !== null) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.setState({
      showURLInput: false,
      showCoverInput: false,
      urlInputValue: '',
      coverInputValue: '',
    }, this.props.focus
    );
  }

  render() {
    const {
      editorState,
      inlineButtons,
      displayCoverRequest,
      autocompleteItems,
      // onAutocompleteSelect,
      addLinkLabel,
      addGrainRequestLabel,
    } = this.props;
    const { showURLInput, urlInputValue, showCoverInput, coverInputValue } = this.state;
    let isOpen = true;
    if (editorState.getSelection().isCollapsed()) {
      isOpen = false;
    }
    if (showURLInput) {
      let className = `md-editor-toolbar${(isOpen ? ' md-editor-toolbar--isopen' : '')}`;
      className += ' md-editor-toolbar--linkinput';
      return (
        <div
          className={className}
        >
          <div
            className="md-RichEditor-controls md-RichEditor-show-link-input"
            style={{ display: 'block' }}
          >
            <span className="md-url-input-close" onClick={this.hideLinkInput}>&times;</span>
            <input
              ref={node => { this.urlinput = node; }}
              type="text"
              className="md-url-input"
              onKeyDown={this.onKeyDown}
              onChange={this.onChange('urlInputValue')}
              placeholder={'ENTER to accept, ESC to cancel'}
              value={urlInputValue}
            />
          </div>
        </div>
      );
    }

    if (showCoverInput) {
      let className = `md-editor-toolbar${(isOpen ? ' md-editor-toolbar--isopen' : '')}`;
      className += ' md-editor-toolbar--linkinput';

      return (
        <div
          className={className}
        >
          <div
            className="md-RichEditor-controls md-RichEditor-show-link-input"
            style={{ display: 'block' }}
          >
            <span className="md-url-input-close" onClick={this.hideLinkInput}>&times;</span>
            <ReactAutocomplete
              ref={node => { this.coverinput = node; }}
              type="text"
              onChange={this.onChange('coverInputValue')}
              placeholder={'Begin typing cover name or ENTER to create'}
              value={coverInputValue}
              autoHighlight={false}
              items={autocompleteItems}
              onSelect={(inputValue, item) => {
                this.props.setCoverRequest(item.title, item._id, true);
                this.hideLinkInput();
                // onAutocompleteSelect(inputValue, item);
              }}
              shouldItemRender={(item, inputValue) => (item.title ? item.title.includes(inputValue) : false)}
              getItemValue={item => item.title}
              inputProps={{
                onKeyPress: this.onKeyDown,
                maxLength: 50,
                className: 'md-url-input',
              }}
              renderMenu={(items) => <div>{items}</div>}
              renderItem={(item, highlighted) =>
                (<div
                  key={item._id}
                  style={{
                    backgroundColor: highlighted ? '#7a88a9' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  {item.title}
                </div>)
              }
            />
          </div>
        </div>
      );
    }
    let hasHyperLink = false;
    let hyperlinkLabel = '#';
    for (let cnt = 0; cnt < inlineButtons.length; cnt++) {
      if (inlineButtons[cnt].style === HYPERLINK) {
        hasHyperLink = true;
        if (inlineButtons[cnt].label) {
          hyperlinkLabel = inlineButtons[cnt].label;
        }
        break;
      }
    }
    return (
      <div
        className={`md-editor-toolbar${(isOpen ? ' md-editor-toolbar--isopen' : '')}`}
      >
        {this.props.blockButtons.length > 0 ? (
          <BlockToolbar
            editorState={editorState}
            onToggle={this.props.toggleBlockType}
            buttons={this.props.blockButtons}
          />
        ) : null}
        {this.props.inlineButtons.length > 0 ? (
          <InlineToolbar
            editorState={editorState}
            onToggle={this.props.toggleInlineStyle}
            buttons={this.props.inlineButtons}
          />
        ) : null}
        {(hasHyperLink || displayCoverRequest) && (
          <div className="md-RichEditor-controls">
            {
              hasHyperLink &&
                <span
                  className="md-RichEditor-styleButton md-RichEditor-linkButton hint--top"
                  onClick={this.handleLinkInput}
                  aria-label={addLinkLabel}
                >
                  {hyperlinkLabel} {addLinkLabel}
                </span>
            }
            {
              displayCoverRequest &&
                <span
                  className="md-RichEditor-styleButton md-RichEditor-linkButton hint--top"
                  onClick={this.handleCoverInput}
                  aria-label={addGrainRequestLabel}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
                  </svg>
                  {addGrainRequestLabel}
                </span>
            }
          </div>
        )}
      </div>
    );
  }
}

export const BLOCK_BUTTONS = [
  {
    label: 'H3',
    style: 'header-three',
    icon: 'header',
    description: 'Heading 3',
  },
  {
    label: (
      <svg width="10.83" height="10" viewBox="0 0 13 12">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-357.000000, -255.000000)" fill="#FFFFFF">
            <g transform="translate(260.000000, 165.000000)">
              <g transform="translate(0.000000, 75.000000)">
                <g transform="translate(19.000000, 0.000000)">
                  <path d="M90.500768,15 L91,15.56 C88.9631235,17.0533408 87.9447005,18.666658 87.9447005,20.4 C87.9447005,21.8800074 88.75012,23.1466614 90.3609831,24.2 L87.5453149,27 C85.9211388,25.7866606 85.109063,24.346675 85.109063,22.68 C85.109063,20.3199882 86.90628,17.7600138 90.500768,15 Z M83.3917051,15 L83.890937,15.56 C81.8540605,17.0533408 80.8356375,18.666658 80.8356375,20.4 C80.8356375,21.8800074 81.6344006,23.1466614 83.2319508,24.2 L80.4362519,27 C78.8120759,25.7866606 78,24.346675 78,22.68 C78,20.3199882 79.7972171,17.7600138 83.3917051,15 Z" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    ),
    style: 'blockquote',
    icon: 'quote-right',
    description: 'Blockquote',
  },
  {
    label: 'UL',
    style: 'unordered-list-item',
    icon: 'list-ul',
    description: 'Unordered List',
  },
  {
    label: 'OL',
    style: 'ordered-list-item',
    icon: 'list-ol',
    description: 'Ordered List',
  },
  {
    label: '✓',
    style: 'todo',
    description: 'Todo List',
  },
];

export const INLINE_BUTTONS = [
  {
    label: 'B',
    style: 'BOLD',
    icon: 'bold',
    description: 'Bold',
  },
  {
    label: 'I',
    style: 'ITALIC',
    icon: 'italic',
    description: 'Italic',
  },
  {
    label: 'U',
    style: 'UNDERLINE',
    icon: 'underline',
    description: 'Underline',
  },
  {
    label: 'Hi',
    style: 'HIGHLIGHT',
    description: 'Highlight selection',
  },
  {
    label: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
      </svg>
    ),
    style: HYPERLINK,
    icon: 'link',
    description: 'Add a link',
  },
];

