'use client';

import React, { useState } from 'react';
import { XiaohongshuContent } from '../types';
import { Heart, Bookmark, Share2, MapPin, Clock, User, Search, Filter } from 'lucide-react';

interface XiaohongshuComponentProps {
  content: XiaohongshuContent[];
  onContentClick: (content: XiaohongshuContent) => void;
}

const XiaohongshuComponent: React.FC<XiaohongshuComponentProps> = ({
  content,
  onContentClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'likes' | 'time' | 'relevance'>('relevance');

  const filteredContent = content
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'likes':
          return b.likes - a.likes;
        case 'time':
          return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime();
        default:
          return 0;
      }
    });

  const locations = ['all', ...Array.from(new Set(content.map(item => item.location)))];

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + 'w';
    }
    return num.toString();
  };

  const getStatusBadge = (likes: number) => {
    if (likes >= 3000) return 'status-safe';
    if (likes >= 1000) return 'status-warning';
    return 'status-traffic';
  };

  return (
    <div className="h-full flex flex-col">
      {/* 搜索和筛选栏 */}
      <div className="bg-white rounded-lg p-4 shadow-md mb-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索攻略、地点、标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {locations.map(location => (
              <option key={location} value={location}>
                {location === 'all' ? '全部地点' : location}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'likes' | 'time' | 'relevance')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="relevance">相关度</option>
            <option value="likes">点赞数</option>
            <option value="time">发布时间</option>
          </select>
        </div>
        
        {/* 热门标签 */}
        <div className="flex flex-wrap gap-2">
          {['洱海', '玉龙雪山', '大理古城', '丽江', '自驾游', '避坑指南'].map(tag => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-white rounded-full text-sm transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 内容瀑布流 */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContent.map((item) => (
            <div
              key={item.id}
              className="content-card cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => onContentClick(item)}
            >
              {/* 图片区域 */}
              <div className="relative mb-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <span className={`status-badge ${getStatusBadge(item.likes)}`}>
                    {item.likes >= 3000 ? '🔥 热门' : 
                     item.likes >= 1000 ? '⭐ 推荐' : '📝 攻略'}
                  </span>
                </div>
              </div>

              {/* 内容区域 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {item.content}
                </p>
                
                {/* 标签 */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 作者和互动信息 */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{item.publishTime}</span>
                  </div>
                </div>

                {/* 互动按钮 */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{formatNumber(item.likes)}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <Bookmark className="w-4 h-4" />
                      <span>{formatNumber(item.collects)}</span>
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-gray-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredContent.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>没有找到相关攻略</p>
            <p className="text-sm">尝试调整搜索条件或筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default XiaohongshuComponent; 