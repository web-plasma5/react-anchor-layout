import { expect } from 'chai';

describe('domGeometryStore', () => {
  it('should return appropriate attr value', () => {
    const domGeometryStore = require('../domGeometryStore');
    domGeometryStore.update('calender', {
      x: 100,
      y: 200,
      width: 400,
      height: 700,
    });
    expect(domGeometryStore.getAttr('calender', 'y')).to.equal(200);
  });
});
