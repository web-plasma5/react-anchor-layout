import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import * as domGeometryStore from './domGeometryStore';

const calculatorStore = {};
// window.calculatorStore = calculatorStore; // may need this for debugging

export function getRelatedRectIds() {
  return Object.keys(calculatorStore);
}

export function addCalculators(identifier, calculators) {
  calculatorStore[identifier] = calculators;
}

export function addCalculator(identifier, attr, calculator) {
  if (!calculatorStore[identifier]) {
    calculatorStore[identifier] = {};
  }

  calculatorStore[identifier][attr] = calculator;
}

export function getCalculators(identifier) {
  return calculatorStore[identifier] || {};
}

/**
 * compute final value in params
 * TODO support parentheses
 * @param  {array} params
 * @return {number}
 */
function computeValue(params) {
  const ops = ['+', '-', '*', '/'];
  let op;
  const value = params.reduce((prev, curr) => {
    if (ops.indexOf(curr) !== -1) {
      op = curr;
      return prev;
    }
    switch (op) {
      case '+':
        return prev + curr;
      case '-':
        return prev - curr;
      case '*':
        return prev * curr;
      case '/':
        if (curr === 0) {
          return prev;
        }
        return prev / curr;
      default:
        return prev;
    }
  });

  return value;
}

export function compute(identifier, attr) {
  const calculator = getCalculators(identifier)[attr];
  if (!calculator) {
    return null;
  }

  // assume that
  // it's a number, such as 200
  // it's a string, such as '100%'
  if (!isArray(calculator)) {
    return calculator;
  }

  const params = [];
  calculator.forEach(p => {
    if (isPlainObject(p)) {
      params.push(domGeometryStore.getAttr(p.identifier, p.attr));
    } else {
      params.push(p);
    }
  });

  if (params.indexOf(null) !== -1 || params.indexOf(undefined) !== -1) {
    return null;
  }

  return computeValue(params);
}

// TODO support div and mul
function Builder(idenfier) {
  this.idenfier = idenfier;
  this.calculators = [];
}

Builder.prototype.x = function x() {
  this.calculators.push({ identifier: this.idenfier, attr: 'x' });
  return this;
};

Builder.prototype.y = function y() {
  this.calculators.push({ identifier: this.idenfier, attr: 'y' });
  return this;
};

Builder.prototype.width = function width() {
  this.calculators.push({ identifier: this.idenfier, attr: 'width' });
  return this;
};

Builder.prototype.height = function height() {
  this.calculators.push({ identifier: this.idenfier, attr: 'height' });
  return this;
};

Builder.prototype.plus = function plus(value) {
  this.calculators.push('+');
  this.calculators.push(value);
  return this;
};

Builder.prototype.minus = function plus(value) {
  this.calculators.push('-');
  this.calculators.push(value);
  return this;
};

// TODO support parentheses, every build should wrap the result with parentheses
Builder.prototype.build = function build(identifierToRectIdMap) {
  let output = [];
  this.calculators.forEach(c => {
    if (c instanceof Builder) {
      output = output.concat(c.build(identifierToRectIdMap));
    } else {
      if (isPlainObject(c)) {
        output.push({ identifier: identifierToRectIdMap[c.identifier], attr: c.attr });
      } else {
        output.push(c);
      }
    }
  });
  return output;
};

export function calc(idenfier) {
  return new Builder(idenfier);
}
