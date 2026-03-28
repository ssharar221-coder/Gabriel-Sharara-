import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('gabriel-study.db');

export const studyService = {
  // Initialize database
  async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        // Subjects table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            color TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`
        );

        // Topics table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY,
            subjectId INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(subjectId) REFERENCES subjects(id)
          );`
        );

        // Flashcards table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS flashcards (
            id INTEGER PRIMARY KEY,
            topicId INTEGER NOT NULL,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            difficulty TEXT,
            timesReviewed INTEGER DEFAULT 0,
            correctCount INTEGER DEFAULT 0,
            nextReviewDate TIMESTAMP,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(topicId) REFERENCES topics(id)
          );`
        );

        // Study sessions table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS studySessions (
            id INTEGER PRIMARY KEY,
            topicId INTEGER NOT NULL,
            duration INTEGER,
            cardsReviewed INTEGER,
            correctAnswers INTEGER,
            sessionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(topicId) REFERENCES topics(id)
          );`
        );

        // Study schedule table
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS studySchedule (
            id INTEGER PRIMARY KEY,
            subjectId INTEGER NOT NULL,
            dayOfWeek INTEGER,
            startTime TEXT,
            duration INTEGER,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(subjectId) REFERENCES subjects(id)
          );`,
          [],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  },

  // Subject operations
  async createSubject(name: string, color: string): Promise<number> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO subjects (name, color) VALUES (?, ?)',
          [name, color],
          (_, result) => resolve(result.insertId),
          (_, error) => reject(error)
        );
      });
    });
  },

  async getSubjects(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM subjects ORDER BY createdAt DESC',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => reject(error)
        );
      });
    });
  },

  // Topic operations
  async createTopic(subjectId: number, name: string, description: string): Promise<number> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO topics (subjectId, name, description) VALUES (?, ?, ?)',
          [subjectId, name, description],
          (_, result) => resolve(result.insertId),
          (_, error) => reject(error)
        );
      });
    });
  },

  // Flashcard operations
  async addFlashcard(topicId: number, question: string, answer: string, difficulty: string): Promise<number> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO flashcards (topicId, question, answer, difficulty) VALUES (?, ?, ?, ?)',
          [topicId, question, answer, difficulty],
          (_, result) => resolve(result.insertId),
          (_, error) => reject(error)
        );
      });
    });
  },

  async getFlashcardsDueForReview(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM flashcards WHERE nextReviewDate IS NULL OR nextReviewDate <= datetime("now")',
          [],
          (_, result) => resolve(result.rows._array),
          (_, error) => reject(error)
        );
      });
    });
  },

  // Study session tracking
  async recordStudySession(topicId: number, duration: number, cardsReviewed: number, correctAnswers: number): Promise<void> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO studySessions (topicId, duration, cardsReviewed, correctAnswers) VALUES (?, ?, ?, ?)',
          [topicId, duration, cardsReviewed, correctAnswers],
          () => resolve(),
          (_, error) => reject(error)
        );
      });
    });
  },

  // Get study statistics
  async getStudyStats(): Promise<any> {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT 
            COUNT(DISTINCT topicId) as totalTopics,
            SUM(cardsReviewed) as totalCardsReviewed,
            SUM(correctAnswers) as totalCorrectAnswers,
            AVG(CAST(correctAnswers AS FLOAT) / NULLIF(cardsReviewed, 0)) as averageScore,
            SUM(duration) as totalStudyTime
          FROM studySessions`,
          [],
          (_, result) => resolve(result.rows._array[0]),
          (_, error) => reject(error)
        );
      });
    });
  },
};