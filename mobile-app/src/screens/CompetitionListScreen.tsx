import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar, ActivityIndicator, Alert, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../api/client';

const { width } = Dimensions.get('window');

interface Competition {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export default function CompetitionListScreen({ navigation }: any) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.get('api/v1/Competitions/competitions');
      setCompetitions(data);
    } catch (err: any) {
      console.error('Fetch error:', err);
      Alert.alert('Error', 'Failed to load competitions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days left`;
  };

  return (
    <LinearGradient
      colors={['#0B1315', '#101B20', '#162829']}
      style={styles.container}
      locations={[0, 0.5, 1]}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backBtn}>
            <View style={styles.backCircle}>
              <Text style={styles.backArrow}>←</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Available Challenges</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heroTitle}>Active Competitions</Text>
          <Text style={styles.heroSubText}>
            Select a challenge and put your skills to the test.
          </Text>

          {isLoading ? (
            <View style={styles.loaderWrap}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.loaderText}>Loading Challenges...</Text>
            </View>
          ) : competitions.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>🏆</Text>
              <Text style={styles.emptyText}>No active competitions found.</Text>
            </View>
          ) : (
            competitions.map((comp) => (
              <View key={comp.id} style={styles.glassCard}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                  style={styles.cardInner}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.compTitle}>{comp.title}</Text>
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{getTimeRemaining(comp.endDate)}</Text>
                    </View>
                  </View>

                  <Text style={styles.compDesc} numberOfLines={2}>
                    {comp.description}
                  </Text>

                  <View style={styles.divider} />

                  <View style={styles.cardFooter}>
                    <View style={styles.dateInfo}>
                      <Text style={styles.dateLabel}>Starts:</Text>
                      <Text style={styles.dateValue}>{formatDate(comp.startDate)}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.continueBtn}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate('Quiz', { 
                        competitionId: comp.id,
                        competitionTitle: comp.title 
                      })}
                    >
                      <LinearGradient
                        colors={['#059669', '#10B981']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.btnGradient}
                      >
                        <Text style={styles.btnText}>Enter Challenge →</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </LinearGradient>
              </View>
            ))
          )}

          {/* Footer Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Why enter?</Text>
            <Text style={styles.infoBody}>
              Every challenge is a test of pure skill. One prize, one winner, total transparency.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },
  backArrow: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 22,
    marginBottom: 32,
  },
  // Loader
  loaderWrap: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  loaderText: {
    color: 'rgba(255,255,255,0.5)',
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  // Empty State
  emptyWrap: {
    paddingVertical: 60,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 16,
    fontWeight: '600',
  },
  // Cards
  glassCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardInner: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  compTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    flex: 1,
    marginRight: 12,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  badgeText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '900',
  },
  compDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 20,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInfo: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '700',
  },
  continueBtn: {
    flex: 1.2,
  },
  btnGradient: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },
  // Info Box
  infoBox: {
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(245, 158, 11, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.1)',
  },
  infoTitle: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 6,
  },
  infoBody: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    lineHeight: 18,
  }
});
