import React from 'react';
import { BaseEdge, getBezierPath } from '@xyflow/react';

export const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style }) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge id={id} path={edgePath } style={{ stroke: '#000000', strokeWidth: 2 }} />
    </>
  );
};
