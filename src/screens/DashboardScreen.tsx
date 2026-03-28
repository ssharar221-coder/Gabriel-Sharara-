import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studyService } from '../services/studyService';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }: any) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await studyService.getStudyStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}> 
      <View style={styles.statHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value || '0'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}> 
        <Text style={styles.greeting}>مرحباً بك! 👋</Text>
        <Text style={styles.subGreeting}>استمتع بجلسة دراسية منتجة</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon="flame"
          title="السلسلة الحالية"
          value="7 أيام"
          color="#ff6b6b"
        />
        <StatCard
          icon="book"
          title="بطاقات تم مراجعتها"
          value={stats?.totalCardsReviewed || 0}
          color="#4ecdc4"
        />
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon="checkmark-circle"
          title="نسبة النجاح"
          value={`${Math.round((stats?.averageScore || 0) * 100)}%`}
          color="#45b7d1"
        />
        <StatCard
          icon="time"
          title="وقت الدراسة الإجمالي"
          value={`${Math.round((stats?.totalStudyTime || 0) / 60)} ساعة`}
          color="#f7b731"
        />
      </View>

      <View style={styles.quickActionsContainer}> 
        <Text style={styles.sectionTitle}>إجراءات سريعة</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Flashcards')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#6366f1' }]}>
            <Ionicons name="layers" size={24} color="#fff" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>ابدأ مراجعة البطاقات</Text>
            <Text style={styles.actionSubtitle}>راجع المواد المستحقة</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('StudyPlan')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#8b5cf6' }]}>
            <Ionicons name="calendar" size={24} color="#fff" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>جدول الدراسة</Text>
            <Text style={styles.actionSubtitle}>نظم وقت دراستك</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AIAssistant')}
        >
          <View style={[styles.actionIcon, { backgroundColor: '#ec4899' }]}>
            <Ionicons name="sparkles" size={24} color="#fff" />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>المساعد الذكي</Text>
            <Text style={styles.actionSubtitle}>احصل على توصي��ت شخصية</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statTitle: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  quickActionsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
