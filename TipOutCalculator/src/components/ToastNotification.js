import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const ToastNotification = ({ 
  visible, 
  onHide,
  duration = 3000 
}) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const progressWidth = useRef(new Animated.Value(width - 80)).current;

  useEffect(() => {
    if (visible) {
      // Light haptic for info notification
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Entrance animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Progress bar animation
      Animated.timing(progressWidth, {
        toValue: 0,
        duration: duration,
        useNativeDriver: false,
      }).start();

      // Auto hide
      const hideTimeout = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(hideTimeout);
    } else {
      // Reset values when not visible
      translateY.setValue(-100);
      opacity.setValue(0);
      scale.setValue(0.8);
      progressWidth.setValue(width - 80);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY },
            { scale },
          ],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name="information-circle" 
            size={24} 
            color={theme.colors.info} 
          />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.message}>Check recent earnings</Text>
        </View>
      </View>
      
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressWidth,
          },
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
    zIndex: 1000,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: theme.typography.body.fontSize,
    fontWeight: theme.typography.body.fontWeight,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  progressBar: {
    height: 3,
    backgroundColor: theme.colors.info,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

export default ToastNotification;