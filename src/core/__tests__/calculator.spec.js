import { expect } from 'chai';
import sinon from 'sinon';
import * as domGeometryStore from '../domGeometryStore';

describe('calculator', () => {
  let getAttr;

  beforeEach(() => {
    getAttr = sinon.stub(domGeometryStore, 'getAttr');
  });

  afterEach(() => {
    getAttr.restore();
  });

  it('compute: should return null if any attrubutes depended on is not ready yet', () => {
    getAttr.withArgs('calender', 'y').returns(200);
    getAttr.withArgs('header', 'height').returns(undefined);

    const calculator = require('../calculator');
    calculator.addCalculators('content', {
      height: [{ identifier: 'calender', attr: 'y' }, '+', { identifier: 'header', attr: 'height' }]
    });

    expect(calculator.compute('content', 'height')).to.equal(null);
  });

  it('compute: should return appropriate attr value', () => {
    getAttr.withArgs('calender', 'y').returns(200);
    getAttr.withArgs('header', 'height').returns(300);

    const calculator = require('../calculator');
    calculator.addCalculators('content', {
      height: [{ identifier: 'calender', attr: 'y' }, '+', { identifier: 'header', attr: 'height' }]
    });

    expect(calculator.compute('content', 'height')).to.equal(500);
  });

  it('calc: build compute calculator', () => {
    const calc = require('../calculator').calc;
    const builder = calc('content').height().plus(calc('calender').y()).plus(5);

    const identifierToRectIdMap = {
      content: 'uniqueNameForContent',
      calender: 'uniqueNameForCalender'
    };

    expect(builder.build(identifierToRectIdMap)).to.deep.equal([
      { identifier: 'uniqueNameForContent', attr: 'height' },
      '+',
      { identifier: 'uniqueNameForCalender', attr: 'y' },
      '+',
      5
    ]);
  });
});
