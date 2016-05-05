import isString from 'lodash/isString';
import { getValue } from './geometry';

const calculatorStore = {};

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

  const params = [];
  calculator.forEach(p => {
    if (isString(p)) {
      params.push(p);
      return;
    }

    params.push(getValue(p.identifier, p.attr));
  });

  if (params.indexOf(null) !== -1 || params.indexOf(undefined) !== -1) {
    return null;
  }

  return computeValue(params);
}

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

Builder.prototype.build = function build() {
  let output = [];
  this.calculators.forEach(c => {
    if (c instanceof Builder) {
      output = output.concat(c.build());
    } else {
      output.push(c);
    }
  });
  return output;
};

export function calc(idenfier) {
  return new Builder(idenfier);
}
