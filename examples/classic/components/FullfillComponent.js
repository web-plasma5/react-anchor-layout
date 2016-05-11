import React from 'react';

export default function FullfillComponent({ children }) {
  const style = {
    border: '2px solid #66FFB2',
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={style}>
      {children}
    </div>
  );
}

FullfillComponent.propTypes = {
  children: React.PropTypes.node,
};
