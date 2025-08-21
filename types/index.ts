export interface TripDay {
  id: number;
  date: string;
  title: string;
  description: string;
  startLocation: string;
  endLocation: string;
  distance: string;
  duration: string;
  highlights: string[];
  warnings: string[];
  trafficStatus: 'safe' | 'warning' | 'traffic';
  altitude?: number;
  isExpanded: boolean;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  description: string;
  type: 'scenic' | 'parking' | 'charging' | 'warning' | 'rest';
  icon: string;
  color: string;
}

export interface XiaohongshuContent {
  id: number;
  title: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  tags: string[];
  imageUrl: string;
  category: string;
}

export interface TrafficInfo {
  roadName: string;
  status: 'smooth' | 'slow' | 'congested';
  congestionLevel: number;
  estimatedTime: string;
  lastUpdate: string;
}

export interface AltitudeWarning {
  location: string;
  altitude: number;
  warning: string;
  recommendation: string;
} 