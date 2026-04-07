import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, 
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
  StatusBar, ActivityIndicator, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import apiClient from '../api/client';

export default function LoginScreen({ navigation }: any) {
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [is18Plus, setIs18Plus] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || (isCreateMode && (!firstName || !lastName || !phone))) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!is18Plus || !agreedToTerms) {
      Alert.alert('Error', 'Please confirm you are 18+ and agree to the terms');
      return;
    }

    setIsLoading(true);
    try {
      // Call the register API
      const response = await apiClient.post('/api/v1/Auth/register', { 
        firstName,
        lastName,
        email, 
        phone,
        password 
      });

      // Assuming success if wait succeeds (apiClient throws on non-ok)
      navigation.navigate('VerifyOtp', { email });
    } catch (err: any) {
      Alert.alert('Registration Failed', err.message || 'Check your connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      // Call the login API
      const response = await apiClient.post('/api/v1/Auth/login', { 
        email, 
        password 
      });

      // Navigate to Home on success
      navigation.navigate('Home');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCtaPress = () => {
    if (isCreateMode) {
      handleRegister();
    } else {
      handleLogin();
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
              <Text style={styles.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.logoText}>Big Skill Challenge™</Text>
            <View style={{ width: 60 }} />
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.heroTitle}>{isCreateMode ? 'Create Account' : 'Welcome Back'}</Text>
            <Text style={styles.heroSub}>
              {isCreateMode ? 'Join The Big Skill Challenge™ to enter' : 'Log in to continue your journey'}
            </Text>

            {/* Toggle Switch */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={styles.toggleBtn} 
                onPress={() => setIsCreateMode(true)}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isCreateMode ? (
                  <LinearGradient
                    colors={['#059669', '#10B981']}
                    style={styles.toggleActiveBg}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.toggleTextActive}>Create Account</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.toggleTextInactive}>Create Account</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.toggleBtn} 
                onPress={() => setIsCreateMode(false)}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {!isCreateMode ? (
                  <LinearGradient
                    colors={['#059669', '#10B981']}
                    style={styles.toggleActiveBg}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.toggleTextActive}>Log In</Text>
                  </LinearGradient>
                ) : (
                  <Text style={styles.toggleTextInactive}>Log In</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            {isCreateMode && (
              <View style={styles.rowForm}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="First Name"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={firstName}
                      onChangeText={setFirstName}
                      editable={!isLoading}
                    />
                  </View>
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="Last Name"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      value={lastName}
                      onChangeText={setLastName}
                      editable={!isLoading}
                    />
                  </View>
                </View>
              </View>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!isLoading}
                />
              </View>
            </View>

            {isCreateMode && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.inputLabel}>Phone Number</Text>
                  <View style={styles.inputWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="+1 (555) 000-0000"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                      editable={!isLoading}
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.formGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder={isCreateMode ? "Create a password (min 8 characters)" : "Enter your password"}
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Confirmations (Only show in Create Mode) */}
            {isCreateMode && (
              <View style={styles.confirmationsWrap}>
                <Text style={styles.confirmLabel}>Confirmations required</Text>
                
                <TouchableOpacity 
                  style={styles.checkboxRow} 
                  onPress={() => setIs18Plus(!is18Plus)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <View style={[styles.checkbox, is18Plus && styles.checkboxChecked]}>
                    {is18Plus && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxText}>
                    I confirm I am <Text style={{fontWeight: '700', color: '#fff'}}>18 years or older</Text>
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.checkboxRow} 
                  onPress={() => setAgreedToTerms(!agreedToTerms)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
                    {agreedToTerms && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxText}>
                    I agree to the <Text style={styles.linkText}>Terms and Conditions</Text> and <Text style={styles.linkText}>Competition Rules</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* CTA Button */}
            <TouchableOpacity 
              style={styles.ctaWrap} 
              onPress={handleCtaPress}
              disabled={isLoading}
            >
              <LinearGradient 
                colors={['#059669', '#10B981']} 
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.btnCta}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnCtaText}>
                    {isCreateMode ? 'Create Account →' : 'Log In →'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsCreateMode(!isCreateMode)} style={{marginTop: 16}}>
              <Text style={styles.toggleBottomText}>
                {isCreateMode ? 'Already have an account? Log in here.' : "Don't have an account? Create one."}
              </Text>
            </TouchableOpacity>

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
  logoText: {
    color: '#fff',
    fontWeight: '900',
    fontStyle: 'italic',
    fontSize: 16,
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: 10,
  },
  backBtnText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    padding: 4,
    marginBottom: 32,
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
  },
  toggleBtn: {
    flex: 1,
    height: 40,
  },
  toggleActiveBg: {
    flex: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  toggleTextInactive: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    display: 'flex',
    paddingTop: 10,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
    fontSize: 14,
  },
  rowForm: {
    flexDirection: 'row',
  },
  formGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputWrap: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 15,
  },
  confirmationsWrap: {
    marginTop: 8,
    marginBottom: 24,
  },
  confirmLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkMark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  checkboxText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    lineHeight: 20,
  },
  linkText: {
    color: '#06B6D4',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  ctaWrap: {
    marginTop: 10,
    width: '100%',
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
  toggleBottomText: {
    color: '#06B6D4',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
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
