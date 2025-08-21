import { TripDay, MapMarker, TrafficInfo, AltitudeWarning } from '../types';

export const tripData: TripDay[] = [
  {
    id: 1,
    date: 'D1',
    title: '深圳 → 南宁',
    description: '出发日，全程高速，建议傍晚出发避开早高峰',
    startLocation: '深圳市福田区',
    endLocation: '南宁市青秀区',
    distance: '649公里',
    duration: '7小时12分钟',
    highlights: [
      '经G4京港澳高速、G2518深岑高速',
      '途经深中大桥、深中隧道',
      '南宁宵夜美食体验（凌晨1点江南区黎塘六叔美食）'
    ],
    warnings: [
      '深中隧道、G2518深岑高速多隧道路段，注意行车安全',
      '夜间行车建议2小时休息一次',
      '广昆高速百色段可能拥堵'
    ],
    trafficStatus: 'warning',
    isExpanded: false
  },
  {
    id: 2,
    date: 'D2',
    title: '南宁 → 大理',
    description: '全程高速，途经昆明，注意高原反应',
    startLocation: '南宁市青秀区',
    endLocation: '大理古城',
    distance: '1098公里',
    duration: '12小时20分钟',
    highlights: [
      '经G80广昆高速、G78汕昆高速、G56杭瑞高速',
      '途经师宗隧道、阳宗隧道等30多个隧道',
      '昆明科技园立交进入G56杭瑞高速',
      '大理古城夜景（注意停车场收费问题）'
    ],
    warnings: [
      '单日行车时间超长，建议昆明或曲靖休息',
      'G78汕昆高速隧道群密集，注意行车安全',
      '海拔逐渐升高，注意高原反应',
      '大理古城停车场10元/小时，建议提前查看停车攻略'
    ],
    trafficStatus: 'traffic',
    isExpanded: false
  },
  {
    id: 3,
    date: 'D3',
    title: '洱海环线',
    description: '洱海西线骑行，避开人群，体验当地文化',
    startLocation: '大理古城',
    endLocation: '大理古城',
    distance: '约120km',
    duration: '全天',
    highlights: [
      '洱海西线骑行',
      '喜洲古镇扎染体验',
      '网红S弯拍照',
      '生态廊道游览'
    ],
    warnings: [
      '避开人群高峰时段',
      '注意防晒和补水',
      '网红S弯人流量大'
    ],
    trafficStatus: 'safe',
    isExpanded: false
  },
  {
    id: 4,
    date: 'D4',
    title: '大理 → 丽江',
    description: '经S49丽上高速，风景优美，海拔升高',
    startLocation: '大理古城',
    endLocation: '丽江古城',
    distance: '164公里',
    duration: '2小时19分钟',
    highlights: [
      '经G5611大丽高速、S49丽上高速',
      '途经双廊大桥、花椒箐隧道、五峰隧道',
      '象眠山隧道群（多个连续隧道）',
      '丽江古城夜景和纳西族文化'
    ],
    warnings: [
      'S49丽上高速隧道密集，注意行车安全',
      '海拔从2000m升至2400m，注意高原反应',
      '丽江古城内道路狭窄，建议停在外围停车场'
    ],
    trafficStatus: 'safe',
    isExpanded: false
  },
  {
    id: 5,
    date: 'D5',
    title: '玉龙雪山',
    description: '玉龙雪山景区游览，注意高原反应',
    startLocation: '丽江',
    endLocation: '丽江',
    distance: '约50km',
    duration: '全天',
    highlights: [
      '玉龙雪山索道',
      '蓝月谷徒步',
      '甘海子观景',
      '冰川公园'
    ],
    warnings: [
      '海拔3150米，注意高原反应',
      '提前抢票，避开人流',
      '蓝月谷建议徒步不坐电瓶车'
    ],
    trafficStatus: 'safe',
    altitude: 3150,
    isExpanded: false
  },
  {
    id: 6,
    date: 'D6',
    title: '丽江 → 百色（极限返程启动）',
    description: '开始返程，全程高速，注意疲劳驾驶',
    startLocation: '丽江古城',
    endLocation: '百色市',
    distance: '999公里',
    duration: '11小时22分钟',
    highlights: [
      '经S49丽上高速、宾鹤高速、S47泸南高速',
      '途经G56杭瑞高速、S30贺西高速',
      '经过狼逃山隧道、央达隧道等大型隧道群',
      '百色市区夜景'
    ],
    warnings: [
      '单日行车时间最长，必须中途休息2次',
      '宾鹤高速、S30贺西高速隧道超多，注意安全',
      '海拔从2400m降至200m，注意耳压变化',
      '避开节假日G78汕昆高速拥堵路段'
    ],
    trafficStatus: 'traffic',
    isExpanded: false
  },
  {
    id: 7,
    date: 'D7',
    title: '百色 → 深圳（截止00:00）',
    description: '最后冲刺，夜间模式导航，强制休息',
    startLocation: '百色市',
    endLocation: '深圳市福田区',
    distance: '891公里',
    duration: '9小时9分钟',
    highlights: [
      '经G69银百高速、G80广昆高速返程',
      '途经G2518深岑高速、深中大桥',
      '夜间模式导航，避开白天拥堵',
      '安全抵达深圳福田'
    ],
    warnings: [
      '截止时间D7凌晨00:00，时间紧迫',
      '夜间行车风险增加，必须2小时休息一次',
      'G2518深岑高速隧道群，夜间行车更需谨慎',
      '深中大桥夜间限速，注意安全'
    ],
    trafficStatus: 'warning',
    isExpanded: false
  }
];

