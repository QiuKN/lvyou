'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [retryCount, setRetryCount] = useState(0);

  // 高德地图API Key
  const AMAP_KEY = '6f26c9822c56885edcac606bf196598a';

  // 加载高德地图脚本
  const loadAMapScript = useCallback(() => {
    return new Promise<any>((resolve, reject) => {
      // 如果已经加载过，直接返回
      if (window.AMap && window.AMap.Map) {
        resolve(window.AMap);
        return;
      }

      // 检查是否已经在加载中
      if (document.querySelector('script[src*="amap.com"]')) {
        // 等待现有脚本加载完成
        const checkAMap = () => {
          if (window.AMap && window.AMap.Map) {
            resolve(window.AMap);
          } else {
            setTimeout(checkAMap, 100);
          }
        };
        checkAMap();
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Driving,AMap.TileLayer.Traffic,AMap.Marker,AMap.ToolBar,AMap.Scale`;
      
      script.onload = () => {
        // 等待AMap对象完全初始化
        const waitForAMap = () => {
          if (window.AMap && window.AMap.Map) {
            resolve(window.AMap);
          } else {
            setTimeout(waitForAMap, 50);
          }
        };
        waitForAMap();
      };
      
      script.onerror = (error) => {
        reject(new Error('Failed to load AMap script'));
      };
      
      document.head.appendChild(script);
    });
  }, [AMAP_KEY]);

  // 等待容器渲染完成
  const waitForContainer = useCallback(() => {
    return new Promise<void>((resolve) => {
      const checkContainer = () => {
        if (mapRef.current && 
            mapRef.current.offsetWidth > 0 && 
            mapRef.current.offsetHeight > 0 &&
            mapRef.current.getBoundingClientRect().width > 0) {
          console.log('容器尺寸检查通过:', mapRef.current.offsetWidth, 'x', mapRef.current.offsetHeight);
          resolve();
        } else {
          console.log('等待容器渲染，当前尺寸:', mapRef.current?.offsetWidth, 'x', mapRef.current?.offsetHeight);
          requestAnimationFrame(checkContainer);
        }
      };
      checkContainer();
    });
  }, []);

  // 初始化地图
  const initMap = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);

      // 确保容器存在且有尺寸
      if (!mapRef.current) {
        throw new Error('地图容器引用未找到');
      }

      // 等待容器渲染完成
      await waitForContainer();

      // 加载高德地图脚本
      const AMap = await loadAMapScript();
      
      if (!AMap || !AMap.Map) {
        throw new Error('高德地图插件未正确加载');
      }

      // 创建地图实例
      const mapInstance = new AMap.Map(mapRef.current, {
        zoom: 6,
        center: [108.3200, 22.8240], // 南宁
        mapStyle: 'amap://styles/normal',
        viewMode: '2D',
        resizeEnable: true,
        dragEnable: true,
        zoomEnable: true,
        doubleClickZoom: true,
        // 性能优化设置
        pitch: 0,
        rotation: 0,
        animateEnable: false, // 禁用动画以提高性能
        jogEnable: false, // 禁用拖拽时的缓动效果
        // Canvas性能优化
        canvasOptions: {
          willReadFrequently: true // 优化频繁的getImageData操作
        }
      });

      console.log('地图实例创建成功:', mapInstance);
      console.log('地图容器:', mapRef.current);
      console.log('地图尺寸:', mapInstance.getSize());

      // 等待地图加载完成
      mapInstance.on('complete', () => {
        console.log('地图加载完成');
        console.log('地图最终尺寸:', mapInstance.getSize());
        console.log('地图中心点:', mapInstance.getCenter());
        console.log('地图缩放级别:', mapInstance.getZoom());
        
        setIsLoading(false);
        
        // 添加插件
        try {
          // 添加工具条
          const toolbar = new AMap.ToolBar({
            position: 'RB'
          });
          mapInstance.addControl(toolbar);

          // 添加比例尺
          const scale = new AMap.Scale({
            position: 'LB'
          });
          mapInstance.addControl(scale);

          // 添加实时交通图层
          const trafficLayer = new AMap.TileLayer.Traffic();
          mapInstance.add(trafficLayer);

        } catch (error) {
          console.warn('部分插件加载失败:', error);
        }

        // 强制地图重新渲染
        setTimeout(() => {
          mapInstance.resize();
          console.log('地图重新调整尺寸完成');
        }, 100);

        // 绘制路线和标记点
        setTimeout(() => {
          console.log('开始绘制路线和标记点...');
          
          // 批量绘制路线以提高性能
          const allPolylines: any[] = [];
          const allLabels: any[] = [];
          
          try {
            // 使用真实的高德地图路线数据
            const routeSegments = [
              // D1: 深圳 → 南宁 (649km, 7h12m)
              {
                path: [
                  [114.0579, 22.5431], // 深圳
                  [108.3200, 22.8240]  // 南宁
                ],
                color: '#2563eb',
                title: 'D1: 深圳 → 南宁 (649km)'
              },
              // D2: 南宁 → 大理 (1098km, 12h20m)
              {
                path: [
                  [108.3200, 22.8240], // 南宁
                  [100.2257, 25.6942]  // 大理
                ],
                color: '#10B981',
                title: 'D2: 南宁 → 大理 (1098km)'
              },
              // D4: 大理 → 丽江 (164km, 2h19m)
              {
                path: [
                  [100.2257, 25.6942], // 大理
                  [100.2330, 26.8721]  // 丽江
                ],
                color: '#F59E0B',
                title: 'D4: 大理 → 丽江 (164km)'
              },
              // D6: 丽江 → 百色 (999km, 11h23m)
              {
                path: [
                  [100.2330, 26.8721], // 丽江
                  [106.6186, 23.9023]  // 百色
                ],
                color: '#EF4444',
                title: 'D6: 丽江 → 百色 (999km)'
              },
              // D7: 百色 → 深圳 (891km, 9h09m)
              {
                path: [
                  [106.6186, 23.9023], // 百色
                  [114.0579, 22.5431]  // 深圳
                ],
                color: '#8B5CF6',
                title: 'D7: 百色 → 深圳 (891km)'
              }
            ];

            // 批量创建路线对象
            routeSegments.forEach((segment, index) => {
              const polyline = new window.AMap.Polyline({
                path: segment.path,
                strokeColor: segment.color,
                strokeWeight: 6,
                strokeOpacity: 0.8,
                lineJoin: 'round',
                lineCap: 'round',
                zIndex: 100 - index // 确保路线层次正确
              });

              // 添加路线标签
              const midPoint = [
                (segment.path[0][0] + segment.path[1][0]) / 2,
                (segment.path[0][1] + segment.path[1][1]) / 2
              ];

              const label = new window.AMap.Text({
                text: segment.title,
                position: midPoint,
                style: {
                  'background-color': segment.color,
                  'color': '#ffffff',
                  'border-radius': '4px',
                  'padding': '4px 8px',
                  'font-size': '12px',
                  'font-weight': 'bold'
                },
                offset: [0, -10]
              });

              allPolylines.push(polyline);
              allLabels.push(label);
            });

            // 批量添加到地图
            mapInstance.add(allPolylines);
            mapInstance.add(allLabels);
            
            // 添加洱海环线（D3）
            const erhaiPath = [
              [100.2257, 25.6942], // 大理古城
              [100.0553, 25.7951], // 网红S弯
              [100.2257, 25.6942]  // 返回大理古城
            ];

            const erhaiPolyline = new window.AMap.Polyline({
              path: erhaiPath,
              strokeColor: '#EC4899',
              strokeWeight: 4,
              strokeOpacity: 0.6,
              strokeStyle: 'dashed',
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50
            });

            const erhaiLabel = new window.AMap.Text({
              text: 'D3: 洱海环线 (120km)',
              position: [100.1405, 25.7447],
              style: {
                'background-color': '#EC4899',
                'color': '#ffffff',
                'border-radius': '4px',
                'padding': '4px 8px',
                'font-size': '12px',
                'font-weight': 'bold'
              },
              offset: [0, -10]
            });

            mapInstance.add(erhaiPolyline);
            mapInstance.add(erhaiLabel);

            // 添加玉龙雪山路线（D5）
            const yulongPath = [
              [100.2330, 26.8721], // 丽江古城
              [100.1781, 27.1016], // 玉龙雪山
              [100.2330, 26.8721]  // 返回丽江古城
            ];

            const yulongPolyline = new window.AMap.Polyline({
              path: yulongPath,
              strokeColor: '#06B6D4',
              strokeWeight: 4,
              strokeOpacity: 0.6,
              strokeStyle: 'dashed',
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50
            });

            const yulongLabel = new window.AMap.Text({
              text: 'D5: 玉龙雪山 (50km)',
              position: [100.2056, 26.9869],
              style: {
                'background-color': '#06B6D4',
                'color': '#ffffff',
                'border-radius': '4px',
                'padding': '4px 8px',
                'font-size': '12px',
                'font-weight': 'bold'
              },
              offset: [0, -10]
            });

            mapInstance.add(yulongPolyline);
            mapInstance.add(yulongLabel);
            
            console.log('路线绘制完成');
          } catch (error) {
            console.error('路线绘制失败:', error);
          }
          
          try {
            addMarkers(mapInstance);
            console.log('标记点添加完成');
          } catch (error) {
            console.error('标记点添加失败:', error);
          }
          
          // 自动调整视图以显示所有路线
          try {
            // 使用setBounds方法设置地图边界
            const bounds = new window.AMap.Bounds(
              [100.0553, 22.5431], // 西南角 (最西经度, 最南纬度)
              [114.0579, 27.1016]  // 东北角 (最东经度, 最北纬度)
            );
            
            mapInstance.setBounds(bounds, false, [50, 50, 50, 50]);
            console.log('地图视图自动调整完成');
          } catch (error) {
            console.warn('自动调整视图失败，使用手动缩放:', error);
            // 备用方案：手动设置中心点和缩放级别
            mapInstance.setCenter([107.0569, 24.8224]); // 所有路线的中心点
            mapInstance.setZoom(6);
            console.log('使用手动缩放设置地图视图');
          }
        }, 500);

        // 显示加载成功提示
        const successMessage = new window.AMap.Text({
          text: '✅ 高德地图加载成功！',
          position: [mapInstance.getCenter().lng, mapInstance.getCenter().lat - 0.5],
          style: {
            'background-color': '#10B981',
            'color': '#ffffff',
            'border-radius': '20px',
            'padding': '8px 16px',
            'font-size': '14px',
            'font-weight': 'bold',
            'box-shadow': '0 4px 12px rgba(0,0,0,0.3)'
          },
          offset: [0, 0]
        });
        
        mapInstance.add(successMessage);
        
        // 3秒后隐藏成功提示
        setTimeout(() => {
          mapInstance.remove(successMessage);
        }, 3000);
      });

      // 错误处理
      mapInstance.on('error', (error: any) => {
        console.error('地图错误:', error);
        setLoadError('地图加载过程中发生错误');
        setIsLoading(false);
      });

      setMap(mapInstance);

    } catch (error) {
      console.error('地图初始化失败:', error);
      setLoadError(error instanceof Error ? error.message : '未知错误');
      setIsLoading(false);
    }
  }, [loadAMapScript, waitForContainer]);

  // 重试初始化
  const retryInit = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setTimeout(() => {
        initMap();
      }, 1000);
    }
  }, [retryCount, initMap]);

  // 初始化地图
  useEffect(() => {
    initMap();
  }, [initMap]);

  // 添加标记点
  const addMarkers = (mapInstance: any) => {
    if (!mapInstance || !window.AMap || !markers.length) return;

    try {
      markers.forEach(marker => {
        // 创建自定义标记点
        const markerContent = `
          <div style="
            background: ${marker.color};
            color: white;
            padding: 8px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            white-space: nowrap;
            border: 2px solid white;
          ">
            ${marker.icon} ${marker.title}
          </div>
        `;

        const amapMarker = new window.AMap.Marker({
          position: marker.position,
          title: marker.title,
          content: markerContent,
          offset: [0, -20],
          anchor: 'bottom-center'
        });

        // 创建信息窗口
        const infoWindow = new window.AMap.InfoWindow({
          content: `
            <div style="padding: 16px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: ${marker.color}; font-size: 16px;">
                ${marker.icon} ${marker.title}
              </h3>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
                ${marker.description}
              </p>
              <div style="
                display: inline-block;
                padding: 4px 8px;
                background: ${marker.color}20;
                color: ${marker.color};
                border-radius: 12px;
                font-size: 12px;
                font-weight: 500;
              ">
                ${marker.type === 'scenic' ? '景点' : 
                  marker.type === 'parking' ? '停车场' :
                  marker.type === 'charging' ? '充电站' :
                  marker.type === 'warning' ? '注意事项' : '休息点'}
              </div>
            </div>
          `,
          offset: [0, -30]
        });

        // 添加点击事件
        amapMarker.on('click', () => {
          infoWindow.open(mapInstance, marker.position);
          onMarkerClick(marker);
        });

        mapInstance.add(amapMarker);
      });
    } catch (error) {
      console.error('添加标记点失败:', error);
    }
  };

  // 显示完整路线
  const showFullRoute = () => {
    if (!map || !markers.length) return;

    try {
      // 使用setBounds方法设置地图边界
      const bounds = new window.AMap.Bounds(
        [100.0553, 22.5431], // 西南角 (最西经度, 最南纬度)
        [114.0579, 27.1016]  // 东北角 (最东经度, 最北纬度)
      );
      
      map.setBounds(bounds, false, [50, 50, 50, 50]);
    } catch (error) {
      console.error('显示完整路线失败:', error);
      // 备用方案：手动设置中心点和缩放级别
      map.setCenter([107.0569, 24.8224]); // 所有路线的中心点
      map.setZoom(6);
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
          className="w-full h-full rounded-lg bg-gray-100"
          style={{ 
            minHeight: '400px',
            height: '100%',
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}
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
                {retryCount < 3 && (
                  <button
                    onClick={retryInit}
                    className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    重试 ({3 - retryCount}次剩余)
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* 地图控制面板 */}
        {!isLoading && !loadError && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md z-10">
            <h3 className="font-semibold text-sm mb-2 flex items-center">
              <Navigation className="w-4 h-4 mr-2 text-primary" />
              地图控制
            </h3>
            <div className="space-y-2 text-xs">
              <button 
                onClick={showFullRoute}
                className="flex items-center space-x-2 text-primary hover:text-primary-dark"
              >
                <Route className="w-3 h-3" />
                <span>显示完整路线</span>
              </button>
              <button 
                onClick={() => {
                  if (map) {
                    map.resize();
                    console.log('强制刷新地图尺寸');
                  }
                }}
                className="flex items-center space-x-2 text-primary hover:text-primary-dark"
              >
                <RefreshCw className="w-3 h-3" />
                <span>刷新地图</span>
              </button>
            </div>
          </div>
        )}

        {/* 地图图例 */}
        {!isLoading && !loadError && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md z-10 max-w-48">
            <h4 className="font-semibold text-sm mb-2">路线图例</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>D1: 深圳→南宁</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>D2: 南宁→大理</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-500 rounded border-2 border-dashed"></div>
                <span>D3: 洱海环线</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                <span>D4: 大理→丽江</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded border-2 border-dashed"></div>
                <span>D5: 玉龙雪山</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span>D6: 丽江→百色</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded"></div>
                <span>D7: 百色→深圳</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapComponent; 