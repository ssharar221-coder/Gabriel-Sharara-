import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const STUDY_HOURS = [1, 2, 3, 4, 5];

export default function StudyPlanScreen() {
  const [schedule, setSchedule] = useState<any>({
    0: { hours: 2, topics: [] },
    1: { hours: 2, topics: [] },
    2: { hours: 3, topics: [] },
    3: { hours: 2, topics: [] },
    4: { hours: 3, topics: [] },
    5: { hours: 1, topics: [] },
    6: { hours: 4, topics: [] },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [newTopic, setNewTopic] = useState('');

  const handleAddTopic = () => {
    if (newTopic.trim()) {
      const updatedSchedule = { ...schedule };
      updatedSchedule[selectedDay].topics.push(newTopic);
      setSchedule(updatedSchedule);
      setNewTopic('');
      setModalVisible(false);
    }
  };

  const handleUpdateHours = (day: number, hours: number) => {
    const updatedSchedule = { ...schedule };
    updatedSchedule[day].hours = hours;
    setSchedule(updatedSchedule);
  };

  const getTotalWeeklyHours = () => {
    return Object.values(schedule).reduce((sum: number, day: any) => sum + day.hours, 0);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>جدول الدراسة الأسبوعي</Text>
        <View style={styles.summaryCard}>
          <Ionicons name="time" size={24} color="#6366f1" />
          <View style={styles.summaryContent}>
            <Text style={styles.summaryLabel}>إجمالي الساعات الأسبوعية</Text>
            <Text style={styles.summaryValue}>{getTotalWeeklyHours()} ساعات</Text>
          </View>
        </View>
      </View>

      {DAYS.map((day, index) => (
        <View key={index} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayName}>{day}</Text>
            <View style={styles.hoursSelector}>
              <TouchableOpacity
                style={[styles.hoursBtn, styles.minusBtn]}
                onPress={() =>
                  handleUpdateHours(index, Math.max(0.5, schedule[index].hours - 0.5))
                }
              >
                <Ionicons name="remove" size={18} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.hoursText}>{schedule[index].hours} ساعات</Text>
              <TouchableOpacity
                style={[styles.hoursBtn, styles.plusBtn]}
                onPress={() => handleUpdateHours(index, schedule[index].hours + 0.5)}
              >
                <Ionicons name="add" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.topicsContainer}>
            {schedule[index].topics.map((topic: string, topicIdx: number) => (
              <View key={topicIdx} style={styles.topicTag}>
                <Ionicons name="bookmark" size={14} color="#6366f1" />
                <Text style={styles.topicText}>{topic}</Text>
                <TouchableOpacity
                  onPress={() => {
                    const updatedSchedule = { ...schedule };
                    updatedSchedule[index].topics.splice(topicIdx, 1);
                    setSchedule(updatedSchedule);
                  }}
                >
                  <Ionicons name="close" size={14} color="#6366f1" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addTopicBtn}
              onPress={() => {
                setSelectedDay(index);
                setModalVisible(true);
              }}
            >
              <Ionicons name="add-circle-outline" size={16} color="#6366f1" />
              <Text style={styles.addTopicText}>إضافة موضوع</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>إضافة موضوع - {DAYS[selectedDay]}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1f2937" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="اسم الموضوع..."
              placeholderTextColor="#9ca3af"
              value={newTopic}
              onChangeText={setNewTopic}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddTopic}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.addButtonText}>إضافة</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryContent: {
    marginLeft: 15,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dayCard: {
    marginHorizontal: 20,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  hoursSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hoursBtn: {
    width: 30,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  minusBtn: {
    backgroundColor: '#ef4444',
  },
  plusBtn: {
    backgroundColor: '#10b981',
  },
  hoursText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    minWidth: 70,
    textAlign: 'center',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  topicText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '500',
  },
  addTopicBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addTopicText: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20,
    fontSize: 16,
    color: '#1f2937',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
