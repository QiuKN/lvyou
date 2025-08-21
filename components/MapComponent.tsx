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

// 定义AMap类型
interface AMapType {
  Map: any;
  TileLayer: {
    Traffic: any;
  };
  Driving: any;
  Marker: any;
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
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [routePath, setRoutePath] = useState<any[]>([]);
  const [driving, setDriving] = useState<any>(null);

  // 高德地图API Key
  const AMAP_KEY = '6f26c9822c56885edcac606bf196598a';

  // 路线规划数据（从高德MCP获取的真实数据）
  const routeData = {
    day1: { distance: "648786", duration: "25937", path: "深圳→南宁" },
    day2: { distance: "1098351", duration: "44420", path: "南宁→大理" },
    day3: { distance: "164194", duration: "8340", path: "大理→丽江" },
    day6: { distance: "998653", duration: "40944", path: "丽江→百色" },
    day7: { distance: "890975", duration: "32936", path: "百色→深圳" }
  };

  // 加载高德地图脚本
  const loadAMapScript = () => {
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        console.log('AMap already loaded');
        resolve(window.AMap);
        return;
      }

      console.log('Loading AMap script...');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      // 引入所有必要的插件
      script.src = `https://webapi.amap.com/maps?v=1.4.15&key=${AMAP_KEY}&plugin=AMap.Driving,AMap.TileLayer.Traffic,AMap.Marker,AMap.ToolBar,AMap.Scale,AMap.HawkEye,AMap.MapType,AMap.GeometryUtil`;
      
      script.onload = () => {
        console.log('AMap script loaded successfully');
        // 等待一下确保插件完全加载
        setTimeout(() => {
          if (window.AMap) {
            console.log('AMap plugins loaded:', {
              Map: !!window.AMap.Map,
              Driving: !!window.AMap.Driving,
              Traffic: !!window.AMap.TileLayer?.Traffic,
              Marker: !!window.AMap.Marker
            });
            resolve(window.AMap);
          } else {
            reject(new Error('AMap not available after script load'));
          }
        }, 100);
      };
      
      script.onerror = (error) => {
        console.error('Failed to load AMap script:', error);
        reject(error);
      };
      
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    // 使用更可靠的方式来确保DOM已经渲染完成
    const checkContainerAndInit = () => {
      if (mapRef.current && mapRef.current.offsetWidth > 0 && mapRef.current.offsetHeight > 0) {
        console.log('Map container found with valid dimensions, starting initialization...');
        console.log('Container dimensions:', mapRef.current.offsetWidth, 'x', mapRef.current.offsetHeight);
        initMap();
      } else {
        console.log('Map container not ready, retrying...', {
          ref: !!mapRef.current,
          width: mapRef.current?.offsetWidth,
          height: mapRef.current?.offsetHeight
        });
        // 使用requestAnimationFrame来等待下一帧
        requestAnimationFrame(checkContainerAndInit);
      }
    };

    const initMap = async () => {
      try {
        console.log('Initializing map...');
        console.log('Map container ref:', mapRef.current);
        setIsLoading(true);
        
        const AMap = await loadAMapScript() as AMapType;
        console.log('AMap loaded:', AMap);

        // 验证必要的插件是否可用
        if (!AMap.Map) {
          throw new Error('AMap.Map 插件未加载');
        }
        if (!AMap.Driving) {
          throw new Error('AMap.Driving 插件未加载');
        }
        if (!AMap.TileLayer?.Traffic) {
          console.warn('AMap.TileLayer.Traffic 插件未加载，将跳过交通图层');
        }
        if (!AMap.Marker) {
          console.warn('AMap.Marker 插件未加载，将跳过标记功能');
        }

        console.log('Creating map instance...');
        const mapInstance = new AMap.Map(mapRef.current, {
          zoom: 5,
          center: [108.3200, 22.8240], // 南宁为中心点
          mapStyle: 'amap://styles/normal',
          features: ['bg', 'road', 'building', 'point'],
          viewMode: '3D'
        });

        console.log('Map instance created:', mapInstance);

        // 添加实时交通图层
        if (AMap.TileLayer?.Traffic) {
          try {
            const trafficLayer = new AMap.TileLayer.Traffic({
              zIndex: 10
            });
            trafficLayer.setMap(mapInstance);
            console.log('Traffic layer added');
          } catch (trafficError) {
            console.warn('Failed to add traffic layer:', trafficError);
          }
        }

        // 初始化驾车路线规划
        if (AMap.Driving) {
          try {
            const drivingInstance = new AMap.Driving({
              map: mapInstance,
              panel: 'route-panel'
            });
            setDriving(drivingInstance);
            console.log('Driving instance created');
          } catch (drivingError) {
            console.warn('Failed to create driving instance:', drivingError);
          }
        }

        setMap(mapInstance);
        setIsLoading(false);
        console.log('Map initialization completed');
      } catch (error) {
        console.error('Failed to initialize AMap:', error);
        setLoadError(error instanceof Error ? error.message : '未知错误');
        setIsLoading(false);
      }
    };

