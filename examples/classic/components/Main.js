import React from 'react';
import FullfillComponent from './FullfillComponent';
import { Rect, calc } from 'react-anchor-layout';

export default function Main() {
  return (
      <Rect
        identifier="root"
        x={0}
        y={0}
        width={'100%'}
        height={'100%'}
      >
        <Rect
          identifier="sidebar"
          x={0}
          y={0}
          width={100}
          height={calc('root').height()}
        >
          <FullfillComponent>
            Sidebar
          </FullfillComponent>
        </Rect>
        <Rect
          identifier="content"
          x={calc('sidebar').width()}
          y={0}
          width={calc('root').width().minus(calc('sidebar').width())}
          height={calc('root').height()}
        >
          <FullfillComponent>
            Content
          </FullfillComponent>
        </Rect>
      </Rect>
  );
}
