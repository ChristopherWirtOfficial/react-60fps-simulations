
import React, { FC } from 'react';
import { useDebugMetrics } from '../hooks/useDebugMetric';

const DebugMetrics: FC = () => {
  const debugMetrics = useDebugMetrics();

  return (
    <div className="debug-metrics">
      {
        Object.entries(debugMetrics).map(([ key, value ]) => (
          <div key={ key }>
            { key }: { value }
          </div>
        ))
      }
    </div>
  );
};

export default DebugMetrics;
