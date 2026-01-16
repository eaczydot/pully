import React, { useEffect, useRef, useState } from 'react';
import { View, Animated, TouchableOpacity, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const FloatingActionButton = ({
  children,
  onPress,
  visible = true,
  style,
  colors = [theme.colors.teal, theme.colors.tealDark],
  size = 56,
  delay = 0,
  ...props
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;
  const pressScaleValue = useRef(new Animated.Value(1)).current;
  const rippleValue = useRef(new Animated.Value(0)).current;
  const shadowValue = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (visible) {
      // Entrance animation with spring physics
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 800,
          delay: delay + 200,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(shadowValue, {
          toValue: 1,
          duration: 400,
          delay: delay + 100,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(shadowValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [visible, scaleValue, rotateValue, shadowValue, delay]);

  const handlePressIn = () => {
    setIsPressed(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.parallel([
      Animated.spring(pressScaleValue, {
        toValue: 0.92,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(rippleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
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
    ]).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Success haptic feedback
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 100);
    
    if (onPress) {
      onPress();
    }
  };

  const animatedStyle = {
    transform: [
      { scale: Animated.multiply(scaleValue, pressScaleValue) },
      {
        rotate: rotateValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  const dynamicShadowStyle = {
    shadowOpacity: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.3],
    }),
    elevation: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 12],
    }),
    shadowRadius: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 16],
    }),
  };

  const rippleStyle = {
    opacity: rippleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.2],
    }),
    transform: [
      {
        scale: rippleValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.5],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
      style={[{ alignSelf: 'center' }, style]}
      {...props}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 8 },
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
              borderRadius: size / 2,
              backgroundColor: theme.colors.text,
            },
            rippleStyle,
          ]}
        />
        
        {/* Main Button */}
        <LinearGradient
          colors={colors}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: size / 2,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {children}
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default FloatingActionButton;