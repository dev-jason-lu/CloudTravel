import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PackingItem } from '@/types';

interface PackingItemCardProps {
  item: PackingItem;
  onToggle: (id: string) => void;
}

export const PackingItemCard: React.FC<PackingItemCardProps> = ({ item, onToggle }) => {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      documents: 'document-text',
      clothing: 'shirt',
      toiletries: 'water',
      electronics: 'phone-portrait',
      medicine: 'medical',
      other: 'cube',
    };
    return icons[category] || 'cube';
  };

  return (
    <TouchableOpacity
      style={[styles.container, item.checked && styles.containerChecked]}
      onPress={() => onToggle(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.checkbox}>
        {item.checked ? (
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color="#CCC" />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, item.checked && styles.nameChecked]}>{item.name}</Text>
          {item.quantity && (
            <Text style={styles.quantity}>x{item.quantity}</Text>
          )}
        </View>
        {item.suggested && !item.checked && (
          <View style={styles.suggestedBadge}>
            <Ionicons name="bulb" size={12} color="#FF9800" />
            <Text style={styles.suggestedText}>AI推荐</Text>
          </View>
        )}
      </View>

      <Ionicons
        name={getCategoryIcon(item.category) as any}
        size={20}
        color={item.checked ? '#999' : '#666'}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  containerChecked: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  nameChecked: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  suggestedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  suggestedText: {
    fontSize: 12,
    color: '#FF9800',
  },
});
