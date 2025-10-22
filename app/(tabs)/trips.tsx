import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTripStore } from '@/store';
import { EmptyState } from '@/components/common/EmptyState';

export default function TripsScreen() {
  const router = useRouter();
  const { trips } = useTripStore();

  return (
    <View style={styles.container}>
      {trips.length > 0 ? (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>我的行程</Text>
            <Text style={styles.headerCount}>{trips.length}个行程</Text>
          </View>

          {trips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => router.push(`/trip/${trip.id}`)}
            >
              <View style={styles.tripHeader}>
                <Text style={styles.tripDestination}>{trip.destination}</Text>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </View>

              <View style={styles.tripMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>
                    {trip.startDate} - {trip.endDate}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{trip.days}天</Text>
                </View>
              </View>

              <View style={styles.tripFooter}>
                <Text style={styles.activityCount}>
                  共{trip.itinerary.reduce((sum, day) => sum + day.activities.length, 0)}个活动
                </Text>
                <Text style={styles.createdDate}>
                  创建于 {new Date(trip.createdAt).toLocaleDateString('zh-CN')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.footer}>
            <Text style={styles.footerText}>没有更多了</Text>
          </View>
        </ScrollView>
      ) : (
        <EmptyState
          icon="calendar-outline"
          title="还没有行程"
          description="在聊天中让AI帮你规划行程,或手动创建新行程"
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
  tripCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDestination: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  tripMeta: {
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  activityCount: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '500',
  },
  createdDate: {
    fontSize: 12,
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
