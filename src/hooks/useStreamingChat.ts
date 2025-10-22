import { useState, useCallback, useRef } from 'react';
import { Message } from '@/types';

interface UseStreamingChatOptions {
  onMessageUpdate?: (content: string) => void;
  onComplete?: (content: string) => void;
  updateInterval?: number; // 更新间隔(ms)
}

interface UseStreamingChatReturn {
  isStreaming: boolean;
  currentContent: string;
  startStreaming: (initialContent?: string) => void;
  updateContent: (chunk: string) => void;
  completeStreaming: () => void;
  resetStreaming: () => void;
}

/**
 * 流式聊天Hook，优化流式响应的显示效果
 */
export const useStreamingChat = (options: UseStreamingChatOptions = {}): UseStreamingChatReturn => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentContent, setCurrentContent] = useState('');
  const contentRef = useRef('');
  const updateTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { onMessageUpdate, onComplete, updateInterval = 50 } = options;

  const startStreaming = useCallback((initialContent: string = '') => {
    contentRef.current = initialContent;
    setCurrentContent(initialContent);
    setIsStreaming(true);
  }, []);

  const updateContent = useCallback((chunk: string) => {
    contentRef.current += chunk;
    
    // 使用防抖机制，避免过于频繁的更新
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
    }
    
    updateTimerRef.current = setTimeout(() => {
      const newContent = contentRef.current;
      setCurrentContent(newContent);
      onMessageUpdate?.(newContent);
    }, updateInterval);
  }, [onMessageUpdate, updateInterval]);

  const completeStreaming = useCallback(() => {
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
      updateTimerRef.current = null;
    }
    
    // 确保显示最终内容
    const finalContent = contentRef.current;
    setCurrentContent(finalContent);
    setIsStreaming(false);
    onComplete?.(finalContent);
    onMessageUpdate?.(finalContent);
  }, [onComplete, onMessageUpdate]);

  const resetStreaming = useCallback(() => {
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
      updateTimerRef.current = null;
    }
    
    contentRef.current = '';
    setCurrentContent('');
    setIsStreaming(false);
  }, []);

  return {
    isStreaming,
    currentContent,
    startStreaming,
    updateContent,
    completeStreaming,
    resetStreaming,
  };
};

/**
 * 流式性能优化Hook
 */
export const useStreamingPerformance = () => {
  const metricsRef = useRef({
    startTime: 0,
    chunkCount: 0,
    totalChars: 0,
    lastUpdateTime: 0,
  });

  const startMeasuring = useCallback(() => {
    metricsRef.current = {
      startTime: Date.now(),
      chunkCount: 0,
      totalChars: 0,
      lastUpdateTime: Date.now(),
    };
  }, []);

  const recordChunk = useCallback((chunk: string) => {
    metricsRef.current.chunkCount++;
    metricsRef.current.totalChars += chunk.length;
    metricsRef.current.lastUpdateTime = Date.now();
  }, []);

  const getMetrics = useCallback(() => {
    const now = Date.now();
    const duration = now - metricsRef.current.startTime;
    return {
      duration,
      chunkCount: metricsRef.current.chunkCount,
      totalChars: metricsRef.current.totalChars,
      averageChunkSize: metricsRef.current.chunkCount > 0 
        ? Math.round(metricsRef.current.totalChars / metricsRef.current.chunkCount)
        : 0,
      charsPerSecond: duration > 0 
        ? Math.round((metricsRef.current.totalChars / duration) * 1000)
        : 0,
    };
  }, []);

  return {
    startMeasuring,
    recordChunk,
    getMetrics,
  };
};