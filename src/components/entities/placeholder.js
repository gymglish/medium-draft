import PropTypes from 'prop-types';
import React from 'react';

import { Entity } from '../../util/constants';


export const findPlaceholderEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === Entity.PLACEHOLDER
      );
    },
    callback
  );
};

const Placeholder = (props) => (
  <span
    style={{
      border: '1px solid #9b9b9b',
      backgroundColor: '#f5f5f5',
      color: '#f5f5f5',
      margin: '0 5px',
      display: 'inline-block',
      width: 100,
      userSelect: 'none',
    }}
    contentEditable={false}
  >
    {props.children}
  </span>
);

Placeholder.propTypes = {
  children: PropTypes.node,
  entityKey: PropTypes.string,
  contentState: PropTypes.object.isRequired,
};

export default Placeholder;
