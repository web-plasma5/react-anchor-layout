import shortid from 'shortid';

const computedGeometryStore = {};
// window.computedGeometryStore = computedGeometryStore; // for debugging

const subscribers = {};

export function getComputedGeometryStore() {
  return computedGeometryStore;
}

function unsubscribe(subscriberId) {
  return () => {
    delete subscribers[subscriberId];
  };
}

export function subscribe(callback) {
  const id = shortid.generate();
  subscribers[id] = callback;
  return unsubscribe(id);
}

/**
 * Update geometry info (x, y, width, height) for reference
 * @param  {String} rectId internal identifier, build from normal identifier
 * @param  {Object} geometry  {x, y, width, height}, all the keys are optional
 */
export function update(rectId, geometry) {
  computedGeometryStore[rectId] = geometry;
}

export function get(rectId) {
  return computedGeometryStore[rectId] || {};
}

export function batchPublish() {
  const subscriberIds = Object.keys(subscribers);
  for (const sid of subscriberIds) {
    subscribers[sid](computedGeometryStore);
  }
}
