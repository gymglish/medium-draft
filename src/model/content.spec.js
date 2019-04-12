import { convertToRaw, CompositeDecorator } from 'draft-js';
import createEditorState from './content';
import { Block } from '../util/constants';

import preData from '../../docs/data.json';
import Link, { findLinkEntities } from '../components/entities/link';
import CoverRequest, { findCoverRequestEntities } from '../components/entities/coverRequest';
import Placeholder, { findPlaceholderEntities } from '../components/entities/placeholder';
import Quotation, { findQuotationEntities } from '../components/entities/quotation';

describe('createEditorState', () => {
  const es = createEditorState();

  it('creates empty editorState when no argument or null is passed', () => {
    const raw = convertToRaw(es.getCurrentContent());
    expect(raw.blocks).to.be.instanceof(Array);
    expect(raw.blocks[0].type).to.equal(Block.UNSTYLED);
    expect(raw.blocks[0].text).to.equal('');
    expect(raw.blocks[0]).to.include.keys('data', 'key');
  });

  it('adds link decorator by default in CompositeDecorator', () => {
    expect(es.getDecorator()).to.be.instanceof(CompositeDecorator);
    expect(es.getDecorator()._decorators.length).to.equal(4);
    expect(es.getDecorator()._decorators[0]).to.deep.equal(
      {
        strategy: findLinkEntities,
        component: Link,
      }
    );
    expect(es.getDecorator()._decorators[1]).to.deep.equal(
      {
        strategy: findCoverRequestEntities,
        component: CoverRequest,
      }
    );
    expect(es.getDecorator()._decorators[2]).to.deep.equal(
      {
        strategy: findPlaceholderEntities,
        component: Placeholder,
      }
    );
    expect(es.getDecorator()._decorators[3]).to.deep.equal(
      {
        strategy: findQuotationEntities,
        component: Quotation,
      }
    );
  });

  const esContent = createEditorState(preData);

  it('fills data from provided json', () => {
    const blocks = esContent.getCurrentContent().getBlockMap();
    expect(blocks.size).to.be.above(1);

    expect(esContent.getDecorator()).to.be.instanceof(CompositeDecorator);
    expect(esContent.getDecorator()._decorators.length).to.equal(4);
    expect(es.getDecorator()._decorators[0]).to.deep.equal(
      {
        strategy: findLinkEntities,
        component: Link,
      }
    );
    expect(es.getDecorator()._decorators[1]).to.deep.equal(
      {
        strategy: findCoverRequestEntities,
        component: CoverRequest,
      }
    );
    expect(es.getDecorator()._decorators[2]).to.deep.equal(
      {
        strategy: findPlaceholderEntities,
        component: Placeholder,
      }
    );
    expect(es.getDecorator()._decorators[3]).to.deep.equal(
      {
        strategy: findQuotationEntities,
        component: Quotation,
      }
    );
  });
});
