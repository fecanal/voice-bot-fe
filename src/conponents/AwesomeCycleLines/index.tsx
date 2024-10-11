import type { HTMLAttributes } from 'react';

import cx from 'classnames';
import { times } from 'lodash';

interface Props extends HTMLAttributes<HTMLDivElement> {
  lineCount: number;
  eachLineProps?: (i: number) => HTMLAttributes<HTMLDivElement>;
}

export const AwesomeCycleLines = ({
  lineCount,
  eachLineProps,
  ...props
}: Props) => (
  <div {...props} className={cx(' pointer-events-none', props.className)}>
    {times(lineCount, i => {
      const lineHeight = Number(eachLineProps?.(i).style?.height) || 0;
      const realHeight = lineHeight - 75 - 2 < 0 ? 0 : lineHeight - 75 - 2;
      return (
        <div
          className={cx('absolute -z-10', eachLineProps?.(i).className)}
          style={{
            transformOrigin: '0 0',
            transform: `rotate(${(i * 360) / lineCount}deg)`,
          }}
        >
          <div className={'h-[77px]'} />
          <div
            style={{
              ...eachLineProps?.(i).style,
              height: realHeight,
            }}
          />
        </div>
      );
    })}
  </div>
);
