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

const Placeholder = (props) => {
  const { contentState, entityKey } = props;
  const { content } = contentState.getEntity(entityKey).getData();
  return <input type="text" disabled value={content} size={content.length} />;
};

Placeholder.propTypes = {
  children: PropTypes.node,
  entityKey: PropTypes.string,
  contentState: PropTypes.object.isRequired,
};

export default Placeholder;
