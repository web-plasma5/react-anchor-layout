import { expect } from 'chai';
import sinon from 'sinon';
import * as geometry from '../geometry';

describe('calculator', () => {
  let getValue;

  beforeEach(() => {
    getValue = sinon.stub(geometry, 'getValue');
  });

  afterEach(() => {
    getValue.restore();
  });

  it('compute: should return null if any attrubutes depended on is not ready yet', () => {
    getValue.withArgs('calender', 'y').returns(200);
    getValue.withArgs('header', 'height').returns(undefined);

    const calculator = require('../calculator');
    calculator.addCalculators('content', {
      height: [{ identifier: 'calender', attr: 'y' }, '+', { identifier: 'header', attr: 'height' }]
    });

    expect(calculator.compute('content', 'height')).to.equal(null);
  });

  it('compute: should return appropriate attr value', () => {
    getValue.withArgs('calender', 'y').returns(200);
    getValue.withArgs('header', 'height').returns(300);

    const calculator = require('../calculator');
    calculator.addCalculators('content', {
      height: [{ identifier: 'calender', attr: 'y' }, '+', { identifier: 'header', attr: 'height' }]
    });

    expect(calculator.compute('content', 'height')).to.equal(500);
  });

  it('calc: build compute calculator', () => {
    const calc = require('../calculator').calc;
    const builder = calc('content').height().plus(calc('calender').y()).plus(5);

    expect(builder.build()).to.deep.equal([
      { identifier: 'content', attr: 'height' },
      '+',
      { identifier: 'calender', attr: 'y' },
      '+',
      5
    ]);
  });
});
