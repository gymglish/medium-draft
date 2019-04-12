import {
  EditorState,
  convertFromRaw,
  CompositeDecorator,
  ContentState,
} from 'draft-js';

import Link, { findLinkEntities } from '../components/entities/link';
import CoverRequest, { findCoverRequestEntities } from '../components/entities/coverRequest';
import Placeholder, { findPlaceholderEntities } from '../components/entities/placeholder';
import Quotation, { findQuotationEntities } from '../components/entities/quotation';


const defaultDecorators = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: Link,
  },
  {
    strategy: findCoverRequestEntities,
    component: CoverRequest,
  },
  {
    strategy: findPlaceholderEntities,
    component: Placeholder,
  },
  {
    strategy: findQuotationEntities,
    component: Quotation,
  },
]);


const createEditorState = (content = null, decorators = defaultDecorators) => {
  if (content === null) {
    return EditorState.createEmpty(decorators);
  }
  let contentState = null;
  if (typeof content === 'string') {
    contentState = ContentState.createFromText(content);
  } else {
    contentState = convertFromRaw(content);
  }
  return EditorState.createWithContent(contentState, decorators);
};

export default createEditorState;
