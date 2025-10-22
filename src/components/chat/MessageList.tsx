import React, { useRef, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Message } from '@/types';
import { ChatBubble } from './ChatBubble';
import StreamingChat from './StreamingChat';
import { useChatStore } from '@/store';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const flatListRef = useRef<FlatList>(null);
  const { isLoading } = useChatStore();

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const renderItem = ({ item, index }: { item: Message; index: number }) => {
    // 判断是否是最后一条AI消息且正在流式传输
    const isLastMessage = index === messages.length - 1;
    const isAssistantMessage = item.role === 'assistant';
    const isStreaming = isLastMessage && isAssistantMessage && isLoading && item.content.length > 0;

    // 使用流式聊天组件或普通聊天气泡
    if (isStreaming) {
      return <StreamingChat message={item} isStreaming={true} />;
    } else {
      return <ChatBubble message={item} />;
    }
  };

  const keyExtractor = (item: Message) => item.id;

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      style={styles.list}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      // 优化性能
      windowSize={10}
      initialNumToRender={20}
      maxToRenderPerBatch={10}
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
});