    // 延迟一点时间确保组件完全挂载
    const timer = setTimeout(() => {
      checkContainerAndInit();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker);
    onMarkerClick(marker);
  };

  // 路线规划功能
  const planRoute = (start: string, end: string) => {
    if (driving && map) {
      driving.search(start, end, (status: string, result: any) => {
        if (status === 'complete') {
          console.log('路线规划成功:', result);
        } else {
          console.error('路线规划失败:', result);
        }
      });
    }
  };

  // 显示完整7天路线
  const showFullRoute = () => {
    if (driving && map && window.AMap) {
      // 规划完整路线：深圳→南宁→大理→丽江→百色→深圳
      const waypoints = [
        [114.0579, 22.5431], // 深圳
        [108.3200, 22.8240], // 南宁
        [100.2257, 25.6942], // 大理
        [100.2330, 26.8721], // 丽江
        [106.6186, 23.9023], // 百色
        [114.0579, 22.5431]  // 返回深圳
      ];

      // 添加路线标记
      waypoints.forEach((point, index) => {
        const marker = new window.AMap.Marker({
          position: point,
          title: ['深圳', '南宁', '大理', '丽江', '百色', '深圳'][index]
        });
        marker.setMap(map);
      });

      // 调整地图视野以显示所有点
      map.setFitView();
    }
  };

  // 格式化时间
  const formatDuration = (seconds: string) => {
    const hours = Math.floor(parseInt(seconds) / 3600);
    const minutes = Math.floor((parseInt(seconds) % 3600) / 60);
    return `${hours}小时${minutes}分钟`;
  };

