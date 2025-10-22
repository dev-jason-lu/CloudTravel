import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Message } from '@/types';

interface StreamingChatProps {
  message: Message;
  isStreaming?: boolean;
}

export const StreamingChat: React.FC<StreamingChatProps> = ({ message, isStreaming = false }) => {
  const [displayContent, setDisplayContent] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const contentRef = useRef(message.content);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    contentRef.current = message.content;
    
    if (isStreaming && message.content.length > displayContent.length) {
      // 只在内容增加时更新显示
      const newContent = message.content;
      
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      
      // 平滑显示新内容
      const startLength = displayContent.length;
      const endLength = newContent.length;
      
      if (endLength > startLength) {
        const newText = newContent.slice(startLength, endLength);
        setDisplayContent(prev => prev + newText);
      }
    } else if (!isStreaming) {
      // 非流式状态，直接显示完整内容
      setDisplayContent(message.content);
    }
  }, [message.content, isStreaming]);

  useEffect(() => {
    // 光标闪烁效果
    if (isStreaming) {
      const cursorInterval = setInterval(() => {
        setCursorVisible(prev => !prev);
      }, 500);
      
      return () => clearInterval(cursorInterval);
    } else {
      setCursorVisible(false);
    }
  }, [isStreaming]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {displayContent}
          {isStreaming && cursorVisible && (
            <Text style={styles.cursor}>▋</Text>
          )}
        </Text>
        <View style={styles.footer}>
          {isStreaming && (
            <ActivityIndicator size="small" color="#999" style={styles.loadingIndicator} />
          )}
          <Text style={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  assistantContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#007AFF',
  },
  assistantBubble: {
    backgroundColor: '#F0F0F0',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#000000',
  },
  cursor: {
    color: '#999',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  loadingIndicator: {
    marginRight: 6,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
});

export default StreamingChat;