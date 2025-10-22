import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '@/store';
import { AIProvider } from '@/types';

export default function SettingsScreen() {
  const {
    aiConfig,
    apiKeys,
    enableVoice,
    enableNotification,
    setAPIKey,
    toggleVoice,
    toggleNotification,
    resetSettings,
  } = useSettingsStore();

  const [editingProvider, setEditingProvider] = useState<AIProvider | null>(null);
  const [tempApiKey, setTempApiKey] = useState('');

  // 编辑API Key
  const handleEditApiKey = (provider: AIProvider) => {
    setEditingProvider(provider);
    setTempApiKey(apiKeys[provider] || '');
  };

  // 保存API Key
  const handleSaveApiKey = () => {
    if (editingProvider) {
      setAPIKey(editingProvider, tempApiKey);
      setEditingProvider(null);
      setTempApiKey('');
      Alert.alert('成功', 'API Key已保存');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* AI配置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI配置</Text>

        {/* API Key配置 */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => handleEditApiKey(aiConfig.provider)}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="key-outline" size={24} color="#007AFF" />
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingLabel}>
                {aiConfig.provider === 'doubao' ? '豆包 API Key' :
                 aiConfig.provider === 'anthropic' ? 'Claude API Key' :
                 aiConfig.provider === 'openai' ? 'OpenAI API Key' :
                 aiConfig.provider === 'google' ? 'Google API Key' :
                 aiConfig.provider === 'deepseek' ? 'DeepSeek API Key' :
                 aiConfig.provider === 'zhipu' ? '智谱 API Key' :
                 aiConfig.provider === 'openrouter' ? 'OpenRouter API Key' : 'API Key'}
              </Text>
              <Text style={styles.settingValue}>
                {aiConfig.apiKey ? '••••••••' : '未配置'}
              </Text>
            </View>
          </View>
          <Ionicons name="create-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* 功能设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>功能设置</Text>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="mic-outline" size={24} color="#007AFF" />
            <Text style={styles.settingLabel}>语音输入</Text>
          </View>
          <Switch value={enableVoice} onValueChange={toggleVoice} />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color="#007AFF" />
            <Text style={styles.settingLabel}>通知</Text>
          </View>
          <Switch value={enableNotification} onValueChange={toggleNotification} />
        </View>
      </View>

      {/* 高级设置 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>高级设置</Text>
        
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => {
            Alert.alert(
              '重置设置',
              '确定要重置所有设置吗？这将清除所有API密钥和配置。',
              [
                { text: '取消', style: 'cancel' },
                { 
                  text: '确定', 
                  onPress: () => {
                    resetSettings();
                    Alert.alert('成功', '设置已重置为默认值');
                  }
                },
              ]
            );
          }}
        >
          <View style={styles.settingLeft}>
            <Ionicons name="refresh-outline" size={24} color="#FF3B30" />
            <Text style={[styles.settingLabel, { color: '#FF3B30' }]}>重置设置</Text>
          </View>
          <Ionicons name="arrow-forward-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* API Key编辑Modal */}
      <Modal
        visible={editingProvider !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingProvider(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                配置{aiConfig.provider === 'doubao' ? '豆包' :
                     aiConfig.provider === 'anthropic' ? 'Claude' :
                     aiConfig.provider === 'openai' ? 'OpenAI' :
                     aiConfig.provider === 'google' ? 'Google' :
                     aiConfig.provider === 'deepseek' ? 'DeepSeek' :
                     aiConfig.provider === 'zhipu' ? '智谱' :
                     aiConfig.provider === 'openrouter' ? 'OpenRouter' : ''} API Key
              </Text>
              <TouchableOpacity onPress={() => setEditingProvider(null)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.apiKeyForm}>
              <Text style={styles.formLabel}>
                {aiConfig.provider === 'doubao' ? '豆包 API Key' :
                 aiConfig.provider === 'anthropic' ? 'Claude API Key' :
                 aiConfig.provider === 'openai' ? 'OpenAI API Key' :
                 aiConfig.provider === 'google' ? 'Google API Key' :
                 aiConfig.provider === 'deepseek' ? 'DeepSeek API Key' :
                 aiConfig.provider === 'zhipu' ? '智谱 API Key' :
                 aiConfig.provider === 'openrouter' ? 'OpenRouter API Key' : 'API Key'}
              </Text>
              <TextInput
                style={styles.input}
                value={tempApiKey}
                onChangeText={setTempApiKey}
                placeholder="输入API Key"
                secureTextEntry
                autoCapitalize="none"
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
                <Text style={styles.saveButtonText}>保存</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  const docURLs = {
                    'doubao': 'https://ark.cn-beijing.volces.com/',
                    'anthropic': 'https://console.anthropic.com/',
                    'openai': 'https://platform.openai.com/',
                    'google': 'https://ai.google.dev/',
                    'deepseek': 'https://platform.deepseek.com/',
                    'zhipu': 'https://open.bigmodel.cn/',
                    'openrouter': 'https://openrouter.ai/',
                    'ollama': 'https://ollama.ai/',
                  };
                  Alert.alert('获取API Key', `请访问: ${docURLs[aiConfig.provider] || 'https://ark.cn-beijing.volces.com/'}`);
                }}
              >
                <Text style={styles.linkText}>如何获取API Key?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  section: {
    backgroundColor: '#FFF',
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalItemSelected: {
    backgroundColor: '#F0F8FF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalItemDesc: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
  },
  modalItemPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  apiKeyForm: {
    padding: 16,
  },
  formLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'center',
  },
});
