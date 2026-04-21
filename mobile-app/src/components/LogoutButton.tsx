import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, CommonActions } from '@react-navigation/native';

export default function LogoutButton() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['auth_token', 'user_id']);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Landing' }],
        })
      );
    } catch (e) {
      console.error('Logout error', e);
      // Fallback
      navigation.navigate('Landing' as never);
    }
  };

  return (
    <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginLeft: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '700',
  },
});
