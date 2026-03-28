import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { geminiService } from '../services/geminiService';

export default function AIAssistantScreen() {
  const [activeTab, setActiveTab] = useState('ask');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('متوسط');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateFlashcards = async () => {
    if (!content.trim() || !topic.trim()) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }
    setLoading(true);
    try {
      const flashcards = await geminiService.generateFlashcards(content, topic);
      setResult(JSON.stringify(flashcards, null, 2));
    } catch (error) {
      setResult('حدث خطأ في توليد البطاقات. الرجاء المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!topic.trim()) {
      alert('الرجاء إدخال الموضوع');
      return;
    }
    setLoading(true);
    try {
      const questions = await geminiService.generateQuestions(topic, difficulty, 5);
      setResult(JSON.stringify(questions, null, 2));
    } catch (error) {
      setResult('حدث خطأ في توليد الأسئلة. الرجاء المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeContent = async () => {
    if (!content.trim() || !topic.trim()) {
      alert('الرجاء ملء جميع الحقول');
      return;
    }
    setLoading(true);
    try {
      const summary = await geminiService.summarizeContent(content, topic);
      setResult(summary);
    } catch (error) {
      setResult('حدث خطأ في تلخيص المحتوى. الرجاء المحاولة لاحقاً');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ask' && styles.activeTab]}
          onPress={() => setActiveTab('ask')}
        >
          <Ionicons
            name="chatbubble"
            size={20}
            color={activeTab === 'ask' ? '#6366f1' : '#9ca3af'}
          />
          <Text
            style={[styles.tabText, activeTab === 'ask' && styles.activeTabText]}
          >
            اسأل الذكاء الاصطناعي
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'generate' && styles.activeTab]}
          onPress={() => setActiveTab('generate')}
        >
          <Ionicons
            name="sparkles"
            size={20}
            color={activeTab === 'generate' ? '#6366f1' : '#9ca3af'}
          />
          <Text
            style={[styles.tabText, activeTab === 'generate' && styles.activeTabText]}
          >
            توليد المحتوى
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'ask' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>اطلب توصيات شخصية</Text>
            <View style={styles.card}>
              <Text style={styles.label}>المواد الدراسية</Text>
              <TextInput
                style={styles.input}
                placeholder="مثال: الرياضيات، الفيزياء، العربية..."
                placeholderTextColor="#9ca3af"
                value={topic}
                onChangeText={setTopic}
                multiline
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleGenerateQuestions}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="send" size={18} color="#fff" />
                    <Text style={styles.buttonText}>احصل على توصيات</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === 'generate' && (
          <View style={styles.section}>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>توليد بطاقات التعلم</Text>
              <Text style={styles.label}>الموضوع</Text>
              <TextInput
                style={styles.input}
                placeholder="أدخل الموضوع..."
                placeholderTextColor="#9ca3af"
                value={topic}
                onChangeText={setTopic}
              />

              <Text style={styles.label}>المحتوى</Text>
              <TextInput
                style={[styles.input, styles.largeInput]}
                placeholder="الصق أو اكتب المحتوى هنا..."
                placeholderTextColor="#9ca3af"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={5}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleGenerateFlashcards}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="layers" size={18} color="#fff" />
                    <Text style={styles.buttonText}>توليد بطاقات</Text>
                  </>
                )}
              </TouchableOpacity>

              <Text style={[styles.sectionTitle, { marginTop: 25 }]}>تلخيص المحتوى</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={handleSummarizeContent}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="document-text" size={18} color="#fff" />
                    <Text style={styles.buttonText}>تلخيص المحتوى</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {result && (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>النتيجة</Text>
              <TouchableOpacity onPress={() => setResult('')}> 
                <Ionicons name="close" size={20} color="#1f2937" />
              </TouchableOpacity>
            </View>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  activeTabText: {
    color: '#6366f1',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#1f2937',
  },
  largeInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  resultText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
});
