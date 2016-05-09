import * as domGeometryStore from './domGeometryStore';
import * as computedGeometryStore from './computedGeometryStore';
import * as calculator from './calculator';

let checkingStarted = false;
function dirtyChecking() {
  if (domGeometryStore.isDirty()) {
    const rectIds = calculator.getRelatedRectIds();

    for (const rectId of rectIds) {
      const calculators = calculator.getCalculators(rectId);
      const attrs = Object.keys(calculators);
      const computed = {};
      for (const attr of attrs) {
        computed[attr] = calculator.compute(rectId, attr);
      }
      computedGeometryStore.update(rectId, computed);
    }
    computedGeometryStore.batchPublish();
    domGeometryStore.clearDirty();
  }

  requestAnimationFrame(dirtyChecking);
}

export function startDirtyChecking() {
  if (checkingStarted) return;
  checkingStarted = true;
  dirtyChecking();
}
