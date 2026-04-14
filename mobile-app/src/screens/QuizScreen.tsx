import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  StatusBar, ActivityIndicator, Alert, Dimensions, ScrollView, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

const { width } = Dimensions.get('window');

interface Option {
  key: string;
  text: string;
}

interface Question {
  questionId: string;
  questionText: string;
  options: Option[];
}

export default function QuizScreen({ navigation, route }: any) {
  const { competitionId, competitionTitle } = route.params;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSessionId, setQuizSessionId] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initQuiz();
    return () => stopTimer();
  }, [competitionId]);

  useEffect(() => {
    if (!isLoading && !isCompleted && !isTimedOut && !isIncorrect && !isSubmitting) {
      startTimer();
    }
  }, [currentQuestionIndex, isLoading, isCompleted, isTimedOut, isIncorrect, isSubmitting]);

  const initQuiz = async () => {
    try {
      setIsLoading(true);
      
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert('Error', 'User session not found.');
        navigation.navigate('Login');
        return;
      }

      const questionsData = await apiClient.get(`api/v1/Competitions/${competitionId}/questions`);
      setQuestions(questionsData);

      const sessionData = await apiClient.post('api/v1/Quiz/start', {
        userId: userId,
        competitionId: competitionId
      });
      
      setQuizSessionId(sessionData.quizSessionId);
      
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Quiz initialization failed.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    stopTimer();
    setTimer(30);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleTimeout = async () => {
    stopTimer();
    setIsTimedOut(true);
    if (quizSessionId) {
      try {
        await apiClient.post('api/v1/competition/session-timeout', {
          sessionId: quizSessionId
        });
      } catch (err) {
        console.error('Timeout sync error:', err);
      }
    }
  };

  const handleOptionSelect = (optionKey: string) => {
    if (isSubmitting || isTimedOut || isIncorrect) return;
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.questionId]: optionKey
    });
  };

  const handleNext = async () => {
    if (isSubmitting || !quizSessionId) return;
    
    const currentQuestion = questions[currentQuestionIndex];
    const answer = selectedAnswers[currentQuestion.questionId] || "";

    stopTimer();
    setIsSubmitting(true);

    try {
      const response = await apiClient.post('api/v1/Quiz/submit-answer', {
        quizSessionId: quizSessionId,
        quizQuestionId: currentQuestion.questionId,
        submittedAnswer: answer
      });

      if (!response.isCorrect) {
        setIsIncorrect(true);
        return;
      }

      if (response.quizCompleted) {
        setResultMessage(response.message || "Challenge Finished!");
        setIsCompleted(true);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    } catch (err: any) {
      Alert.alert('Error', 'Submission failed. Try again.');
      startTimer();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['auth_token', 'user_id']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#0B1315', '#162829']} style={styles.container}>
        <ActivityIndicator size="large" color="#10B981" style={{ flex: 1 }} />
      </LinearGradient>
    );
  }

  // Time Expired View
  if (isTimedOut) {
    return (
      <LinearGradient colors={['#0B1315', '#0F172A', '#1E1B4B']} style={styles.container}>
        <SafeAreaView style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <View style={[styles.statusCircle, { backgroundColor: '#F59E0B' }]}>
              <Text style={styles.statusIcon}>⏱️</Text>
            </View>
            <Text style={[styles.resultTitle, { color: '#F59E0B' }]}>Time Expired</Text>
            <Text style={styles.resultSubText}>
              You did not answer the question within the allowed time.
            </Text>
            <Text style={styles.resultBoldText}>Your current attempt has ended.</Text>
          </View>

          <View style={styles.infoGlassBox}>
            <Text style={styles.infoTextSmall}>
              An email notification will be sent confirming this incomplete attempt. 
              You may purchase another entry (max 10 per competition) to try again. 
              Log out and log back in to begin a new attempt.
            </Text>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Home')}>
              <LinearGradient colors={['#0EA5E9', '#0284C7']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnTextThin}>Return to Competition Home</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleLogout}>
              <Text style={styles.logoutTextRed}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Incorrect Answer View
  if (isIncorrect) {
    return (
      <LinearGradient colors={['#0B1315', '#1E1B4B', '#451A03']} style={styles.container}>
        <SafeAreaView style={styles.resultContainer}>
          <View style={styles.resultHeader}>
            <View style={[styles.statusCircle, { backgroundColor: '#DC2626' }]}>
              <Text style={styles.statusIcon}>❌</Text>
            </View>
            <Text style={[styles.resultTitle, { color: '#EF4444' }]}>Incorrect</Text>
            <Text style={styles.resultSubText}>
              You have provided an incorrect response to the skill-based qualification question.
            </Text>
            <Text style={styles.resultBoldText}>Your current attempt has ended.</Text>
          </View>

          <View style={styles.infoGlassBox}>
            <Text style={styles.infoTextSmall}>
              An email notification will be sent confirming this incomplete attempt. 
              You may purchase another entry (max 10 per competition) to try again. 
              Log out and log back in to begin a new attempt.
            </Text>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Home')}>
              <LinearGradient colors={['#0EA5E9', '#0284C7']} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.btnTextThin}>Return to Competition Home</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleLogout}>
              <Text style={styles.logoutTextRed}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (isCompleted) {
    return (
      <LinearGradient colors={['#0B1315', '#162829']} style={styles.container}>
        <SafeAreaView style={styles.centerFlow}>
          <Text style={styles.congratsTitle}>Excellent Work!</Text>
          <View style={styles.resultCircle}>
            <Text style={styles.checkIconLarge}>✅</Text>
          </View>
          <Text style={styles.resultSub}>{resultMessage}</Text>
          
          <TouchableOpacity 
            style={styles.finishBtnBase}
            onPress={() => navigation.navigate('Home')}
          >
            <LinearGradient
              colors={['#059669', '#10B981']}
              style={styles.finishBtn}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              <Text style={styles.finishBtnText}>Finish Challenge</Text>
            </LinearGradient>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <LinearGradient colors={['#0B1315', '#101B20', '#162829']} style={styles.container} locations={[0, 0.5, 1]}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle} numberOfLines={1}>{competitionTitle}</Text>
            <Text style={styles.headerStep}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
          </View>

          <View style={[styles.timerBadge, timer <= 5 && styles.timerBadgeAlert]}>
            <Text style={styles.timerIcon}>⏱️</Text>
            <Text style={[styles.timerValue, timer <= 5 && { color: '#FEE2E2' }]}>
              {timer} <Text style={styles.secLabel}>sec</Text>
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
          </View>

          <View style={styles.optionsWrap}>
            {currentQuestion.options.map((option) => {
              const isSelected = selectedAnswers[currentQuestion.questionId] === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.optionItem, isSelected && styles.optionSelected]}
                  activeOpacity={0.7}
                  onPress={() => handleOptionSelect(option.key)}
                  disabled={isSubmitting}
                >
                  <View style={[styles.optionIndicator, isSelected && styles.optionIndicatorActive]}>
                    <Text style={[styles.optionKey, isSelected && styles.optionKeyActive]}>
                      {option.key}
                    </Text>
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextBtnBase, !selectedAnswers[currentQuestion.questionId] && styles.btnDisabled]}
            disabled={!selectedAnswers[currentQuestion.questionId] || isSubmitting}
            onPress={handleNext}
          >
            <LinearGradient
              colors={selectedAnswers[currentQuestion.questionId] ? ['#059669', '#10B981'] : ['#1E293B', '#334155']}
              style={styles.nextBtn}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              {isSubmitting ? (
                 <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.nextBtnText}>
                  {currentQuestionIndex === questions.length - 1 ? 'Finish Challenge' : 'Next Question →'}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerLeft: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '900' },
  headerStep: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '700', marginTop: 2 },
  timerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  timerBadgeAlert: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.4)' },
  timerIcon: { fontSize: 14, marginRight: 6 },
  timerValue: { color: '#fff', fontSize: 16, fontWeight: '900' },
  secLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '400' },
  progressTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.05)', width: '100%' },
  progressFill: { height: '100%', backgroundColor: '#10B981' },
  scrollContent: { padding: 24 },
  questionCard: { padding: 24, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginBottom: 32 },
  questionText: { fontSize: 20, color: '#fff', fontWeight: '800', lineHeight: 28 },
  optionsWrap: { gap: 16 },
  optionItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  optionSelected: { backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.3)' },
  optionIndicator: { width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  optionIndicatorActive: { backgroundColor: '#10B981' },
  optionKey: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '900' },
  optionKeyActive: { color: '#fff' },
  optionText: { fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: '600', flex: 1 },
  optionTextActive: { color: '#fff' },
  footer: { padding: 24 },
  nextBtnBase: { width: '100%' },
  nextBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center', shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  btnDisabled: { shadowOpacity: 0 },
  centerFlow: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  congratsTitle: { fontSize: 32, fontWeight: '900', color: '#fff', marginBottom: 24 },
  resultCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(16, 185, 129, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#10B981', marginBottom: 24 },
  checkIconLarge: { fontSize: 50 },
  resultSub: { fontSize: 18, color: '#fff', fontWeight: '700', textAlign: 'center', marginBottom: 40, lineHeight: 26 },
  finishBtnBase: { width: '100%' },
  finishBtn: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  finishBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  // Result States Styles
  resultContainer: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
  resultHeader: { alignItems: 'center', marginBottom: 40 },
  statusCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 24, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  statusIcon: { fontSize: 40 },
  resultTitle: { fontSize: 36, fontWeight: '900', marginBottom: 16 },
  resultSubText: { fontSize: 16, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 8, lineHeight: 24 },
  resultBoldText: { fontSize: 18, fontWeight: '900', color: '#fff', textAlign: 'center' },
  infoGlassBox: { padding: 24, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginBottom: 40 },
  infoTextSmall: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 20, textAlign: 'center' },
  resultActions: { width: '100%', gap: 16 },
  primaryBtn: { width: '100%' },
  btnGradient: { paddingVertical: 18, borderRadius: 16, alignItems: 'center' },
  btnTextThin: { color: '#fff', fontSize: 16, fontWeight: '900' },
  secondaryBtn: { width: '100%', paddingVertical: 18, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(239, 68, 68, 0.05)' },
  logoutTextRed: { color: '#EF4444', fontSize: 16, fontWeight: '900' }
});
