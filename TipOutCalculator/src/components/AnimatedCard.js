import React, { useEffect, useRef } from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const AnimatedCard = ({
  children,
  onPress,
  delay = 0,
  style,
  animationType = 'slideUp',
  disabled = false,
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const shadowValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [];
    
    if (animationType === 'slideUp') {
      animatedValue.setValue(50);
      animations.push(
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 600,
          delay,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'fadeIn') {
      animatedValue.setValue(0);
      animations.push(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 500,
          delay,
          useNativeDriver: true,
        })
      );
    } else if (animationType === 'scale') {
      animatedValue.setValue(0.8);
      animations.push(
        Animated.spring(animatedValue, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay,
          useNativeDriver: true,
        })
      );
    }

    // Shadow animation
    Animated.timing(shadowValue, {
      toValue: 1,
      duration: 400,
      delay: delay + 200,
      useNativeDriver: false,
    }).start();

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  }, [animatedValue, shadowValue, delay, animationType]);

  const handlePressIn = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.spring(scaleValue, {
        toValue: 0.96,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePress = () => {
    if (!disabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress();
    }
  };

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'slideUp':
        return {
          transform: [
            {
              translateY: animatedValue,
            },
            {
              scale: scaleValue,
            },
          ],
          opacity: animatedValue.interpolate({
            inputRange: [0, 50],
            outputRange: [1, 0],
          }),
        };
      case 'fadeIn':
        return {
          opacity: animatedValue,
          transform: [{ scale: scaleValue }],
        };
      case 'scale':
        return {
          transform: [
            { scale: Animated.multiply(animatedValue, scaleValue) },
          ],
        };
      default:
        return {
          transform: [{ scale: scaleValue }],
        };
    }
  };

  const dynamicShadowStyle = {
    shadowOpacity: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.15],
    }),
    elevation: shadowValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 8],
    }),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={1}
        {...props}
      >
        <Animated.View
          style={[
            {
              backgroundColor: theme.colors.card,
              borderRadius: theme.borderRadius.xl,
              shadowColor: theme.colors.shadow,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 8,
            },
            dynamicShadowStyle,
            getAnimatedStyle(),
            style,
          ]}
        >
          {children}
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Animated.View
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.xl,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 8,
        },
        dynamicShadowStyle,
        getAnimatedStyle(),
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedCard;