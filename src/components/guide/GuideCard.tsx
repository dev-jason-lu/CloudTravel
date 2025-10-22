import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GuideContent } from '@/types';
import { Ionicons } from '@expo/vector-icons';

interface GuideCardProps {
  guide: GuideContent;
  onPress?: () => void;
}

export const GuideCard: React.FC<GuideCardProps> = ({ guide, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {/* 图片区域 */}
      <View style={styles.imageContainer}>
        {guide.images && guide.images.length > 0 ? (
          <Image source={{ uri: guide.images[0] }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name={getCategoryIcon(guide.category) as any} size={48} color="#CCC" />
          </View>
        )}
        {/* 分类标签 */}
        <View style={styles.categoryBadge}>
          <Ionicons name={getCategoryIcon(guide.category) as any} size={12} color="#FFF" />
          <Text style={styles.categoryText}>{getCategoryName(guide.category)}</Text>
        </View>
      </View>

      {/* 内容区域 */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {guide.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {guide.description}
        </Text>

        {/* 标签 */}
        <View style={styles.tags}>
          {guide.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* 底部信息 */}
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.rating}>{guide.rating.toFixed(1)}</Text>
          </View>

          {guide.price && (
            <Text style={styles.price}>
              ¥{guide.price.min}
              {guide.price.min !== guide.price.max && `-${guide.price.max}`}
            </Text>
          )}

          <View style={styles.viewCount}>
            <Ionicons name="eye-outline" size={14} color="#999" />
            <Text style={styles.viewCountText}>
              {guide.viewCount > 10000
                ? `${(guide.viewCount / 10000).toFixed(1)}w`
                : guide.viewCount}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,122,255,0.9)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  viewCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  viewCountText: {
    fontSize: 12,
    color: '#999',
  },
});
