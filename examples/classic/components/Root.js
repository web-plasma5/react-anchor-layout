import React from 'react';
import FullfillComponent from './FullfillComponent';
import Main from './Main';
import { Rect, calc } from 'react-anchor-layout';

export default function Root() {
  return (
    <Rect
      identifier="root"
      x={0}
      y={0}
      width={'100%'}
      height={'100%'}
    >
      <Rect
        identifier="header"
        x={0}
        y={0}
        width={calc('root').width()}
        height={100}
      >
        <FullfillComponent>
          Header
        </FullfillComponent>
      </Rect>
      <Rect
        identifier="haha"
        x={0}
        y={calc('header').height()}
        width={calc('root').width()}
        height={calc('root').height()
          .minus(calc('header').height())
          .minus(calc('footer').height())
        }
      >
        <Main />
      </Rect>
      <Rect
        identifier="footer"
        x={0}
        y={calc('root').height().minus(calc('footer').height())}
        width={calc('root').width()}
        height={100}
      >
        <FullfillComponent>
          Footer
        </FullfillComponent>
      </Rect>
    </Rect>
  );
}
