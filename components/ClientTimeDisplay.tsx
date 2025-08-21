'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface ClientTimeDisplayProps {
  label?: string;
  className?: string;
}

const ClientTimeDisplay: React.FC<ClientTimeDisplayProps> = ({ 
  label = "最后更新", 
  className = "text-sm text-gray-500" 
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('zh-CN'));
    };
    
    updateTime(); // 立即更新一次
    
    // 每分钟更新一次时间
    const interval = setInterval(updateTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  if (!currentTime) {
    return (
      <div className={className}>
        <Calendar className="w-4 h-4 inline mr-1" />
        {label}: 加载中...
      </div>
    );
  }

  return (
    <div className={className}>
      <Calendar className="w-4 h-4 inline mr-1" />
      {label}: {currentTime}
    </div>
  );
};

export default ClientTimeDisplay; 