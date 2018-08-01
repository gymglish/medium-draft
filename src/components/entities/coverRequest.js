import PropTypes from 'prop-types';
import React from 'react';

import { Entity } from '../../util/constants';


export const findCoverRequestEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === Entity.COVER_REQUEST
      );
    },
    callback
  );
};

const CoverRequest = (props) => {
  const { contentState, entityKey } = props;
  const { cover } = contentState.getEntity(entityKey).getData();
  return (
    <mark
      data-covername={cover}
      aria-label={cover}
    >{props.children}</mark>
  );
};

CoverRequest.propTypes = {
  children: PropTypes.node,
  entityKey: PropTypes.string,
  contentState: PropTypes.object.isRequired,
};

export default CoverRequest;
