import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Trip, PackingItem } from '@/types';
import { useTripStore } from '@/store';
import { PackingItemCard } from '@/components/trip/PackingItemCard';

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { trips, currentTrip, updateTrip, deleteTrip } = useTripStore();
  const [activeTab, setActiveTab] = useState<'itinerary' | 'packing'>('itinerary');

  // 获取行程数据
  const trip = trips.find((t) => t.id === id) || currentTrip;

  if (!trip) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: '行程详情' }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#CCC" />
          <Text style={styles.errorText}>行程不存在</Text>
        </View>
      </View>
    );
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      attraction: 'location',
      meal: 'restaurant',
      transport: 'car',
      hotel: 'bed',
    };
    return icons[type] || 'ellipse';
  };

  const getActivityTypeName = (type: string) => {
    const names: Record<string, string> = {
      attraction: '景点',
      meal: '用餐',
      transport: '交通',
      hotel: '住宿',
    };
    return names[type] || type;
  };

  const handleTogglePackingItem = (itemId: string) => {
    const updatedPackingList = trip.packingList.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    updateTrip(trip.id, { packingList: updatedPackingList });
  };

  const packingCategories = [
    { key: 'documents', name: '证件类', icon: 'document-text' },
    { key: 'clothing', name: '衣物类', icon: 'shirt' },
    { key: 'toiletries', name: '洗护类', icon: 'water' },
    { key: 'electronics', name: '电子产品', icon: 'phone-portrait' },
    { key: 'medicine', name: '药品类', icon: 'medical' },
    { key: 'other', name: '其他', icon: 'cube' },
  ];

  const getPackingItemsByCategory = (category: string) => {
    return trip.packingList.filter((item) => item.category === category);
  };

  const getPackingProgress = () => {
    const total = trip.packingList.length;
    const checked = trip.packingList.filter((item) => item.checked).length;
    return { total, checked, percentage: total > 0 ? Math.round((checked / total) * 100) : 0 };
  };

  const progress = getPackingProgress();

  // 分享行程
  const handleShare = async () => {
    try {
      let message = `${trip.destination} ${trip.days}日游\n`;
      message += `📅 ${trip.startDate} - ${trip.endDate}\n\n`;

      trip.itinerary.forEach((day) => {
        message += `Day ${day.day} - ${day.date}\n`;
        day.activities.forEach((activity) => {
          message += `  ${activity.time} ${activity.title}\n`;
        });
        message += '\n';
      });

      await Share.share({
        message,
        title: `${trip.destination}行程`,
      });
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  // 删除行程
  const handleDelete = () => {
    Alert.alert(
      '删除行程',
      '确定要删除这个行程吗?',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            deleteTrip(trip.id);
            router.back();
          },
        },
      ]
    );
  };

  // 计算总预算
  const getTotalBudget = () => {
    return trip.itinerary.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => {
        return dayTotal + (activity.estimatedCost || 0);
      }, 0);
    }, 0);
  };

  const totalBudget = getTotalBudget();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '行程详情',
          headerRight: () => (
            <View style={{ flexDirection: 'row', gap: 16, marginRight: 16 }}>
              <TouchableOpacity onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      {/* Tab 切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'itinerary' && styles.tabActive]}
          onPress={() => setActiveTab('itinerary')}
        >
          <Ionicons
            name="map-outline"
            size={20}
            color={activeTab === 'itinerary' ? '#007AFF' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'itinerary' && styles.tabTextActive]}>
            行程安排
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'packing' && styles.tabActive]}
          onPress={() => setActiveTab('packing')}
        >
          <Ionicons
            name="briefcase-outline"
            size={20}
            color={activeTab === 'packing' ? '#007AFF' : '#999'}
          />
          <Text style={[styles.tabText, activeTab === 'packing' && styles.tabTextActive]}>
            行李清单
          </Text>
          {trip.packingList.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{progress.checked}/{progress.total}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 行程头部 */}
        <View style={styles.header}>
          <Text style={styles.destination}>{trip.destination}</Text>
          <Text style={styles.duration}>{trip.days}日游</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.dateText}>
              {trip.startDate} - {trip.endDate}
            </Text>
          </View>

          {/* 预算概览 */}
          {totalBudget > 0 && (
            <View style={styles.budgetCard}>
              <Ionicons name="wallet-outline" size={20} color="#4CAF50" />
              <View style={styles.budgetInfo}>
                <Text style={styles.budgetLabel}>预计花费</Text>
                <Text style={styles.budgetAmount}>¥{totalBudget}</Text>
              </View>
            </View>
          )}
        </View>

        {/* 行程时间轴 */}
        {activeTab === 'itinerary' && (
          <View style={styles.itineraryContainer}>
            {trip.itinerary.map((dayPlan, dayIndex) => (
              <View key={dayIndex} style={styles.daySection}>
                {/* 日期标题 */}
                <View style={styles.dayHeader}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>Day {dayPlan.day}</Text>
                  </View>
                  <Text style={styles.dayDate}>{dayPlan.date}</Text>
                </View>

                {/* 活动列表 */}
                <View style={styles.activitiesContainer}>
                  {dayPlan.activities.map((activity, actIndex) => (
                    <View key={activity.id} style={styles.activityItem}>
                      {/* 时间轴 */}
                      <View style={styles.timeline}>
                        <View style={styles.timelineDot} />
                        {actIndex < dayPlan.activities.length - 1 && (
                          <View style={styles.timelineLine} />
                        )}
                      </View>

                      {/* 活动内容 */}
                      <View style={styles.activityContent}>
                        <View style={styles.activityHeader}>
                          <Text style={styles.activityTime}>{activity.time}</Text>
                          <View style={styles.activityTypeBadge}>
                            <Ionicons
                              name={getActivityIcon(activity.type) as any}
                              size={12}
                              color="#007AFF"
                            />
                            <Text style={styles.activityTypeText}>
                              {getActivityTypeName(activity.type)}
                            </Text>
                          </View>
                        </View>

                        <Text style={styles.activityTitle}>{activity.title}</Text>

                        {activity.description && (
                          <Text style={styles.activityDescription}>{activity.description}</Text>
                        )}

                        <View style={styles.activityFooter}>
                          {activity.duration && (
                            <View style={styles.activityMeta}>
                              <Ionicons name="time-outline" size={14} color="#999" />
                              <Text style={styles.activityMetaText}>
                                约{Math.floor(activity.duration / 60)}h
                                {activity.duration % 60 > 0 && `${activity.duration % 60}min`}
                              </Text>
                            </View>
                          )}
                          {activity.estimatedCost && (
                            <View style={styles.activityMeta}>
                              <Ionicons name="cash-outline" size={14} color="#999" />
                              <Text style={styles.activityMetaText}>¥{activity.estimatedCost}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 行李清单 */}
        {activeTab === 'packing' && (
          <View style={styles.packingContainer}>
            {trip.packingList.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="briefcase-outline" size={64} color="#CCC" />
                <Text style={styles.emptyText}>暂无行李清单</Text>
                <Text style={styles.emptyHint}>在聊天中询问AI生成行李清单</Text>
              </View>
            ) : (
              <>
                {/* 进度卡片 */}
                <View style={styles.progressCard}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>打包进度</Text>
                    <Text style={styles.progressText}>
                      {progress.checked}/{progress.total} ({progress.percentage}%)
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
                  </View>
                </View>

                {/* 按分类显示 */}
                {packingCategories.map((category) => {
                  const items = getPackingItemsByCategory(category.key);
                  if (items.length === 0) return null;

                  return (
                    <View key={category.key} style={styles.categorySection}>
                      <View style={styles.categoryHeader}>
                        <Ionicons name={category.icon as any} size={20} color="#007AFF" />
                        <Text style={styles.categoryTitle}>{category.name}</Text>
                        <Text style={styles.categoryCount}>
                          {items.filter((i) => i.checked).length}/{items.length}
                        </Text>
                      </View>
                      {items.map((item) => (
                        <PackingItemCard
                          key={item.id}
                          item={item}
                          onToggle={handleTogglePackingItem}
                        />
                      ))}
                    </View>
                  );
                })}
              </>
            )}
          </View>
        )}

        {/* 底部提示 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>✓ 行程已保存</Text>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 15,
    color: '#999',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  badge: {
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  badgeText: {
    fontSize: 11,
    color: '#FFF',
    fontWeight: '600',
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
  header: {
    backgroundColor: '#FFF',
    padding: 20,
    marginBottom: 12,
  },
  destination: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  duration: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  budgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8F5',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 12,
  },
  budgetInfo: {
    flex: 1,
  },
  budgetLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  budgetAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4CAF50',
  },
  itineraryContainer: {
    paddingHorizontal: 16,
  },
  daySection: {
    marginBottom: 24,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  dayBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  dayBadgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  dayDate: {
    fontSize: 14,
    color: '#666',
  },
  activitiesContainer: {
    paddingLeft: 8,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeline: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
    marginTop: 6,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E5EA',
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTime: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  activityTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activityTypeText: {
    fontSize: 12,
    color: '#007AFF',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  activityFooter: {
    flexDirection: 'row',
    gap: 16,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  activityMetaText: {
    fontSize: 13,
    color: '#999',
  },
  packingContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: '#CCC',
    marginTop: 8,
  },
  progressCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  categoryCount: {
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
