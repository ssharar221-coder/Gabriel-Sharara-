import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { studyService } from '../services/studyService';

const { width } = Dimensions.get('window');

export default function FlashcardsScreen() {
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
  const flipAnimation = new Animated.Value(0);

  useEffect(() => {
    loadFlashcards();
  }, []);

  const loadFlashcards = async () => {
    try {
      const cards = await studyService.getFlashcardsDueForReview();
      setFlashcards(cards);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    }
  };

  const handleFlip = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = async () => {
    setStats({ ...stats, correct: stats.correct + 1 });
    moveToNext();
  };

  const handleIncorrect = async () => {
    setStats({ ...stats, incorrect: stats.incorrect + 1 });
    moveToNext();
  };

  const moveToNext = () => {
    setIsFlipped(false);
    flipAnimation.setValue(0);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (flashcards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="checkmark-done" size={60} color="#6366f1" />
        <Text style={styles.emptyText}>لا توجد بطاقات للمراجعة الآن</Text>
        <Text style={styles.emptySubtext}>رائع! لقد انتهيت من كل شيء 🎉</Text>
      </View>
    );
  }

  const currentCard = flashcards[currentIndex];
  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progress}> 
          {currentIndex + 1} من {flashcards.length}
        </Text>
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark" size={16} color="#10b981" />
            <Text style={styles.statText}>{stats.correct}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="close" size={16} color="#ef4444" />
            <Text style={styles.statText}>{stats.incorrect}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.cardContainer}
        scrollEnabled={false}
      >
        <TouchableOpacity
          style={styles.cardWrapper}
          onPress={handleFlip}
          activeOpacity={0.8}
        >
          {!isFlipped ? (
            <Animated.View style={[styles.card, styles.questionCard, frontAnimatedStyle]}>
              <Ionicons
                name="help-circle-outline"
                size={40}
                color="#6366f1"
                style={styles.cardIcon}
              />
              <Text style={styles.cardLabel}>السؤال</Text>
              <Text style={styles.cardContent}>{currentCard?.question}</Text>
              <Text style={styles.cardHint}>اضغط للعرض الإجابة</Text>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.card, styles.answerCard, backAnimatedStyle]}>
              <Ionicons
                name="checkmark-circle-outline"
                size={40}
                color="#10b981"
                style={styles.cardIcon}
              />
              <Text style={styles.cardLabel}>الإجابة</Text>
              <Text style={styles.cardContent}>{currentCard?.answer}</Text>
              <Text style={styles.cardHint}>اضغط للعودة للسؤال</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.incorrectBtn]}
          onPress={handleIncorrect}
        >
          <Ionicons name="close" size={24} color="#fff" />
          <Text style={styles.actionBtnText}>لم أتذكر</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.correctBtn]}
          onPress={handleCorrect}
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
          <Text style={styles.actionBtnText}>تذكرت</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  progress: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  stats: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  cardWrapper: {
    width: '100%',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 30,
    minHeight: 350,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    backfaceVisibility: 'hidden',
  },
  questionCard: {
    backgroundColor: '#6366f1',
  },
  answerCard: {
    backgroundColor: '#10b981',
  },
  cardIcon: {
    marginBottom: 20,
  },
  cardLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
    fontWeight: '500',
  },
  cardContent: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  cardHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 15,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  incorrectBtn: {
    backgroundColor: '#ef4444',
  },
  correctBtn: {
    backgroundColor: '#10b981',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
});
