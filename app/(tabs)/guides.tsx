import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GuideContent } from '@/types';
import { GuideCard } from '@/components/guide/GuideCard';
import { EmptyState } from '@/components/common/EmptyState';

// 模拟数据
const mockGuides: GuideContent[] = [
  {
    id: '1',
    destination: '北京',
    category: 'culture',
    title: '故宫博物院',
    description: '世界上现存规模最大、保存最为完整的木质结构古建筑之一',
    images: [],
    tags: ['热门', '历史', '必去'],
    rating: 4.8,
    viewCount: 125000,
    price: { min: 60, max: 60, currency: 'CNY', level: 'moderate' },
    openTime: '8:30-17:00',
    duration: 180,
    tips: ['建议提前预约', '周一闭馆'],
    source: '小红书',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '2',
    destination: '成都',
    category: 'food',
    title: '宽窄巷子美食街',
    description: '成都最具代表性的历史文化街区,汇集了各种成都小吃和川菜',
    images: [],
    tags: ['美食', '小吃', '网红'],
    rating: 4.6,
    viewCount: 98000,
    price: { min: 50, max: 150, currency: 'CNY', level: 'moderate' },
    tips: ['避开周末高峰', '推荐下午去'],
    source: '小红书',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    destination: '上海',
    category: 'entertainment',
    title: '外滩',
    description: '上海最具代表性的地标,黄浦江畔的万国建筑博览群',
    images: [],
    tags: ['地标', '夜景', '摄影'],
    rating: 4.8,
    viewCount: 256000,
    price: { min: 0, max: 0, currency: 'CNY', level: 'budget' },
    openTime: '全天',
    duration: 120,
    tips: ['晚上夜景最美', '注意保管财物'],
    source: '小红书',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export default function GuidesScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'price' | 'views'>('default');

  const categories = [
    { key: 'all', label: '全部', icon: 'apps' },
    { key: 'food', label: '吃喝', icon: 'restaurant' },
    { key: 'entertainment', label: '玩乐', icon: 'game-controller' },
    { key: 'culture', label: '人文', icon: 'book' },
    { key: 'nature', label: '地理', icon: 'leaf' },
    { key: 'accommodation', label: '住宿', icon: 'bed' },
    { key: 'shopping', label: '购物', icon: 'cart' },
  ];

  const sortOptions = [
    { key: 'default', label: '默认排序' },
    { key: 'rating', label: '评分最高' },
    { key: 'price', label: '价格最低' },
    { key: 'views', label: '最多浏览' },
  ];

  // 筛选和排序攻略
  let filteredGuides = mockGuides.filter((guide) => {
    const matchCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchSearch =
      !searchText ||
      guide.title.includes(searchText) ||
      guide.destination.includes(searchText);
    return matchCategory && matchSearch;
  });

  // 排序
  if (sortBy === 'rating') {
    filteredGuides = [...filteredGuides].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'price') {
    filteredGuides = [...filteredGuides].sort((a, b) => (a.price?.min || 0) - (b.price?.min || 0));
  } else if (sortBy === 'views') {
    filteredGuides = [...filteredGuides].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
  }

  return (
    <View style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.searchBar}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="搜索目的地或景点"
            placeholderTextColor="#999"
          />
          {searchText !== '' && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 分类标签 */}
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryChip, selectedCategory === cat.key && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat.key)}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={selectedCategory === cat.key ? '#FFF' : '#666'}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === cat.key && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 排序选项 */}
      <View style={styles.sortContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortContent}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[styles.sortChip, sortBy === option.key && styles.sortChipActive]}
              onPress={() => setSortBy(option.key as any)}
            >
              <Text style={[styles.sortLabel, sortBy === option.key && styles.sortLabelActive]}>
                {option.label}
              </Text>
              {sortBy === option.key && (
                <Ionicons name="checkmark" size={16} color="#007AFF" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 攻略列表 */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filteredGuides.length > 0 ? (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>为你推荐</Text>
              <Text style={styles.headerCount}>{filteredGuides.length}个攻略</Text>
            </View>

            {filteredGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onPress={() => {
                  router.push(`/guide/${guide.id}`);
                }}
              />
            ))}
          </>
        ) : (
          <EmptyState
            icon="compass-outline"
            title="暂无攻略"
            description="试试其他分类或搜索关键词"
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>没有更多了</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchBar: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  categories: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  categoriesContent: {
    height: 70,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  categoryChipActive: {
    backgroundColor: '#007AFF',
  },
  categoryLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#FFF',
  },
  sortContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  sortContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sortChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  sortChipActive: {
    backgroundColor: '#F0F8FF',
    borderColor: '#007AFF',
  },
  sortLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  sortLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerCount: {
    fontSize: 14,
    color: '#999',
  },
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});
