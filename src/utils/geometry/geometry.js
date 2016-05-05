const geometryStore = {};

export function addGeometry(identifier, geometry) {
  geometryStore[identifier] = geometry;
}

export function getGeometry(identifier) {
  return geometryStore[identifier] || {};
}

export function getValue(identifier, attr) {
  return getGeometry(identifier)[attr];
}
