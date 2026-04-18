import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Share,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';

export default function SubmissionResultScreen({ route, navigation }: any) {
  const { result } = route.params;

  // Mock score logic if not fully provided by API, but based on category
  // In the screenshot category is "Low quality response", sentimentScore is 0
  const isAccepted = result.message === "Entry Accepted";
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just submitted my entry for The Big Skill Challenge! Reference: ${result.referenceNumber}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f172a', '#1e293b']} style={StyleSheet.absoluteFill} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Home')}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.statusIconCircle, isAccepted ? styles.successCircle : styles.failCircle]}>
            <Ionicons 
              name={isAccepted ? "checkmark-circle" : "alert-circle"} 
              size={64} 
              color={isAccepted ? "#34d399" : "#fb7185"} 
            />
          </View>
          <Text style={styles.statusTitle}>{result.message}</Text>
          <Text style={styles.statusSubtitle}>
            {isAccepted 
              ? "Your entry has been recorded and is now in the prize pool." 
              : "There was an issue with your entry submission."}
          </Text>
        </View>

        <BlurView intensity={20} tint="light" style={styles.resultCard}>
          <View style={styles.resultRow}>
            <View>
              <Text style={styles.resultLabel}>CATEGORY</Text>
              <Text style={styles.categoryText}>{result.category}</Text>
            </View>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreLabel}>SENTIMENT</Text>
              <Text style={styles.scoreValue}>{result.sentimentScore}%</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="text-outline" size={20} color="#94a3b8" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Word Count</Text>
                <Text style={styles.detailValue}>{result.wordCount}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} color="#94a3b8" />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(result.submittedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </BlurView>

        <BlurView intensity={15} tint="dark" style={styles.referenceCard}>
          <Text style={styles.refLabel}>REFERENCE NUMBER</Text>
          <View style={styles.refRow}>
            <Text style={styles.refValue} numberOfLines={1}>{result.referenceNumber}</Text>
            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-social-outline" size={20} color="#38bdf8" />
            </TouchableOpacity>
          </View>
        </BlurView>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => navigation.navigate('Home')}
          >
            <LinearGradient
              colors={['#0284c7', '#0369a1']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Return to Dashboard</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <Text style={styles.footerNote}>
            A confirmation email has been sent to your registered address.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  closeButton: {
    padding: 8,
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  statusIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  successCircle: {
    borderWidth: 2,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  failCircle: {
    borderWidth: 2,
    borderColor: 'rgba(251, 113, 133, 0.3)',
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  resultCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#38bdf8',
    letterSpacing: 1,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreBadge: {
    alignItems: 'flex-end',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#94a3b8',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34d399',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailTextContainer: {
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  referenceCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 40,
  },
  refLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    letterSpacing: 1,
    marginBottom: 8,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refValue: {
    fontSize: 14,
    color: '#94a3b8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
    marginRight: 10,
  },
  actions: {
    width: '100%',
  },
  mainButton: {
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 20,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerNote: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 12,
    lineHeight: 18,
  },
});
