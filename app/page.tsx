'use client';

import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import XiaohongshuComponent from '../components/XiaohongshuComponent';
import TripPlannerComponent from '../components/TripPlannerComponent';
import { tripData, mapMarkers, trafficWarnings, altitudeWarnings } from '../data/tripData';
import { xiaohongshuContent } from '../data/xiaohongshuData';
import { TripDay, MapMarker, XiaohongshuContent } from '../types';
import { 
  Map, 
  Smartphone, 
  Calendar, 
  X, 
  Maximize2, 
  Minimize2,
  Car,
  Mountain,
  AlertTriangle
} from 'lucide-react';

export default function HomePage() {
  const [selectedDay, setSelectedDay] = useState<TripDay | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [selectedContent, setSelectedContent] = useState<XiaohongshuContent | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [isContentFullscreen, setIsContentFullscreen] = useState(false);
  const [lastTrafficUpdate, setLastTrafficUpdate] = useState<Date | null>(null);

  // 使用useEffect确保时间状态只在客户端更新，避免水合错误
  useEffect(() => {
    setLastTrafficUpdate(new Date());
  }, []);

  const handleDayClick = (day: TripDay) => {
    setSelectedDay(day);
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
  };

  const handleContentClick = (content: XiaohongshuContent) => {
    setSelectedContent(content);
  };

  const handleRefreshTraffic = () => {
    setLastTrafficUpdate(new Date());
    // 这里可以添加真实的交通数据刷新逻辑
  };

  const closeModal = () => {
    setSelectedDay(null);
    setSelectedMarker(null);
    setSelectedContent(null);
  };

  const toggleMapFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
  };

  const toggleContentFullscreen = () => {
    setIsContentFullscreen(!isContentFullscreen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">深圳→大理/丽江自驾游规划</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Mountain className="w-4 h-4" />
                <span>海拔安全监控</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>实时交通预警</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 上部分：地图和小红书内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* 左侧：高德地图 */}
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isMapFullscreen ? 'fixed inset-4 z-50' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Map className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">高德地图 - 实时导航</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMapFullscreen}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isMapFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="h-96 lg:h-[500px] p-4">
              <MapComponent
                markers={mapMarkers}
                trafficInfo={trafficWarnings}
                altitudeWarnings={altitudeWarnings}
                onMarkerClick={handleMarkerClick}
              />
            </div>
          </div>

          {/* 右侧：小红书内容 */}
          <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isContentFullscreen ? 'fixed inset-4 z-50' : ''}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-pink-500" />
                <h2 className="text-lg font-semibold">小红书实时攻略</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleContentFullscreen}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isContentFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="h-96 lg:h-[500px] p-4">
              <XiaohongshuComponent
                content={xiaohongshuContent}
                onContentClick={handleContentClick}
              />
            </div>
          </div>
        </div>

        {/* 下部分：行程规划 */}
        <TripPlannerComponent
          tripData={tripData}
          onDayClick={handleDayClick}
          onRefreshTraffic={handleRefreshTraffic}
        />
      </main>

      {/* 模态框：行程详情 */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{selectedDay.title}</h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">行程信息</h3>
                  <p><strong>起点:</strong> {selectedDay.startLocation}</p>
                  <p><strong>终点:</strong> {selectedDay.endLocation}</p>
                  <p><strong>距离:</strong> {selectedDay.distance}</p>
                  <p><strong>时长:</strong> {selectedDay.duration}</p>
                  {selectedDay.altitude && (
                    <p><strong>海拔:</strong> {selectedDay.altitude}m</p>
                  )}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">交通状态</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    selectedDay.trafficStatus === 'traffic' ? 'bg-red-100 text-red-800' :
                    selectedDay.trafficStatus === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedDay.trafficStatus === 'traffic' ? '交通拥堵' :
                     selectedDay.trafficStatus === 'warning' ? '注意安全' : '路况良好'}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">行程亮点</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {selectedDay.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">注意事项</h3>
                <ul className="list-disc list-inside space-y-1 text-red-600">
                  {selectedDay.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模态框：标记点详情 */}
      {selectedMarker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{selectedMarker.title}</h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-gray-600 mb-4">{selectedMarker.description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">类型:</span>
                <span className="px-2 py-1 bg-gray-100 rounded text-sm">{selectedMarker.type}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 模态框：小红书内容详情 */}
      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">{selectedContent.title}</h2>
              <button
                onClick={closeModal}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedContent.imageUrl}
                alt={selectedContent.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 mb-4">{selectedContent.content}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>作者: {selectedContent.author}</span>
                <span>发布时间: {selectedContent.publishTime}</span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="flex items-center space-x-1">
                  <span>❤️ {selectedContent.likes}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>🔖 {selectedContent.collects}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedContent.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 全屏遮罩 */}
      {(isMapFullscreen || isContentFullscreen) && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-40" />
      )}
    </div>
  );
} 