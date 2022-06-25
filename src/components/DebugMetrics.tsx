
import React, { FC } from 'react';
import { useDebugMetrics } from '../hooks/useDebugMetric';

const DebugMetrics: FC = () => {
  const { metrics } = useDebugMetrics();

  return (
    <div className="debug-metrics">
      {
        Object.entries(metrics).map(([ key, value ]) => (
          <div key={ key }>
            <span>{ key }: </span>
            <span>{ value }</span>
          </div>
        ))
      }
    </div>
  );
};

export default DebugMetrics;
