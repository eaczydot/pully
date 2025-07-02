import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const ToastNotification = ({
  visible,
  message,
  type = 'success', // 'success', 'error', 'warning', 'info'
  duration = 3000,
  onHide,
  position = 'top', // 'top', 'bottom'
}) => {
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
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
          tension: 120,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Icon animation
      setTimeout(() => {
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 200,
          friction: 6,
          useNativeDriver: true,
        }).start();

        // Haptic feedback based on type
        switch (type) {
          case 'success':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'error':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case 'warning':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
          default:
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }, 150);

      // Progress bar animation
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start();

      // Auto hide
      const hideTimer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(hideTimer);
    } else {
      hideToast();
    }
  }, [visible, translateY, opacity, scale, iconScale, progressWidth, duration, type]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) onHide();
      progressWidth.setValue(0);
      iconScale.setValue(0);
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          colors: [theme.colors.success, '#2EAD4A'],
          icon: 'checkmark-circle',
          backgroundColor: theme.colors.success,
        };
      case 'error':
        return {
          colors: [theme.colors.error, '#D32F2F'],
          icon: 'close-circle',
          backgroundColor: theme.colors.error,
        };
      case 'warning':
        return {
          colors: [theme.colors.warning, '#F57C00'],
          icon: 'warning',
          backgroundColor: theme.colors.warning,
        };
      case 'info':
        return {
          colors: [theme.colors.primary, theme.colors.primaryDark],
          icon: 'information-circle',
          backgroundColor: theme.colors.primary,
        };
      default:
        return {
          colors: [theme.colors.teal, theme.colors.tealDark],
          icon: 'checkmark-circle',
          backgroundColor: theme.colors.teal,
        };
    }
  };

  const config = getToastConfig();

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        {
          opacity,
          transform: [
            { translateY },
            { scale },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={config.colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: iconScale }],
              },
            ]}
          >
            <Ionicons
              name={config.icon}
              size={24}
              color={theme.colors.text}
            />
          </Animated.View>
          
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    zIndex: 1000,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  topPosition: {
    top: 60,
  },
  bottomPosition: {
    bottom: 100,
  },
  gradient: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.md,
  },
  message: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ToastNotification;