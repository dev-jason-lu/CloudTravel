import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useChatStore, useSettingsStore, useCurrentSession, useCurrentMessages } from '@/store';
import { MessageList } from '@/components/chat/MessageList';
import { InputBar } from '@/components/chat/InputBar';
import { EmptyState } from '@/components/common/EmptyState';
import { aiServiceFactory } from '@/services/ai/factory';
import { initWeatherService } from '@/services/weather/weatherService';
// 初始化工具注册表
import '@/services/tools';

export default function ChatScreen() {
  const { 
    sessions, 
    currentSessionId, 
    isLoading, 
    addMessage, 
    setLoading, 
    addSession, 
    switchSession, 
    closeSession, 
    clearCurrentSession,
    updateSessionTitle 
  } = useChatStore();
  const currentSession = useCurrentSession();
  const messages = useCurrentMessages();
  const { aiConfig, apiKeys } = useSettingsStore();
  const [initialized, setInitialized] = useState(false);
  const [showSessionList, setShowSessionList] = useState(false);

  useEffect(() => {
    // 如果没有当前会话，创建一个新会话
    if (!currentSessionId && sessions.length === 0) {
      addSession();
    }

    // 检查AI配置
    const currentApiKey = apiKeys[aiConfig.provider] || aiConfig.apiKey;

    console.log('AI Config Debug:', {
      provider: aiConfig.provider,
      model: aiConfig.model,
      apiKey: currentApiKey ? '已设置' : '未设置',
      fullConfig: aiConfig
    });

    if (!currentApiKey && aiConfig.provider !== 'ollama') {
      setInitialized(false);
      return;
    }

    try {
      // 创建AI服务实例
      const service = aiServiceFactory.createService({
        ...aiConfig,
        apiKey: currentApiKey,
      });
      
      console.log('AI Service Created:', {
        serviceType: service.constructor.name,
        provider: aiConfig.provider
      });
      
      setInitialized(true);

      // 初始化天气服务
      const weatherApiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
      if (weatherApiKey) {
        initWeatherService(weatherApiKey);
      }
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      setInitialized(false);
    }
  }, [aiConfig, apiKeys, currentSessionId, sessions.length, addSession]);

  const handleSendMessage = async (text: string) => {
    if (!initialized && aiConfig.provider !== 'ollama') {
      Alert.alert('配置错误', '请先在设置中配置API Key');
      return;
    }

    // 如果没有当前会话，创建一个新会话
    if (!currentSessionId) {
      addSession();
    }

    // 添加用户消息
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: text,
      timestamp: Date.now(),
    };
    addMessage(userMessage);

    // 开始AI响应
    setLoading(true);

    try {
      const aiService = aiServiceFactory.getCurrentService();
      if (!aiService) {
        throw new Error('AI service not initialized');
      }

      // 创建AI消息
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: '',
        timestamp: Date.now(),
      };
      addMessage(assistantMessage);

      // 准备消息历史(最近10条)
      const recentMessages = [...messages.slice(-10), userMessage];

      // 流式接收AI响应
      let fullResponse = '';
      let lastUpdateTime = Date.now();
      
      await aiService.chatStream(
        recentMessages,
        (chunk) => {
          fullResponse += chunk;
          
          // 限制更新频率，避免过于频繁的UI更新
          const now = Date.now();
          if (now - lastUpdateTime > 50) { // 每50ms更新一次
            lastUpdateTime = now;
            
            // 更新最后一条消息
            useChatStore.getState().updateLastMessage(fullResponse);
          }
        },
        aiConfig
      );
      
      // 确保最终状态更新
      useChatStore.getState().updateLastMessage(fullResponse);

      // 如果这是第一条消息，更新会话标题
      if (messages.length === 0 && currentSession) {
        const title = text.length > 20 ? text.substring(0, 20) + '...' : text;
        updateSessionTitle(currentSession.id, title);
      }
    } catch (error: any) {
      console.error('AI response error:', error);

      // 显示错误信息
      let errorMessage = '获取AI响应失败,请重试';
      if (error.message?.includes('API key')) {
        errorMessage = 'API Key无效,请检查配置';
      } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
        errorMessage = '网络连接失败,请检查网络';
      }

      Alert.alert('错误', errorMessage);

      // 移除未完成的AI消息
      useChatStore.setState((state) => {
        if (!state.currentSessionId) return state;
        
        const sessions = state.sessions.map(session => {
          if (session.id === state.currentSessionId) {
            return {
              ...session,
              messages: session.messages.filter((m) => m.content !== ''),
            };
          }
          return session;
        });

        return { sessions };
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    addSession();
    setShowSessionList(false);
  };

  const handleClearContext = () => {
    Alert.alert(
      '清空对话',
      '确定要清空当前对话的所有消息吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '清空', 
          style: 'destructive',
          onPress: () => {
            clearCurrentSession();
          }
        }
      ]
    );
  };

  const handleCloseSession = (sessionId: string) => {
    if (sessions.length <= 1) {
      Alert.alert('提示', '至少需要保留一个对话窗口');
      return;
    }
    
    Alert.alert(
      '关闭对话',
      '确定要关闭这个对话窗口吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '关闭', 
          style: 'destructive',
          onPress: () => {
            closeSession(sessionId);
            setShowSessionList(false);
          }
        }
      ]
    );
  };

  // 检查是否需要提示配置
  const needsConfiguration =
    !initialized && aiConfig.provider !== 'ollama' && messages.length === 0;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* 顶部工具栏 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => setShowSessionList(!showSessionList)}
        >
          <Ionicons name="list-outline" size={24} color="#007AFF" />
          <Text style={styles.headerButtonText}>
            {currentSession?.title || '对话'}
          </Text>
          <Ionicons name={showSessionList ? "chevron-up" : "chevron-down"} size={16} color="#007AFF" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          {messages.length > 0 && (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleClearContext}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              <Text style={[styles.headerButtonText, { color: '#FF3B30' }]}>
                清空
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={handleNewChat}
          >
            <Ionicons name="add-outline" size={24} color="#007AFF" />
            <Text style={styles.headerButtonText}>新建</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 会话列表 */}
      {showSessionList && (
        <View style={styles.sessionList}>
          {sessions.map((session) => (
            <TouchableOpacity
              key={session.id}
              style={[
                styles.sessionItem,
                session.id === currentSessionId && styles.sessionItemActive
              ]}
              onPress={() => {
                switchSession(session.id);
                setShowSessionList(false);
              }}
            >
              <View style={styles.sessionContent}>
                <Text style={styles.sessionTitle} numberOfLines={1}>
                  {session.title}
                </Text>
                <Text style={styles.sessionInfo}>
                  {session.messages.length} 条消息 • {new Date(session.updatedAt).toLocaleDateString()}
                </Text>
              </View>
              
              {sessions.length > 1 && (
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => handleCloseSession(session.id)}
                >
                  <Ionicons name="close" size={16} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {messages.length === 0 ? (
          <EmptyState
            icon="chatbubbles-outline"
            title={needsConfiguration ? '请先配置AI模型' : '开始你的旅行规划'}
            description={
              needsConfiguration
                ? '前往设置页面配置API Key'
                : '向我提问任何关于旅行的问题,我会帮你规划完美的行程'
            }
          />
        ) : (
          <MessageList messages={messages} />
        )}
        <InputBar
          onSend={handleSendMessage}
          disabled={isLoading || (!initialized && aiConfig.provider !== 'ollama')}
          placeholder={
            !initialized && aiConfig.provider !== 'ollama'
              ? '请先配置API Key'
              : '输入消息...'
          }
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#F9F9F9',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  headerButtonText: {
    marginLeft: 6,
    marginRight: 4,
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionList: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    maxHeight: 300,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  sessionItemActive: {
    backgroundColor: '#F2F8FF',
  },
  sessionContent: {
    flex: 1,
    marginRight: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  sessionInfo: {
    fontSize: 12,
    color: '#8E8E93',
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  keyboardView: {
    flex: 1,
  },
});
