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
    contentEditable={false}
    className="md-bracket-placeholder"
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
