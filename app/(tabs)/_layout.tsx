import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#000',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '聊天',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="comments" color={color} />,
        }}
      />
      <Tabs.Screen
        name="guides"
        options={{
          title: '攻略',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="compass" color={color} />,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: '行程',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: '收藏',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="heart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="user" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: '设置',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="cog" color={color} />,
          href: null, // 隐藏此Tab,通过Profile页面跳转
        }}
      />
    </Tabs>
  );
}
