import { expect } from 'chai';

describe('geometry', () => {
  it('should return appropriate attr value', () => {
    const geometry = require('../geometry');
    geometry.addGeometry('calender', {
      x: 100,
      y: 200,
      width: 400,
      height: 700,
    });
    expect(geometry.getValue('calender', 'y')).to.equal(200);
  });
});
