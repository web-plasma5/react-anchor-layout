import React, { Component, PropTypes } from 'react';
import shortid from 'shortid';
import isEqual from 'lodash/isEqual';
import * as calculator from '../core/calculator';
import * as domGeometryStore from '../core/domGeometryStore';
import * as computedGeometryStore from '../core/computedGeometryStore';

export default class Rect extends Component {
  static propTypes = {
    identifier: PropTypes.string,
    children: PropTypes.node,
    hasDirectParentRect: PropTypes.bool,
    parentIdentifier: PropTypes.string,
  };

  static contextTypes = {
    registerIdentifier: PropTypes.func,
    getIdentifierToRectIdMap: PropTypes.func,
    getParentIdentifier: PropTypes.func,
  };

  static childContextTypes = {
    registerIdentifier: PropTypes.func,
    getIdentifierToRectIdMap: PropTypes.func,
    getParentIdentifier: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.identifier = props.identifier || shortid.generate();
    this.rectId = this.getRectId();
    this.identifierToRectIdMap = this.getIdentifierToRectIdMap();
    this.registerIdentifier(this.identifier, this.rectId);
    this.sizeSensor = {};
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.calculators = this.buildCalculators(props);
    this.lastComputedGemotry = null;
    this.registerCalculator(this.calculators);
    this.state = {
      visibility: 'hidden',
      computedStyle: {
        left: null,
        top: null,
        width: null,
        height: null,
      }
    };
  }

  componentDidMount() {
    this.resetSizeSensor();
    this.trySubscribe();

    this.sizeSensor.expand.addEventListener('scroll', this.handleSizeChange);
    this.sizeSensor.shrink.addEventListener('scroll', this.handleSizeChange);
    if (this.getParentIdentifier() === 'window') {
      // Reduce flash at the first mounting, I have not found a better way yet.
      setTimeout(() => {
        this.setState({
          visibility: 'visible',
        });
      });
    }
  }

  componentWillUnmount() {
    this.tryUnsubscribe();
    this.sizeSensor.expand.removeEventListener('scroll', this.handleSizeChange);
    this.sizeSensor.shrink.removeEventListener('scroll', this.handleSizeChange);
  }

  componentWillReceiveProps(nextProps) {
    const nextCalculators = this.buildCalculators(nextProps);
    if (isEqual(this.calculators, nextCalculators)) return;
    this.calculators = nextCalculators;
    this.registerCalculator(nextCalculators);
    domGeometryStore.forceDirty();
  }

  getChildContext() {
    return {
      registerIdentifier: this.registerIdentifier.bind(this),
      getIdentifierToRectIdMap: this.getIdentifierToRectIdMap.bind(this),
      getParentIdentifier: () => this.identifier,
    };
  }

  registerIdentifier(identifier, rectId) {
    if (this.props.hasDirectParentRect) {
      this.context.registerIdentifier(identifier, rectId);
      return;
    }

    this.identifierToRectIdMap = this.identifierToRectIdMap || {};
    this.identifierToRectIdMap[identifier] = rectId;
  }

  getIdentifierToRectIdMap() {
    if (this.props.hasDirectParentRect) {
      return this.context.getIdentifierToRectIdMap();
    }

    return this.identifierToRectIdMap || {};
  }

  trySubscribe() {
    if (!this.unsubscribe) {
      this.unsubscribe = computedGeometryStore.subscribe(this.handleUpdate);
    }
  }

  tryUnsubscribe() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  handleUpdate(computedStore) {
    const computed = computedStore[this.rectId];
    if (isEqual(this.lastComputedGemotry, computed)) return;
    this.lastComputedGemotry = computed;
    const computedStyle = {};
    ['x', 'y', 'width', 'height'].forEach((attr) => {
      let styleAttr = attr;
      if (styleAttr === 'x') {
        styleAttr = 'left';
      }

      if (styleAttr === 'y') {
        styleAttr = 'top';
      }
      computedStyle[styleAttr] = computed[attr];
    });

    this.setState({
      computedStyle
    });
  }

  resetSizeSensor() {
    this.sizeSensor.expand.scrollLeft = 10000;
    this.sizeSensor.expand.scrollTop = 10000;

    this.sizeSensor.shrink.scrollLeft = 10000;
    this.sizeSensor.shrink.scrollTop = 10000;
  }

  handleSizeChange() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    let x;
    let y;
    if (this.hasDirectParentRect) {
      x = this.container.offsetLeft;
      y = this.container.offsetTop;
    } else {
      x = y = 0;
    }

    domGeometryStore.update(this.rectId, {
      x, y, width, height
    });

    this.resetSizeSensor();
  }

  buildCalculators(props) {
    const calculators = {};
    ['x', 'y', 'width', 'height'].forEach(attr => {
      if (props[attr]) {
        let attrCalculator;
        if (props[attr].build) {
          attrCalculator = props[attr].build(this.identifierToRectIdMap);
        } else {
          attrCalculator = props[attr];
        }
        calculators[attr] = attrCalculator;
      }
    });

    return calculators;
  }

  registerCalculator(calculators) {
    calculator.addCalculators(this.rectId, calculators);
  }

  getRectId() {
    if (this.rectId) return this.rectId;
    return `${shortid.generate()}_${this.identifier}`;
  }

  getParentIdentifier() {
    if (this.context.getParentIdentifier) {
      return this.context.getParentIdentifier();
    }
    return 'window';
  }

  renderSizeSensor() {
    const style = {
      position: 'absolute',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: -1,
      visibility: 'hidden'
    };

    const styleExpandChild = {
      position: 'absolute',
      left: 0,
      top: 0,
      transition: '0s',
      width: 10000,
      height: 10000
    };

    const styleShrinkChild = {
      position: 'absolute',
      left: 0,
      top: 0,
      transition: '0s',
      width: '200%',
      height: '200%',
    };

    const expandSensor = (
      <div key="expand" style={style} ref={expand => { this.sizeSensor.expand = expand; }}>
        <div style={styleExpandChild}></div>
      </div>
    );

    const shrinkSensor = (
      <div key="shrink" style={style} ref={shrink => { this.sizeSensor.shrink = shrink; }}>
        <div style={styleShrinkChild}></div>
      </div>
    );

    return [expandSensor, shrinkSensor];
  }

  computeGeometry() {
    const geometryStyle = {};
    ['x', 'y', 'width', 'height'].forEach((attr) => {
      let styleAttr = attr;
      if (styleAttr === 'x') {
        styleAttr = 'left';
      }

      if (styleAttr === 'y') {
        styleAttr = 'top';
      }
      geometryStyle[styleAttr] = calculator.compute(this.rectId, attr);
    });

    return geometryStyle;
  }

  renderBounded(children) {
    const style = {
      display: 'inline-block',
      position: 'absolute',
      overflow: 'hidden',
    };
    return (
      <div style={{ ...style, ...this.state.computedStyle }} ref={c => { this.container = c; }}>
        {this.renderSizeSensor()}
        {children}
      </div>
    );
  }

  render() {
    const children = React.Children.map(this.props.children, (child) => {
      if (React.isValidElement(child)) {
        if (child.type === Rect) {
          return React.cloneElement(child, {
            hasDirectParentRect: true,
          });
        }
      }

      return child;
    });

    if (this.getParentIdentifier() !== 'window') {
      return this.renderBounded(children);
    }

    const style = {
      position: 'absolute',
      visibility: this.state.visibility,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };

    return (
      <div style={style}>
        {this.renderBounded(children)}
      </div>
    );
  }
}
