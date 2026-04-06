import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, 
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
  StatusBar, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function VerifyOtpScreen({ navigation, route }: any) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const userEmail = route?.params?.email || 'j***@example.com';

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if value is filled
    if (value.length === 1 && index < 5) {
      // In a real app, you'd use refs here to focus the next input
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
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <View style={styles.backCircle}>
                <Text style={styles.backArrow}>←</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.logoText}>Big Skill Challenge™</Text>
            <View style={{ width: 44 }} /> 
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Email Icon */}
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.iconCircle}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              >
                <Text style={styles.emailIcon}>✉️</Text>
              </LinearGradient>
              <View style={styles.iconGlow} />
            </View>

            <Text style={styles.heroTitle}>Verify Your Email</Text>
            <View style={styles.subTextContainer}>
              <Text style={styles.heroSub}>A verification code has been sent to your email address.</Text>
              <Text style={styles.emailDisplay}>{userEmail}</Text>
            </View>

            {/* OTP Input Group */}
            <Text style={styles.inputLabel}>Enter 6-digit verification code</Text>
            <View style={styles.otpContainer}>
              {otp.map((digit, idx) => (
                <View key={idx} style={styles.otpBox}>
                  <TextInput
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, idx)}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                  />
                </View>
              ))}
            </View>

            {/* CTA Button */}
            <TouchableOpacity 
              style={styles.ctaWrap} 
              onPress={() => navigation.navigate('Home')}
            >
              <LinearGradient 
                colors={['#059669', '#10B981']} 
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.btnCta}
              >
                <Text style={styles.btnCtaText}>Verify →</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Did not receive the code?</Text>
              <TouchableOpacity>
                <Text style={styles.resendLink}>Resend Code</Text>
              </TouchableOpacity>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoIcon}>📩</Text>
                <Text style={styles.infoText}>
                  <Text style={{fontWeight: '700', color: '#10B981'}}>Check your spam folder</Text> if you don't see the email within 2 minutes. The code is valid for 10 minutes.
                </Text>
              </View>
            </View>

          </ScrollView>

          {/* Footer */}
          <View style={styles.footerWrap}>
            <Text style={styles.footerText}>Pure skill. One prize. One winner.</Text>
          </View>

        </KeyboardAvoidingView>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
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
  backArrow: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoText: {
    color: '#fff',
    fontWeight: '900',
    fontStyle: 'italic',
    fontSize: 16,
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
    paddingBottom: 40,
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 32,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    zIndex: 1,
  },
  emailIcon: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  subTextContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  emailDisplay: {
    fontSize: 15,
    color: '#06B6D4',
    fontWeight: '700',
  },
  inputLabel: {
    alignSelf: 'flex-start',
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  otpBox: {
    width: (width - 48 - 50) / 6,
    height: 54,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInput: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    width: '100%',
  },
  ctaWrap: {
    width: '100%',
    marginBottom: 24,
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
    letterSpacing: 0.5,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginBottom: 8,
  },
  resendLink: {
    color: '#06B6D4',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  infoBox: {
    width: '100%',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    lineHeight: 18,
  },
  footerWrap: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  }
});
