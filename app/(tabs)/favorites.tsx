import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGuideStore } from '@/store';
import { GuideCard } from '@/components/guide/GuideCard';
import { EmptyState } from '@/components/common/EmptyState';

// 模拟攻略数据 - 实际应该从API或统一的数据源获取
const mockGuides = [
  {
    id: '1',
    destination: '北京',
    category: 'culture' as const,
    title: '故宫博物院',
    description: '世界上现存规模最大、保存最为完整的木质结构古建筑之一',
    images: [],
    tags: ['热门', '历史', '必去'],
    rating: 4.8,
    viewCount: 125000,
    price: { min: 60, max: 60, currency: 'CNY', level: 'moderate' as const },
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
    category: 'food' as const,
    title: '宽窄巷子美食街',
    description: '成都最具代表性的历史文化街区,汇集了各种成都小吃和川菜',
    images: [],
    tags: ['美食', '小吃', '网红'],
    rating: 4.6,
    viewCount: 98000,
    price: { min: 50, max: 150, currency: 'CNY', level: 'moderate' as const },
    tips: ['避开周末高峰', '推荐下午去'],
    source: '小红书',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: '3',
    destination: '上海',
    category: 'entertainment' as const,
    title: '外滩',
    description: '上海最具代表性的地标,黄浦江畔的万国建筑博览群',
    images: [],
    tags: ['地标', '夜景', '摄影'],
    rating: 4.8,
    viewCount: 256000,
    price: { min: 0, max: 0, currency: 'CNY', level: 'budget' as const },
    openTime: '全天',
    duration: 120,
    tips: ['晚上夜景最美', '注意保管财物'],
    source: '小红书',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites } = useGuideStore();

  // 筛选出已收藏的攻略
  const favoriteGuides = mockGuides.filter((guide) => favorites.includes(guide.id));

  return (
    <View style={styles.container}>
      {favoriteGuides.length > 0 ? (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>我的收藏</Text>
            <Text style={styles.headerCount}>{favoriteGuides.length}个攻略</Text>
          </View>

          {favoriteGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onPress={() => {
                router.push(`/guide/${guide.id}`);
              }}
            />
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>没有更多了</Text>
          </View>
        </ScrollView>
      ) : (
        <EmptyState
          icon="heart-outline"
          title="还没有收藏"
          description="在攻略详情页点击❤️收藏喜欢的攻略"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
