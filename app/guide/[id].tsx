import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GuideContent } from '@/types';
import { useGuideStore } from '@/store';

// 模拟数据 - 实际应该从store或API获取
const mockGuideData: Record<string, GuideContent> = {
  '1': {
    id: '1',
    destination: '北京',
    category: 'culture',
    title: '故宫博物院',
    description:
      '故宫博物院建立于1925年,是在明清两代皇宫及其收藏的基础上建立起来的中国综合性博物馆。位于北京市中心,前通天安门,后倚景山,东近王府井街市,西临中南海。\n\n故宫是世界上现存规模最大、保存最为完整的木质结构古建筑之一,是中国古代宫廷建筑之精华。占地面积72万平方米,建筑面积约15万平方米,有大小宫殿七十多座,房屋九千余间。\n\n明清两代共有24位皇帝在此居住,见证了中国500多年的历史变迁。',
    images: [],
    tags: ['热门', '历史', '必去', '世界遗产'],
    rating: 4.8,
    viewCount: 125000,
    price: { min: 60, max: 60, currency: 'CNY', level: 'moderate' },
    location: {
      latitude: 39.9163,
      longitude: 116.397,
      address: '北京市东城区景山前街4号',
      city: '北京',
    },
    openTime: '8:30-17:00 (16:00停止入场)\n周一闭馆(法定节假日除外)',
    duration: 180,
    tips: [
      '建议提前在官网或公众号预约门票,现场不售票',
      '至少预留3-4小时游览时间',
      '推荐租借讲解器(40元)或请导游,能更好地了解历史',
      '注意周一闭馆,节假日人流量大需提前规划',
      '午门、太和殿、乾清宫是必看的重点区域',
      '珍宝馆和钟表馆需另购票(各10元)',
      '夏季注意防晒,冬季注意保暖,故宫内较空旷',
    ],
    source: '小红书',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  '2': {
    id: '2',
    destination: '成都',
    category: 'food',
    title: '宽窄巷子美食街',
    description:
      '宽窄巷子是成都市三大历史文化保护区之一,由宽巷子、窄巷子和井巷子三条平行排列的城市老式街道及其之间的四合院群落组成。\n\n这里是成都遗留下来的较成规模的清朝古街道,与大慈寺、文殊院一起并称为成都三大历史文化名城保护街区。\n\n宽窄巷子汇集了成都各种特色小吃和川菜,是体验成都慢生活的绝佳去处。',
    images: [],
    tags: ['美食', '小吃', '网红', '历史街区'],
    rating: 4.6,
    viewCount: 98000,
    price: { min: 50, max: 150, currency: 'CNY', level: 'moderate' },
    location: {
      latitude: 30.6738,
      longitude: 104.0569,
      address: '四川省成都市青羊区金河路口宽窄巷子',
      city: '成都',
    },
    openTime: '全天开放,商铺营业时间一般为10:00-22:00',
    duration: 120,
    tips: [
      '避开周末和节假日,人流量非常大',
      '推荐下午4点后去,可以逛到晚上看夜景',
      '必吃美食:三大炮、钟水饺、龙抄手、叶儿粑',
      '注意防范小偷,人多拥挤时保管好财物',
      '很多网红店价格较贵,可以到周边小巷找本地人吃的店',
      '宽巷子适合品茶、窄巷子适合品美食、井巷子适合拍照',
    ],
    source: '小红书',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  '3': {
    id: '3',
    destination: '上海',
    category: 'entertainment',
    title: '外滩',
    description:
      '外滩位于上海市黄浦区的黄浦江畔,是最具上海城市象征意义的景点之一。长约1.5公里,南起延安东路,北至苏州河上的外白渡桥。\n\n外滩矗立着52幢风格各异的古典复兴大楼,素有外滩万国建筑博览群之称,是中国近现代重要史迹及代表性建筑,上海的地标之一。\n\n夜晚的外滩格外迷人,对岸陆家嘴的东方明珠、金茂大厦、上海中心等现代建筑灯光璀璨,与外滩的欧式古典建筑交相辉映。',
    images: [],
    tags: ['地标', '夜景', '摄影', '免费'],
    rating: 4.8,
    viewCount: 256000,
    price: { min: 0, max: 0, currency: 'CNY', level: 'budget' },
    location: {
      latitude: 31.2397,
      longitude: 121.4908,
      address: '上海市黄浦区中山东一路',
      city: '上海',
    },
    openTime: '全天开放',
    duration: 120,
    tips: [
      '晚上7点后夜景最美,建议傍晚时分前往',
      '可以乘坐轮渡游览黄浦江,往返约30分钟',
      '注意保管好财物,人多时容易被小偷盯上',
      '推荐拍照位置:陈毅广场、外白渡桥',
      '附近有南京路步行街,可以一起游览',
      '夏季注意防晒,冬季江边风大注意保暖',
    ],
    source: '小红书',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
};

export default function GuideDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { favorites, toggleFavorite } = useGuideStore();

  const guide = mockGuideData[id || ''];
  const isFavorited = favorites.includes(id || '');

  if (!guide) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: '攻略详情' }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#CCC" />
          <Text style={styles.errorText}>攻略不存在</Text>
        </View>
      </View>
    );
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      food: 'restaurant',
      entertainment: 'game-controller',
      culture: 'book',
      nature: 'leaf',
      accommodation: 'bed',
      transport: 'car',
      shopping: 'cart',
      practical: 'information-circle',
    };
    return icons[category] || 'location';
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      food: '吃喝',
      entertainment: '玩乐',
      culture: '人文',
      nature: '地理',
      accommodation: '住宿',
      transport: '交通',
      shopping: '购物',
      practical: '实用',
    };
    return names[category] || category;
  };

  const handleOpenMap = () => {
    if (guide.location) {
      const url = `https://uri.amap.com/marker?position=${guide.location.longitude},${guide.location.latitude}&name=${guide.title}`;
      Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '攻略详情',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => toggleFavorite(guide.id)}
              style={styles.favoriteButton}
            >
              <Ionicons
                name={isFavorited ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorited ? '#FF6B6B' : '#333'}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 头图 */}
        <View style={styles.imageContainer}>
          {guide.images && guide.images.length > 0 ? (
            <Image source={{ uri: guide.images[0] }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Ionicons name={getCategoryIcon(guide.category) as any} size={80} color="#CCC" />
            </View>
          )}
        </View>

        {/* 基本信息 */}
        <View style={styles.content}>
          {/* 标题和分类 */}
          <View style={styles.header}>
            <View style={styles.categoryBadge}>
              <Ionicons name={getCategoryIcon(guide.category) as any} size={16} color="#007AFF" />
              <Text style={styles.categoryText}>{getCategoryName(guide.category)}</Text>
            </View>
            <Text style={styles.title}>{guide.title}</Text>
          </View>

          {/* 评分和浏览量 */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="star" size={20} color="#FFB800" />
              <Text style={styles.statText}>{guide.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="eye-outline" size={20} color="#666" />
              <Text style={styles.statText}>
                {guide.viewCount > 10000
                  ? `${(guide.viewCount / 10000).toFixed(1)}w`
                  : guide.viewCount}
              </Text>
            </View>
            {guide.price && guide.price.min > 0 && (
              <View style={styles.stat}>
                <Ionicons name="cash-outline" size={20} color="#666" />
                <Text style={styles.priceText}>
                  ¥{guide.price.min}
                  {guide.price.min !== guide.price.max && `-${guide.price.max}`}
                </Text>
              </View>
            )}
          </View>

          {/* 标签 */}
          <View style={styles.tags}>
            {guide.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* 位置信息 */}
          {guide.location && (
            <TouchableOpacity style={styles.locationCard} onPress={handleOpenMap}>
              <Ionicons name="location" size={24} color="#007AFF" />
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>地址</Text>
                <Text style={styles.locationAddress}>{guide.location.address}</Text>
              </View>
              <Ionicons name="navigate-outline" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}

          {/* 开放时间 */}
          {guide.openTime && (
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={24} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>开放时间</Text>
                <Text style={styles.infoText}>{guide.openTime}</Text>
              </View>
            </View>
          )}

          {/* 建议游玩时长 */}
          {guide.duration && (
            <View style={styles.infoCard}>
              <Ionicons name="hourglass-outline" size={24} color="#007AFF" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>建议游玩时长</Text>
                <Text style={styles.infoText}>
                  {Math.floor(guide.duration / 60)}小时
                  {guide.duration % 60 > 0 && `${guide.duration % 60}分钟`}
                </Text>
              </View>
            </View>
          )}

          {/* 详细描述 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>详细介绍</Text>
            <Text style={styles.description}>{guide.description}</Text>
          </View>

          {/* 小贴士 */}
          {guide.tips && guide.tips.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 小贴士</Text>
              <View style={styles.tipsList}>
                {guide.tips.map((tip, index) => (
                  <View key={index} style={styles.tipItem}>
                    <View style={styles.tipBullet} />
                    <Text style={styles.tipText}>{tip}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 来源 */}
          <View style={styles.footer}>
            <Text style={styles.sourceText}>来源: {guide.source}</Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  favoriteButton: {
    marginRight: 16,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#333',
    lineHeight: 34,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  priceText: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: '700',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 26,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 12,
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
    marginTop: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  sourceText: {
    fontSize: 14,
    color: '#999',
  },
});
