'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Heart, MessageCircle, Share2, MapPin, Calendar, User, X, Maximize2 } from 'lucide-react';
import { XiaohongshuContent } from '../types';

interface XiaohongshuComponentProps {
  content: XiaohongshuContent[];
  onContentClick?: (content: XiaohongshuContent) => void;
}

const XiaohongshuComponent: React.FC<XiaohongshuComponentProps> = ({ 
  content, 
  onContentClick 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [sortBy, setSortBy] = useState('相关度');
  const [previewImage, setPreviewImage] = useState<{url: string, title: string} | null>(null);

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = ['全部', ...Array.from(new Set(content.map(item => item.category)))];
    return cats;
  }, [content]);

  // 获取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    content.forEach(item => {
      item.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [content]);

  // 过滤和排序内容
  const filteredContent = useMemo(() => {
    return content
      .filter(item => 
        (selectedCategory === '全部' || item.category === selectedCategory) &&
        (searchTerm === '' || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      )
      .sort((a, b) => {
        switch (sortBy) {
          case '点赞数':
            return b.likes - a.likes;
          case '评论数':
            return b.comments - a.comments;
          case '相关度':
          default:
            return 0; // 保持原有顺序
        }
      });
  }, [content, searchTerm, selectedCategory, sortBy]);

  const handleContentClick = (item: XiaohongshuContent) => {
    if (onContentClick) {
      onContentClick(item);
    }
  };

  const handleImageClick = (e: React.MouseEvent, imageUrl: string, title: string) => {
    e.stopPropagation(); // 阻止冒泡，避免触发内容点击
    setPreviewImage({ url: imageUrl, title });
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  // ESC键关闭图片预览
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && previewImage) {
        closeImagePreview();
      }
    };

    if (previewImage) {
      document.addEventListener('keydown', handleKeyDown);
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [previewImage]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 搜索和筛选区域 */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="space-y-3">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索攻略、景点、美食..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          {/* 分类和排序选择 */}
          <div className="flex items-center space-x-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="相关度">相关度</option>
              <option value="点赞数">点赞数</option>
              <option value="评论数">评论数</option>
            </select>
          </div>
          
          {/* 标签筛选 */}
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 10).map(tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredContent.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>没有找到相关攻略</p>
            <p className="text-sm">试试其他关键词或分类</p>
          </div>
        ) : (
          filteredContent.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleContentClick(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 hover:-translate-y-1"
            >
              {/* 图片展示区域 */}
              <div className="relative group cursor-pointer" onClick={(e) => handleImageClick(e, item.imageUrl, item.title)}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x192/f3f4f6/9ca3af?text=暂无图片';
                  }}
                />
                {/* 图片点击提示 */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-t-2xl flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm p-2 rounded-full">
                    <Maximize2 className="w-5 h-5 text-gray-800" />
                  </div>
                </div>
                {/* 渐变遮罩层 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* 标签浮层 */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                </div>
                
                {/* 互动数据浮层 */}
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Heart className="w-3 h-3 text-red-500" />
                    <span className="text-xs font-medium text-gray-800">{item.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <MessageCircle className="w-3 h-3 text-blue-500" />
                    <span className="text-xs font-medium text-gray-800">{item.comments}</span>
                  </div>
                </div>
              </div>

              {/* 内容信息 */}
              <div className="p-4 space-y-3">
                {/* 标题 */}
                <h3 className="font-bold text-lg text-gray-900 leading-tight line-clamp-2">
                  {item.title}
                </h3>
                
                {/* 内容预览 */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {item.content}
                </p>
                
                {/* 作者信息 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.author}</p>
                      <p className="text-xs text-gray-500">旅行达人</p>
                    </div>
                  </div>
                  
                  {/* 标签 */}
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {item.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-xs rounded-full border border-blue-100"
                      >
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 图片预览模态框 */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeImagePreview}
        >
          <div 
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={closeImagePreview}
              className="absolute top-4 right-4 z-10 p-3 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* 图片标题 */}
            <div className="absolute top-4 left-4 z-10">
              <h3 className="px-4 py-2 bg-black/50 backdrop-blur-sm text-white text-lg font-medium rounded-full max-w-md truncate">
                {previewImage.title}
              </h3>
            </div>
            
            {/* 大图 - 完整显示 */}
            <img
              src={previewImage.url}
              alt={previewImage.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{
                maxWidth: 'calc(100vw - 2rem)',
                maxHeight: 'calc(100vh - 2rem)'
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x600/f3f4f6/9ca3af?text=图片加载失败';
              }}
            />
            
            {/* 操作提示 */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="px-4 py-2 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                点击背景区域关闭 • ESC键关闭
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default XiaohongshuComponent; 