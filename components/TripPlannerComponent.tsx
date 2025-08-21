'use client';

import React, { useState } from 'react';
import { TripDay } from '../types';
import { 
  ChevronDown, 
  ChevronRight, 
  MapPin, 
  Clock, 
  Car, 
  AlertTriangle, 
  Mountain,
  RefreshCw,
  Route
} from 'lucide-react';
import ClientTimeDisplay from './ClientTimeDisplay';

interface TripPlannerComponentProps {
  tripData: TripDay[];
  onDayClick: (day: TripDay) => void;
  onRefreshTraffic: () => void;
}

const TripPlannerComponent: React.FC<TripPlannerComponentProps> = ({
  tripData,
  onDayClick,
  onRefreshTraffic
}) => {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1]));

  const toggleDay = (dayId: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayId)) {
      newExpanded.delete(dayId);
    } else {
      newExpanded.add(dayId);
    }
    setExpandedDays(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'traffic':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'safe':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'traffic':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'safe':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status) {
      case 'traffic':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'safe':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Route className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">7天自驾游行程规划</h2>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefreshTraffic}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>刷新交通</span>
          </button>
          <ClientTimeDisplay />
        </div>
      </div>

      {/* 行程概览 */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {tripData.map((day) => (
          <div
            key={day.id}
            className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
              expandedDays.has(day.id) 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => toggleDay(day.id)}
          >
            <div className="text-lg font-bold">{day.date}</div>
            <div className="text-xs truncate">{day.title.split('→')[0]}</div>
          </div>
        ))}
      </div>

      {/* 详细行程卡片 */}
      <div className="space-y-4">
        {tripData.map((day) => (
          <div
            key={day.id}
            className={`trip-card ${getBorderColor(day.trafficStatus)} ${getStatusColor(day.trafficStatus)}`}
          >
            {/* 行程头部 */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleDay(day.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl font-bold text-gray-700">{day.date}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{day.title}</h3>
                    <p className="text-sm text-gray-600">{day.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(day.trafficStatus)}</span>
                    <span className={`status-badge ${
                      day.trafficStatus === 'traffic' ? 'status-traffic' :
                      day.trafficStatus === 'warning' ? 'status-warning' : 'status-safe'
                    }`}>
                      {day.trafficStatus === 'traffic' ? '交通拥堵' :
                       day.trafficStatus === 'warning' ? '注意安全' : '路况良好'}
                    </span>
                  </div>
                  {expandedDays.has(day.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {/* 展开内容 */}
            {expandedDays.has(day.id) && (
              <div className="px-4 pb-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* 基本信息 */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">起点:</span> {day.startLocation}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">终点:</span> {day.endLocation}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Car className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">距离:</span> {day.distance}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">时长:</span> {day.duration}
                      </span>
                    </div>
                    {day.altitude && (
                      <div className="flex items-center space-x-2">
                        <Mountain className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-yellow-700">
                          <span className="font-medium">海拔:</span> {day.altitude}m
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 亮点和注意事项 */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">🌟 行程亮点</h4>
                      <ul className="space-y-1">
                        {day.highlights.map((highlight, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start space-x-2">
                            <span className="text-yellow-500 mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">⚠️ 注意事项</h4>
                      <ul className="space-y-1">
                        {day.warnings.map((warning, index) => (
                          <li key={index} className="text-xs text-red-600 flex items-start space-x-2">
                            <span className="text-red-500 mt-1">•</span>
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => onDayClick(day)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
                  >
                    查看详情
                  </button>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>点击展开/收起查看详细行程</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 安全提醒 */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          <h4 className="font-semibold text-yellow-800">安全提醒</h4>
        </div>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 单日行车时间不超过8小时（除D6）</li>
          <li>• 避免3000米以上海拔夜间驾驶</li>
          <li>• D6行程包含2个强制休息区</li>
          <li>• D7截止时间00:00，注意时间安排</li>
        </ul>
      </div>
    </div>
  );
};

export default TripPlannerComponent; 