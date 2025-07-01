import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const CircularActionCard = ({
  icon,
  label,
  onPress,
  color = theme.colors.teal,
  size = 'large',
  disabled = false,
  style,
  delay = 0,
  animationType = 'scale',
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const pressScaleValue = useRef(new Animated.Value(1)).current;
  const rippleValue = useRef(new Animated.Value(0)).current;
  const shadowValue = useRef(new Animated.Value(0)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;
  const iconBounce = useRef(new Animated.Value(1)).current;
  const [isPressed, setIsPressed] = useState(false);

  const sizes = {
    small: { diameter: 56, iconSize: 20 },
    medium: { diameter: 72, iconSize: 24 },
    large: { diameter: 88, iconSize: 28 },
  };

  const { diameter, iconSize } = sizes[size];

  useEffect(() => {
    // Entrance animations
    const animations = [];
    
    if (animationType === 'scale') {
      animations.push(
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 80,
          friction: 8,
          delay,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'bounce') {
      animations.push(
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 200,
          friction: 6,
          delay,
          useNativeDriver: true,
        })
      );
    }

    // Shadow animation
    animations.push(
      Animated.timing(shadowValue, {
        toValue: 1,
        duration: 400,
        delay: delay + 100,
        useNativeDriver: false,
      })
    );

    // Label fade in
    animations.push(
      Animated.timing(labelOpacity, {
        toValue: 1,
        duration: 300,
        delay: delay + 300,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  }, [scaleValue, shadowValue, labelOpacity, delay, animationType]);

  const handlePressIn = () => {
    if (!disabled) {
      setIsPressed(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      Animated.parallel([
        Animated.spring(pressScaleValue, {
          toValue: 0.9,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(rippleValue, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(iconBounce, {
            toValue: 0.8,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.spring(iconBounce, {
            toValue: 1.1,
            tension: 300,
            friction: 4,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      setIsPressed(false);
      
      Animated.parallel([
        Animated.spring(pressScaleValue, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(rippleValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(iconBounce, {
          toValue: 1,
          tension: 300,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Success feedback for positive actions
      if (label === 'Share' || label === 'Save') {
        setTimeout(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }, 50);
      }
      
      onPress();
    }
  };

  const animatedStyle = {
    transform: [
      { scale: Animated.multiply(scaleValue, pressScaleValue) },
    ],
  };

  const iconAnimatedStyle = {
    transform: [{ scale: iconBounce }],
  };

  const dynamicShadowStyle = {
    shadowOpacity: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.2],
    }),
    elevation: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    }),
  };

  const rippleStyle = {
    opacity: rippleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.3],
    }),
    transform: [
      {
        scale: rippleValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.4],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.iconContainer,
          {
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
            backgroundColor: disabled ? theme.colors.surfaceSecondary : color,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
          },
          dynamicShadowStyle,
          animatedStyle,
        ]}
      >
        {/* Ripple Effect */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: diameter / 2,
              backgroundColor: theme.colors.text,
            },
            rippleStyle,
          ]}
        />
        
        {/* Icon */}
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons 
            name={icon} 
            size={iconSize} 
            color={disabled ? theme.colors.textSecondary : theme.colors.text} 
          />
        </Animated.View>
      </Animated.View>
      
      <Animated.Text 
        style={[
          styles.label,
          disabled && styles.disabledLabel,
          { opacity: labelOpacity }
        ]}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 88,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  label: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  disabledLabel: {
    color: theme.colors.textSecondary,
  },
});

export default CircularActionCard;