  // 格式化距离
  const formatDistance = (meters: string) => {
    const km = Math.floor(parseInt(meters) / 1000);
    return `${km}公里`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'congested':
        return 'text-red-600 bg-red-100';
      case 'slow':
        return 'text-yellow-600 bg-yellow-100';
      case 'smooth':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'congested':
        return '🔴';
      case 'slow':
        return '🟡';
      case 'smooth':
        return '🟢';
      default:
        return '⚪';
    }
  };

  if (isLoading) {
    return (
      <div className="map-container flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin w-8 h-8 mx-auto mb-2 text-primary" />
          <p className="text-gray-600">正在加载高德地图...</p>
          <p className="text-xs text-gray-500 mt-2">请检查网络连接和API密钥</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <p>调试信息：</p>
            <p>API Key: {AMAP_KEY.substring(0, 8)}...</p>
            <p>容器状态: {mapRef.current ? '已找到' : '未找到'}</p>
            <p>容器ID: {mapRef.current?.id || '无ID'}</p>
            <p>容器类名: {mapRef.current?.className || '无类名'}</p>
            <p>容器尺寸: {mapRef.current ? `${mapRef.current.offsetWidth}x${mapRef.current.offsetHeight}` : '未知'}</p>
            <p>容器可见性: {mapRef.current ? (mapRef.current.offsetParent ? '可见' : '不可见') : '未知'}</p>
            <p>容器样式: {mapRef.current ? getComputedStyle(mapRef.current).display : '未知'}</p>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>如果一直显示加载中，请检查：</p>
            <p>1. 网络连接是否正常</p>
            <p>2. 浏览器控制台是否有错误</p>
            <p>3. 高德地图API密钥是否有效</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="map-container flex flex-col">
        {/* 错误提示 */}
        <div className="flex items-center justify-center p-4 bg-red-50 border-b border-red-200">
          <div className="text-center">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-500" />
            <p className="text-red-600 font-medium text-sm">高德地图加载失败</p>
            <p className="text-xs text-gray-600 mt-1">{loadError}</p>
          </div>
        </div>
        
        {/* 备用地图显示 */}
        <div className="flex-1 p-4">
          <div className="bg-gray-100 rounded-lg p-4 h-full flex flex-col">
            <div className="text-center mb-4">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <h3 className="font-semibold text-gray-700">7天自驾路线概览</h3>
              <p className="text-sm text-gray-500">高德地图暂时不可用，显示路线信息</p>
            </div>
            
            {/* 路线信息 */}
            <div className="flex-1 space-y-3">
              {Object.entries(routeData).map(([day, data]) => (
                <div key={day} className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-gray-700">{data.path}</span>
                    <span className="text-xs text-gray-500">
                      {formatDistance(data.distance)} / {formatDuration(data.duration)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 重试按钮 */}
            <div className="mt-4 text-center">
              <button 
                                 onClick={() => {
                   setLoadError(null);
                   setIsLoading(true);
                   // 重新初始化地图
                                       const retryInitMap = async () => {
                      try {
                        // 等待容器可用
                        if (!mapRef.current) {
                          console.log('Waiting for container on retry...');
                          setTimeout(retryInitMap, 100);
                          return;
                        }
                        
                        const AMap = await loadAMapScript() as AMapType;
                        console.log('AMap loaded on retry:', AMap);

                        // 验证必要的插件
                        if (!AMap.Map) {
                          throw new Error('AMap.Map 插件未加载');
                        }

                        const mapInstance = new AMap.Map(mapRef.current, {
                          zoom: 5,
                          center: [108.3200, 22.8240],
                          mapStyle: 'amap://styles/normal',
                          features: ['bg', 'road', 'building', 'point'],
                          viewMode: '3D'
                        });

                        setMap(mapInstance);
                        setIsLoading(false);
                        console.log('Map retry successful');
                      } catch (error) {
                        console.error('Map retry failed:', error);
                        setLoadError(error instanceof Error ? error.message : '未知错误');
                        setIsLoading(false);
                      }
                    };
                   retryInitMap();
                 }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm"
              >
                重试加载高德地图
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        
        {/* 地图控制面板 */}
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

        {/* 路线信息面板 */}
        <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-md z-10 max-w-xs">
          <h4 className="font-semibold text-sm mb-2">路线规划统计</h4>
          <div className="space-y-2 text-xs">
            {Object.entries(routeData).map(([day, data]) => (
              <div key={day} className="flex justify-between items-center">
                <span className="text-gray-600">{data.path}:</span>
                <span className="font-medium">
                  {formatDistance(data.distance)} / {formatDuration(data.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 隐藏的路线面板 */}
        <div id="route-panel" className="hidden"></div>
      </div>

      {/* 实时交通信息 */}
      <div className="mt-4 bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">实时交通监控</h3>
          <button className="text-primary hover:text-primary-dark text-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {trafficInfo.map((info) => (
            <div key={info.roadName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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

      {/* 海拔安全提醒 */}
      {altitudeWarnings.length > 0 && (
        <div className="mt-4 bg-white rounded-lg p-4 shadow-md border-l-4 border-warning">
          <div className="flex items-center space-x-2 mb-3">
            <Mountain className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-lg">海拔安全提醒</h3>
          </div>
          <div className="space-y-3">
            {altitudeWarnings.map((warning) => (
              <div key={warning.location} className="p-3 bg-yellow-50 rounded-lg">
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