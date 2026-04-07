import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, 
  SafeAreaView, Dimensions, StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Carousel Data
const CAROUSEL_DATA = [
  {
    id: '0',
    title: 'BMW X5 SUV',
    tag: 'This Competition',
    value: 'Value ~A$65,000',
    img: require('../../assets/bmw-x5.png'),
    badge: 'Current Prize',
    badgeColor: ['#059669', '#10B981']
  },
  {
    id: '1',
    title: 'Luxury Caravan',
    tag: 'Next Competition',
    value: 'Value ~A$120,000',
    img: require('../../assets/caravan.png'),
    badge: 'Coming Soon',
    badgeColor: ['#0891B2', '#06B6D4']
  },
  {
    id: '2',
    title: '48ft Superyacht',
    tag: 'Upcoming Competition',
    value: 'Value ~A$1.2 Million',
    img: require('../../assets/boat.png'),
    badge: 'Coming Soon',
    badgeColor: ['#0891B2', '#06B6D4']
  }
];

export default function LandingScreen({ navigation }: any) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Time logic for countdown
  const [timeLeft, setTimeLeft] = useState({ d: 89, h: 18, m: 0, s: 0 });
  
  useEffect(() => {
    const end = new Date();
    end.setDate(end.getDate() + 89);
    end.setHours(end.getHours() + 18);
    
    const timer = setInterval(() => {
      let diff = end.getTime() - Date.now();
      if (diff < 0) diff = 0;
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if(roundIndex !== activeSlide && roundIndex >= 0 && roundIndex < CAROUSEL_DATA.length) {
      setActiveSlide(roundIndex);
    }
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
          <Text style={styles.logoText}>Big Skill Challenge™</Text>
          <TouchableOpacity 
            style={styles.btnSignin}
            onPress={() => navigation.navigate('Login')} // Redirect to login as placeholder
          >
            <Text style={styles.btnSigninText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* BIG WIN Badge Map */}
          <View style={styles.badgeWrap}>
            <Text style={styles.flameEmojiLeft}>⚡</Text>
            <LinearGradient 
              colors={['#10B981', '#059669']} 
              style={styles.badgeCircle}
              start={{x: 0, y: 0}} end={{x: 1, y: 1}}
            >
              <Text style={styles.badgeBigText}>BIG</Text>
              <Text style={styles.badgeBigText}>WIN</Text>
            </LinearGradient>
            <Text style={styles.flameEmojiRight}>⚡</Text>
          </View>

          <Text style={styles.heroTitle}>The Big Skill Challenge™</Text>
          <Text style={styles.heroSub}>Answer the prompt · Win the prize · Pure skill</Text>

          {/* Carousel */}
          <View style={styles.carouselOuter}>
            <ScrollView 
              horizontal 
              pagingEnabled 
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
            >
              {CAROUSEL_DATA.map((item) => (
                <View key={item.id} style={styles.prizeSlide}>
                  <View style={styles.prizeImgWrap}>
                    <Image source={item.img} style={styles.prizeImg} resizeMode="cover" />
                    
                    <LinearGradient 
                      colors={item.badgeColor as any} 
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={styles.activeBadge}
                    >
                      <Text style={styles.activeBadgeText}>{item.badge}</Text>
                    </LinearGradient>

                    <LinearGradient 
                      colors={['transparent', 'rgba(0,0,0,0.85)']} 
                      style={styles.prizeOverlay}
                    >
                      <Text style={styles.prizeTag}>{item.tag}</Text>
                      <Text style={styles.prizeName}>{item.title}</Text>
                      <Text style={styles.prizeValue}>{item.value}</Text>
                    </LinearGradient>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.carouselDots}>
              {CAROUSEL_DATA.map((_, i) => (
                <View 
                  key={i} 
                  style={[styles.cDot, activeSlide === i ? styles.cDotActive : null]} 
                />
              ))}
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaWrap}>
            <TouchableOpacity style={{width: '100%'}}>
              <LinearGradient 
                colors={['#059669', '#10B981']} 
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.btnCta}
              >
                <Text style={styles.btnCtaText}>ENTER NOW — A$2.99</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.finePrint}>A$2.99 per entry · Max 10 entries per participant · Skill-based</Text>
          </View>

          {/* How It Works */}
          <View style={styles.section}>
            <Text style={styles.sectionHead}>⚙️  How it Works</Text>
            <View style={styles.hiwCard}>
              {[
                { n: '1', t: 'Register & Pay', d: 'Create your account, confirm eligibility, and purchase entries.' },
                { n: '2', t: 'Complete the Qualification Quiz', d: 'Pass our timed, skill-based knowledge challenge. 100% correct answers required.' },
                { n: '3', t: 'Submit Your 25-Word Entry', d: 'Respond to the creative prompt in exactly 25 words.' },
                { n: '4', t: 'Independent Judging', d: '3 independent judges verify the AI shortlist and confirm the final winner.' }
              ].map((item, index) => (
                <View key={item.n} style={[styles.hiwItem, index === 3 ? { borderBottomWidth: 0 } : null]}>
                  <LinearGradient colors={['#06B6D4', '#0891B2']} style={styles.hiwNum}>
                    <Text style={styles.hiwNumText}>{item.n}</Text>
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.hiwTitle}>{item.t}</Text>
                    <Text style={styles.hiwDesc}>{item.d}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* AI Section */}
          <View style={styles.aiSection}>
            <Text style={styles.aiTitle}>AI-Assisted.{'\n'}Independently Verified.</Text>
            <View style={styles.featureCards}>
               {[
                 { i: '⚙️', l: 'Deterministic', d: 'Fixed rubric — no random outputs' },
                 { i: '🛡️', l: 'Trust', d: 'Immutable audit trail per entry' },
                 { i: '🔒', l: 'Sealed', d: 'Submissions checksummed on submit' },
                 { i: '👩‍⚖️', l: 'Verified', d: '3 human judges confirm all winners' }
               ].map((f, idx) => (
                 <View key={idx} style={styles.fCard}>
                   <Text style={styles.fIcon}>{f.i}</Text>
                   <Text style={styles.fLabel}>{f.l}</Text>
                   <Text style={styles.fDesc}>{f.d}</Text>
                 </View>
               ))}
            </View>
          </View>

          {/* Countdown */}
          <View style={styles.cdownCard}>
            <Text style={styles.cdownLabel}>Competition closes in:</Text>
            <View style={styles.cdownRow}>
              {[
                { v: timeLeft.d, l: 'Days' },
                { v: timeLeft.h, l: 'Hrs' },
                { v: timeLeft.m, l: 'Min' },
                { v: timeLeft.s, l: 'Sec' }
              ].map((cd, idx) => (
                <View key={idx} style={styles.cdownBox}>
                  <Text style={styles.cdownN}>{String(cd.v).padStart(2, '0')}</Text>
                  <Text style={styles.cdownL}>{cd.l}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.legalRow}>
            <Text style={styles.legalLink}>T&Cs</Text>
            <Text style={styles.legalLink}>Competition Rules</Text>
            <Text style={styles.legalLink}>FAQ</Text>
            <Text style={styles.legalLink}>Privacy</Text>
          </View>

          <Text style={styles.footerText}>Pure skill. One prize. One winner.</Text>

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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  logoText: {
    color: '#fff',
    fontWeight: '900',
    fontStyle: 'italic',
    fontSize: 18,
  },
  btnSignin: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  btnSigninText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  badgeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 6,
    position: 'relative',
  },
  badgeCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 25,
    elevation: 8,
  },
  badgeBigText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#022C22',
    lineHeight: 32,
    fontStyle: 'italic',
  },
  flameEmojiLeft: {
    fontSize: 34,
    position: 'absolute',
    left: (width / 2) - 86,
    top: 10,
    zIndex: 1,
  },
  flameEmojiRight: {
    fontSize: 34,
    position: 'absolute',
    right: (width / 2) - 86,
    top: 10,
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  heroSub: {
    textAlign: 'center',
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 20,
  },
  carouselOuter: {
    marginBottom: 16,
  },
  prizeSlide: {
    width: width,
    paddingHorizontal: 16,
  },
  prizeImgWrap: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  prizeImg: {
    width: '100%',
    height: '100%',
  },
  prizeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingBottom: 12,
    paddingHorizontal: 14,
  },
  prizeTag: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  prizeName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 1,
  },
  prizeValue: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '700',
  },
  activeBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  carouselDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  cDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  cDotActive: {
    width: 20,
    backgroundColor: '#10B981',
  },
  ctaWrap: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  btnCta: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
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
  finePrint: {
    textAlign: 'center',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHead: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 12,
    color: '#fff',
  },
  hiwCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  hiwItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  hiwNum: {
    width: 26,
    height: 26,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiwNumText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  hiwTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  hiwDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 18,
  },
  aiSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    alignItems: 'center',
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  featureCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  fCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  fIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  fLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 2,
  },
  fDesc: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 14,
  },
  cdownCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  cdownLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  },
  cdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  cdownBox: {
    flex: 1,
    backgroundColor: 'rgba(6,182,212,0.1)',
    borderColor: 'rgba(6,182,212,0.2)',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  cdownN: {
    fontSize: 20,
    fontWeight: '900',
    color: '#A5F3FC',
  },
  cdownL: {
    fontSize: 9,
    color: 'rgba(165,243,252,0.6)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  legalLink: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textDecorationLine: 'underline',
  },
  footerText: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  }
});
