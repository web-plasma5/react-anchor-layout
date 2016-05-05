import { expect } from 'chai';

describe('calculator', () => {
  it('compute: should return null if any attrubutes depended on is not ready yet', () => {
    const geometry = require('../geometry');
    geometry.addGeometry('calender', {
      x: 100,
      y: 200,
      width: 400,
      height: 700,
    });

    const calculator = require('../calculator');
    calculator.addCalculators('content', {
      height: [{ identifier: 'calender', attr: 'y' }, '+', { identifier: 'header', attr: 'height' }]
    });

    expect(calculator.compute('content', 'height')).to.equal(null);
  });

  it('compute: should return appropriate attr value', () => {
    const geometry = require('../geometry');
    geometry.addGeometry('calender', {
      x: 100,
      y: 200,
      width: 400,
      height: 700,
    });

    geometry.addGeometry('header', {
      x: 50,
      y: 100,
      width: 200,
      height: 300,
    });

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
