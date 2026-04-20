import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5099';

export default function CreativeSubmissionScreen({ route, navigation }: any) {
  const { quizSessionId } = route.params;
  const [text, setText] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTimeout = () => {
    Alert.alert('Time Expired', 'Your time for the creative submission has expired.', [
      { text: 'OK', onPress: () => navigation.navigate('Home') },
    ]);
  };

  const getWordCount = (str: string) => {
    return str.trim() ? str.trim().split(/\s+/).length : 0;
  };

  const wordCount = getWordCount(text);
  const isValid = wordCount === 25;

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/submissions`,
        {
          quizSessionId,
          text: text.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      navigation.navigate('SubmissionResult', { result: response.data });

    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert('Error', error.response?.data?.Message || 'Failed to submit your response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / 120) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={StyleSheet.absoluteFill} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView 
          style={styles.flex} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Creative Submission</Text>
              <Text style={styles.subtitle}>Exactly 25 words required</Text>
            </View>
            <BlurView intensity={30} tint="dark" style={styles.timerBadge}>
              <Ionicons name="timer-outline" size={20} color="#38bdf8" />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </BlurView>
          </View>

          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>

          <View style={styles.content}>
            <BlurView intensity={20} tint="light" style={styles.promptCard}>
              <Text style={styles.promptLabel}>YOUR PROMPT</Text>
              <Text style={styles.promptText}>
                "In exactly 25 words, tell us why you should win this prize."
              </Text>
            </BlurView>

            <View style={styles.responseHeader}>
              <Text style={styles.responseLabel}>Your Response</Text>
              <Text style={[styles.wordCount, isValid && styles.correctCount]}>
                {wordCount} / 25
              </Text>
            </View>

            <BlurView intensity={15} tint="light" style={styles.inputCard}>
              <TextInput
                style={styles.input}
                placeholder="Type your 25-word response here..."
                placeholderTextColor="#94a3b8"
                multiline
                value={text}
                onChangeText={setText}
                contextMenuHidden={true}
                selectTextOnFocus={false}
                caretHidden={false}
              />
            </BlurView>

            <Text style={styles.hint}>Begin typing your response above.</Text>

            <TouchableOpacity
              style={[styles.submitButton, !isValid && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.submitButtonText}>Submit Entry</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
                </View>
              )}
            </TouchableOpacity>

            <BlurView intensity={20} tint="dark" style={styles.warningCard}>
              <View style={styles.warningIconContainer}>
                <Ionicons name="remove-circle" size={20} color="#ef4444" />
              </View>
              <Text style={styles.warningText}>
                Paste is disabled. Please type your response. Submission blocked unless word count is exactly 25.
              </Text>
            </BlurView>
          </View>
        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  timerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    fontVariant: ['tabular-nums'],
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '90%',
    alignSelf: 'center',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#34d399',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  promptCard: {
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  promptLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#38bdf8',
    letterSpacing: 1,
    marginBottom: 12,
  },
  promptText: {
    fontSize: 18,
    color: 'white',
    fontStyle: 'italic',
    lineHeight: 26,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  responseLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  wordCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  correctCount: {
    color: '#34d399',
  },
  inputCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    height: 180,
    padding: 16,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  hint: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 12,
    marginBottom: 32,
  },
  submitButton: {
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(2, 132, 199, 0.3)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 12,
  },
  warningCard: {
    flexDirection: 'row',
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(241, 245, 249, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  warningIconContainer: {
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    color: '#fbbf24',
    fontSize: 13,
    lineHeight: 18,
  },
});
