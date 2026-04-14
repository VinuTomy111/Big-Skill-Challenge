import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, StatusBar, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const STEPPER_DATA = [
  { id: 1, title: 'Check', completed: true },
  { id: 2, title: 'Check', completed: true },
  { id: 3, title: 'Eligibility', active: true },
  { id: 4, title: '4', future: true },
];

export default function HomeScreen({ navigation }: any) {
  const [checkedItems, setCheckedItems] = useState([false, false, false]);

  const toggleItem = (index: number) => {
    const newItems = [...checkedItems];
    newItems[index] = !newItems[index];
    setCheckedItems(newItems);
  };

  const allChecked = checkedItems.every(item => item === true);
  const checkedCount = checkedItems.filter(item => item === true).length;

  return (
    <LinearGradient
      colors={['#0B1315', '#101B20', '#162829']}
      style={styles.container}
      locations={[0, 0.5, 1]}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <View style={styles.backCircle}>
              <Text style={styles.backArrow}>←</Text>
            </View>
          </TouchableOpacity>

        </View>



        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.heroTitle}>Entry Eligibility</Text>
          <Text style={styles.heroSubText}>
            Please confirm the following before proceeding to payment.
          </Text>

          {/* Eligibility Cards */}
          <View style={styles.cardsWrap}>
            {[
              "I confirm I am eligible to enter this competition.",
              "I understand a maximum of 10 entries is permitted per competition.",
              "I acknowledge that this is a competition of skill, not chance."
            ].map((text, idx) => (
              <TouchableOpacity
                key={idx}
                style={[styles.eligibilityCard, checkedItems[idx] && styles.cardActive]}
                activeOpacity={0.7}
                onPress={() => toggleItem(idx)}
              >
                <View style={[styles.checkbox, checkedItems[idx] && styles.checkboxActive]}>
                  {checkedItems[idx] && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.cardText}>{text}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Status Message */}
          <View style={styles.statusBox}>
            <View style={styles.statusInner}>
              <Text style={styles.statusIcon}>🗒️</Text>
              <Text style={styles.statusText}>
                Please confirm all {checkedCount} / 3 items above to continue.
              </Text>
            </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={[styles.ctaWrap, !allChecked && styles.ctaDisabled]}
            onPress={() => allChecked && navigation.navigate('CompetitionList')}
            disabled={!allChecked}
          >
            <LinearGradient
              colors={allChecked ? ['#059669', '#10B981'] : ['#1E293B', '#334155']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.btnCta}
            >
              <Text style={[styles.btnCtaText, !allChecked && styles.textDisabled]}>
                Continue to Competition List →
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Important Box */}
          <View style={styles.importantBox}>
            <View style={styles.importantRow}>
              <View style={styles.infoIconCircle}>
                <Text style={styles.infoIcon}>i</Text>
              </View>
              <Text style={styles.importantText}>
                <Text style={{ fontWeight: '900', color: '#fff' }}>Important: </Text>
                Payment is processed into a designated competition trust account. Entries are recorded upon successful quiz completion and creative submission.
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerWrap}>
            <Text style={styles.footerText}>Pure skill. One prize. One winner.</Text>
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
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  poweredBy: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  lucidEngine: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
    fontStyle: 'italic',
  },
  // Stepper Styles
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCompleted: {
    backgroundColor: '#10B981',
  },
  stepActive: {
    backgroundColor: '#F59E0B',
  },
  stepFuture: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
  },
  stepCheck: {
    color: '#022C22',
    fontSize: 14,
    fontWeight: '900',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
  },
  stepActiveText: {
    color: '#000',
  },
  stepFutureText: {
    color: 'rgba(255,255,255,0.3)',
  },
  stepLabel: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 8,
    maxWidth: 50,
  },
  lineCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.4)',
  },
  lineFuture: {
    backgroundColor: 'rgba(255,255,255,0.1)',
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
  cardsWrap: {
    gap: 16,
    marginBottom: 24,
  },
  eligibilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 14,
  },
  cardActive: {
    borderColor: 'rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.04)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  checkboxActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  cardText: {
    flex: 1,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  statusBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  statusInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIcon: {
    fontSize: 16,
  },
  statusText: {
    color: '#F59E0B',
    fontSize: 13,
    fontWeight: '700',
  },
  // CTA
  ctaWrap: {
    marginBottom: 32,
    width: '100%',
  },
  ctaDisabled: {
    shadowOpacity: 0,
  },
  btnCta: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30, // Pill shape as per design
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  btnCtaText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  textDisabled: {
    color: 'rgba(255,255,255,0.2)',
  },
  // Important
  importantBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 40,
  },
  importantRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoIconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  importantText: {
    flex: 1,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    lineHeight: 18,
  },
  footerWrap: {
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  }
});
