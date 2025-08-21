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
  AlertTriangle,
  RefreshCw,
  Heart,
  MessageCircle,
  Share2,
  User
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
            <div className="h-96 lg:h-[500px] p-0">
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* 头部图片区域 */}
            <div className="relative group cursor-pointer" onClick={() => setSelectedContent(null)}>
              <img
                src={selectedContent.imageUrl}
                alt={selectedContent.title}
                className="w-full h-80 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/800x320/f3f4f6/9ca3af?text=暂无图片';
                }}
              />
              {/* 图片点击提示 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-t-2xl flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm p-3 rounded-full">
                  <Maximize2 className="w-6 h-6 text-gray-800" />
                </div>
              </div>
              {/* 渐变遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-2xl" />
              
              {/* 关闭按钮 */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* 分类标签 */}
              <div className="absolute top-4 left-4">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-medium rounded-full">
                  {selectedContent.category}
                </span>
              </div>
              
              {/* 互动数据 */}
              <div className="absolute bottom-4 right-4 flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-800">{selectedContent.likes}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
                  <MessageCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-800">{selectedContent.comments}</span>
                </div>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="p-6 space-y-6">
              {/* 标题 */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                  {selectedContent.title}
                </h2>
              </div>

              {/* 作者信息 */}
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{selectedContent.author}</h3>
                  <p className="text-sm text-gray-500">旅行博主 · 已认证</p>
                </div>
                <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-200">
                  关注
                </button>
              </div>

              {/* 内容文本 */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                  {selectedContent.content}
                </p>
              </div>

              {/* 标签云 */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">相关标签</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedContent.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 互动区域 */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">点赞</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-medium">评论</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span className="font-medium">分享</span>
                    </button>
                  </div>
                  
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                    收藏攻略
                  </button>
                </div>
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