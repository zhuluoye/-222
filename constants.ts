import { Hotel, LocationType } from './types';

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: '1',
    name: '哈尔滨马迭尔宾馆',
    location: '哈尔滨',
    stars: 4,
    rating: 4.8,
    tags: ['历史悠久', '中央大街', '俄式风情'],
    description: '始建于1906年，位于繁华的中央大街，是哈尔滨地标性建筑，充满浓郁的法式文艺复兴风格。',
    imageUrl: 'http://49.233.75.102/img/aa11.jpg',
    bookingUrl: '#',
    priceRange: '¥600 - ¥1200'
  },
  {
    id: '2',
    name: '亚布力地中海俱乐部 (Club Med)',
    location: '亚布力',
    stars: 5,
    rating: 4.9,
    tags: ['滑雪胜地', '一价全包', '亲子游'],
    description: '全球知名的滑雪度假村，提供顶级的滑雪课程和设施，适合全家出游。',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    bookingUrl: '#',
    priceRange: '¥2500 - ¥5000'
  },
  {
    id: '3',
    name: '雪乡万嘉戴斯度假酒店',
    location: '雪乡',
    stars: 5,
    rating: 4.5,
    tags: ['雪景房', '设施现代', '暖气足'],
    description: '雪乡景区内的高端酒店，既能体验东北雪景，又能享受现代化的舒适住宿。',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    bookingUrl: '#',
    priceRange: '¥1500 - ¥2800'
  },
  {
    id: '4',
    name: '延吉白山大厦',
    location: '延吉',
    stars: 4,
    rating: 4.6,
    tags: ['市中心', '朝鲜族特色', '美食周边'],
    description: '老牌星级酒店，服务周到，周边美食众多，是探索延吉美食的绝佳落脚点。',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    bookingUrl: '#',
    priceRange: '¥400 - ¥800'
  },
  {
    id: '5',
    name: '长白山柏悦酒店',
    location: '长白山',
    stars: 5,
    rating: 4.9,
    tags: ['奢华', '滑雪直通', '温泉'],
    description: '隐于桦林中的奢华府邸，拥有专属滑雪屋和天然室外矿物质温泉泡池。',
    imageUrl: 'https://picsum.photos/800/600?random=5',
    bookingUrl: '#',
    priceRange: '¥3000 - ¥6000'
  }
];

export const MOCK_IMAGES = [
  'https://picsum.photos/800/600?random=10',
  'https://picsum.photos/800/600?random=11',
  'https://picsum.photos/800/600?random=12',
  'https://picsum.photos/800/600?random=13',
  'https://picsum.photos/800/600?random=14',
];