'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapMarker, TrafficInfo, AltitudeWarning } from '../types';
import { RefreshCw, AlertTriangle, MapPin, Car, Mountain, Coffee, Route, Navigation } from 'lucide-react';

// 声明高德地图全局变量
declare global {
  interface Window {
    AMap: any;
    AMapUI: any;
  }
}

interface MapComponentProps {
  markers: MapMarker[];
  trafficInfo: TrafficInfo[];
  altitudeWarnings: AltitudeWarning[];
  onMarkerClick: (marker: MapMarker) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  markers,
  trafficInfo,
  altitudeWarnings,
  onMarkerClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 高德地图API Key
  const AMAP_KEY = '6f26c9822c56885edcac606bf196598a';

  // 加载高德地图脚本
  const loadAMapScript = () => {
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        resolve(window.AMap);
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Driving,AMap.TileLayer.Traffic,AMap.Marker,AMap.ToolBar,AMap.Scale`;
      
      script.onload = () => {
        setTimeout(() => {
          if (window.AMap) {
            resolve(window.AMap);
          } else {
            reject(new Error('AMap not available after script load'));
          }
        }, 100);
      };
      
      script.onerror = (error) => {
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  };

  // 初始化地图
  useEffect(() => {
    const initMap = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        // 确保容器存在且有尺寸
        if (!mapRef.current) {
          throw new Error('Map container ref not found');
        }

        // 等待容器渲染完成
        await new Promise<void>((resolve) => {
          const checkContainer = () => {
            if (mapRef.current && mapRef.current.offsetWidth > 0 && mapRef.current.offsetHeight > 0) {
              resolve();
            } else {
              requestAnimationFrame(checkContainer);
            }
          };
          checkContainer();
        });

        const AMap: any = await loadAMapScript();
        
        if (!AMap.Map) {
          throw new Error('AMap.Map plugin not loaded');
        }

        // 创建地图实例
        const mapInstance = new AMap.Map(mapRef.current, {
          zoom: 6,
          center: [108.3200, 22.8240], // 南宁
          mapStyle: 'amap://styles/normal',
          viewMode: '2D'
        });

        setMap(mapInstance);

        // 等待地图加载完成
        mapInstance.on('complete', () => {
          setIsLoading(false);
          drawRoute(mapInstance);
          addMarkers(mapInstance);
        });

      } catch (error) {
        console.error('Map initialization failed:', error);
        setLoadError(error instanceof Error ? error.message : 'Unknown error');
        setIsLoading(false);
      }
    };

    initMap();
  }, []);

  // 绘制路线
  const drawRoute = (mapInstance: any) => {
    if (!mapInstance) return;

    try {
      // 主要城市连线
      const routePoints = [
        [114.0579, 22.5431], // 深圳
        [108.3200, 22.8240], // 南宁
        [100.2257, 25.6942], // 大理
        [100.2330, 26.8721], // 丽江
        [106.6186, 23.9023], // 百色
        [114.0579, 22.5431]  // 返回深圳
      ];

      const polyline = new window.AMap.Polyline({
        path: routePoints,
        strokeColor: '#2563eb',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round'
      });

      mapInstance.add(polyline);
    } catch (error) {
      console.error('Failed to draw route:', error);
    }
  };

  // 添加标记点
  const addMarkers = (mapInstance: any) => {
    if (!mapInstance || !markers.length) return;

    try {
      markers.forEach(marker => {
        const amapMarker = new window.AMap.Marker({
          position: marker.position,
          title: marker.title,
          label: {
            content: `${marker.icon} ${marker.title}`,
            direction: 'top',
            offset: [0, -10]
          }
        });

        // 添加点击事件
        amapMarker.on('click', () => {
          onMarkerClick(marker);
        });

        mapInstance.add(amapMarker);
      });
    } catch (error) {
      console.error('Failed to add markers:', error);
    }
  };

  // 显示完整路线
  const showFullRoute = () => {
    if (!map) return;

    try {
      const allPoints = markers.map(marker => marker.position);
      map.setFitView(allPoints, false, [50, 50, 50, 50]);
    } catch (error) {
      console.error('Failed to show full route:', error);
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'congested': return '🔴';
      case 'slow': return '🟡';
      case 'smooth': return '🟢';
      default: return '⚪';
    }
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'congested': return 'bg-red-100 text-red-800';
      case 'slow': return 'bg-yellow-100 text-yellow-800';
      case 'smooth': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* 地图主区域 */}
      <div className="flex-1 map-container relative">
        {/* 真实高德地图容器 */}
        <div
          ref={mapRef}
          className="w-full h-full rounded-lg"
          style={{ minHeight: '400px' }}
        />

        {/* 覆盖层：加载/错误 */}
        {(isLoading || loadError) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            {!loadError && (
              <div className="text-center">
                <RefreshCw className="animate-spin w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-gray-600">正在加载高德地图...</p>
                <p className="text-xs text-gray-500 mt-2">请检查网络连接和API密钥</p>
              </div>
            )}
            {loadError && (
              <div className="text-center">
                <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-500" />
                <p className="text-red-600 font-medium text-sm">高德地图加载失败</p>
                <p className="text-xs text-gray-600 mt-1">{loadError}</p>
              </div>
            )}
          </div>
        )}

        {/* 地图控制面板 */}
        {!isLoading && !loadError && (
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow-md z-10">
            <h3 className="font-semibold text-sm mb-2 flex items-center">
              <Navigation className="w-4 h-4 mr-2 text-primary" />
              高德地图 - 7天自驾路线
            </h3>
            <div className="space-y-2 text-xs">
              <button 
                onClick={showFullRoute}
                className="flex items-center space-x-2 text-primary hover:text-primary-dark"
              >
                <Route className="w-3 h-3" />
                <span>显示完整路线</span>
              </button>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="traffic" defaultChecked />
                <label htmlFor="traffic">实时交通</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="altitude" defaultChecked />
                <label htmlFor="altitude">海拔提醒</label>
              </div>
            </div>
          </div>
        )}

        {/* 路线信息面板 */}
        {!isLoading && !loadError && (
          <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md z-10 max-w-xs">
            <h4 className="font-semibold text-sm mb-2">路线规划统计</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">深圳→南宁:</span>
                <span className="font-medium">649km / 7h12m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">南宁→大理:</span>
                <span className="font-medium">1098km / 12h20m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">大理→丽江:</span>
                <span className="font-medium">164km / 2h19m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">丽江→百色:</span>
                <span className="font-medium">999km / 11h23m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">百色→深圳:</span>
                <span className="font-medium">891km / 9h09m</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 实时交通信息 */}
      {trafficInfo && trafficInfo.length > 0 && (
        <div className="mt-4 bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">实时交通监控</h3>
            <button className="text-primary hover:text-primary-dark text-sm">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {trafficInfo.map((info, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(info.status)}</span>
                  <div>
                    <p className="font-medium text-sm">{info.roadName}</p>
                    <p className="text-xs text-gray-500">
                      预计时间: {info.estimatedTime}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(info.status)}`}>
                  {info.status === 'congested' ? '严重拥堵' : 
                   info.status === 'slow' ? '缓慢' : '畅通'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 海拔安全提醒 */}
      {altitudeWarnings && altitudeWarnings.length > 0 && (
        <div className="mt-4 bg-white rounded-lg p-4 shadow-md border-l-4 border-warning">
          <div className="flex items-center space-x-2 mb-3">
            <Mountain className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-lg">海拔安全提醒</h3>
          </div>
          <div className="space-y-3">
            {altitudeWarnings.map((warning, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{warning.location}</span>
                  <span className="text-xs bg-yellow-200 px-2 py-1 rounded-full">
                    {warning.altitude}m
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{warning.warning}</p>
                <p className="text-xs text-gray-600">{warning.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent; 