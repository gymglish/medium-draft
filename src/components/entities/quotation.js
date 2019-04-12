import PropTypes from 'prop-types';
import React from 'react';

import { Entity } from '../../util/constants';


export const findQuotationEntities = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === Entity.QUOTATION
      );
    },
    callback
  );
};

const Quotation = (props) => (
  <span>
    {'« '}
    {props.children}
    {' »'}
  </span>
);

Quotation.propTypes = {
  children: PropTypes.node,
  entityKey: PropTypes.string,
  contentState: PropTypes.object.isRequired,
};

export default Quotation;