export const mapMarkers: MapMarker[] = [
  {
    id: 'shenzhen',
    position: [114.0579, 22.5431] as [number, number],
    title: '深圳起点',
    description: '出发城市',
    type: 'scenic',
    icon: '🏠',
    color: '#3B82F6'
  },
  {
    id: 'nanning',
    position: [108.3200, 22.8240] as [number, number],
    title: '南宁',
    description: 'D1目的地，宵夜美食',
    type: 'scenic',
    icon: '🍜',
    color: '#10B981'
  },
  {
    id: 'dali',
    position: [100.2257, 25.6942] as [number, number],
    title: '大理',
    description: 'D2-D3目的地，洱海环线',
    type: 'scenic',
    icon: '🏔️',
    color: '#F59E0B'
  },
  {
    id: 'erhai-s-bend',
    position: [25.7951, 100.0553] as [number, number],
    title: '网红S弯',
    description: '洱海西线网红拍照点',
    type: 'scenic',
    icon: '📸',
    color: '#EC4899'
  },
  {
    id: 'shaxi',
    position: [26.8765, 100.2340] as [number, number],
    title: '沙溪古镇',
    description: 'D4经停点，214国道急弯',
    type: 'scenic',
    icon: '🏘️',
    color: '#8B5CF6'
  },
  {
    id: 'lijiang',
    position: [100.2330, 26.8721] as [number, number],
    title: '丽江',
    description: 'D4-D5目的地，古城+雪山',
    type: 'scenic',
    icon: '🏯',
    color: '#EF4444'
  },
  {
    id: 'yulong-snow-mountain',
    position: [100.1781, 27.1016] as [number, number],
    title: '玉龙雪山',
    description: '海拔3150米，最高点',
    type: 'scenic',
    icon: '❄️',
    color: '#06B6D4'
  },
  {
    id: 'ganhaizi',
    position: [100.1781, 27.1016] as [number, number],
    title: '甘海子',
    description: '海拔3150米，观景台',
    type: 'scenic',
    icon: '🌊',
    color: '#06B6D4'
  },
  {
    id: 'bose',
    position: [106.6186, 23.9023] as [number, number],
    title: '百色',
    description: 'D6-D7经停点',
    type: 'rest',
    icon: '🛏️',
    color: '#84CC16'
  }
];

export const trafficWarnings: TrafficInfo[] = [
  {
    roadName: '汕昆高速百色段',
    status: 'congested',
    congestionLevel: 8,
    estimatedTime: '2-3小时',
    lastUpdate: '2024-01-15 14:30'
  },
  {
    roadName: '214国道沙溪段',
    status: 'slow',
    congestionLevel: 5,
    estimatedTime: '1-1.5小时',
    lastUpdate: '2024-01-15 14:30'
  },
  {
    roadName: '杭瑞高速楚雄段',
    status: 'congested',
    congestionLevel: 9,
    estimatedTime: '3-4小时',
    lastUpdate: '2024-01-15 14:30'
  }
];

export const altitudeWarnings: AltitudeWarning[] = [
  {
    location: '甘海子',
    altitude: 3150,
    warning: '海拔3150米，注意高原反应',
    recommendation: '建议提前服用红景天，避免剧烈运动'
  },
  {
    location: '玉龙雪山索道',
    altitude: 4506,
    warning: '海拔4506米，极高海拔',
    recommendation: '必须携带氧气瓶，停留时间不超过2小时'
  }
]; 