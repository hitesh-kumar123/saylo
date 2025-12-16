import React from 'react';
import { XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { EmotionDataPoint } from '../../types';

interface PerformanceMetricsProps {
  metrics: {
    eyeContact: number;
    confidence: number;
    clarity: number;
    enthusiasm: number;
    posture: number;
  };
  emotionTimeline: EmotionDataPoint[];
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics, emotionTimeline }) => {
  const formatMetricLabel = (label: string): string => {
    return label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const formatMetricValue = (value: number): string => {
    return (value * 100).toFixed(0) + '%';
  };

  const getMetricColor = (value: number): string => {
    if (value >= 0.8) return '#10B981'; // Good - success
    if (value >= 0.6) return '#F59E0B'; // Average - warning
    return '#EF4444'; // Needs improvement - error
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const emotions = emotionTimeline.map(point => ({
    ...point,
    time: formatDate(point.timestamp),
  }));

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'confident': return '#10B981';
      case 'engaged': return '#3B82F6';
      case 'neutral': return '#6B7280';
      case 'nervous': return '#F59E0B';
      case 'confused': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Current Performance</h3>
        <div className="space-y-2">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <span className="text-xs text-slate-600 dark:text-slate-400 w-24">{formatMetricLabel(key)}</span>
              <div className="flex-grow h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    width: `${value * 100}%`, 
                    backgroundColor: getMetricColor(value)
                  }}
                ></div>
              </div>
              <span className="ml-2 text-xs font-medium" style={{ color: getMetricColor(value) }}>
                {formatMetricValue(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {emotions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Emotion Timeline</h3>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emotions}>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10 }} 
                  interval="preserveStartEnd" 
                />
                <YAxis 
                  domain={[0, 1]} 
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
                />
                <Tooltip 
                  formatter={(value, name) => [`${(Number(value) * 100).toFixed(0)}%`, name]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="intensity" 
                  name="Intensity"
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={4} 
                        fill={getEmotionColor(payload.emotion)} 
                        stroke="none"
                      />
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {['confident', 'engaged', 'neutral', 'nervous', 'confused'].map(emotion => (
              <div key={emotion} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-1" 
                  style={{ backgroundColor: getEmotionColor(emotion) }}
                ></div>
                <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">{emotion}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};