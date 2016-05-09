/**
 * Save (x, y width, height) for every Rect, in px format,
 * used for computing
 */
import isEqual from 'lodash/isEqual';

const domGeometryStore = {};
// window.domGeometryStore = domGeometryStore;  // for debugging
let dirty = false;
/**
 * Update geometry info (x, y, width, height) for reference
 * @param  {String} rectId internal identifier, build from normal identifier
 * @param  {Object} geometry  {x, y, width, height}
 */
export function update(rectId, geometry) {
  if (isEqual(domGeometryStore[rectId], geometry)) return;
  dirty = true;
  domGeometryStore[rectId] = geometry;
  // console.log('updated', RectGeometry)
}

export function get(rectId) {
  return domGeometryStore[rectId] || {};
}

export function getAttr(rectId, attr) {
  return get(rectId)[attr];
}

export function isDirty() {
  return dirty;
}

export function clearDirty() {
  dirty = false;
}

export function forceDirty() {
  dirty = true;
}
