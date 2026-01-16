import React, { useEffect, useRef } from 'react';
import { Text, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';

const AnimatedNumber = ({
  value,
  style,
  formatAsCurrency = true,
  prefix = '$',
  duration = 800,
  delay = 0,
  onAnimationComplete,
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const lastValue = useRef(0);

  useEffect(() => {
    if (value !== lastValue.current) {
      // Light haptic feedback when number changes
      if (lastValue.current !== 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      Animated.timing(animatedValue, {
        toValue: value,
        duration,
        delay,
        useNativeDriver: false, // Can't use native driver for text changes
      }).start(() => {
        lastValue.current = value;
        if (onAnimationComplete) {
          onAnimationComplete(value);
        }
      });
    }
  }, [value, animatedValue, duration, delay, onAnimationComplete]);

  const formatNumber = (num) => {
    if (formatAsCurrency) {
      return `${prefix}${num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Animated.Text style={style} {...props}>
      {animatedValue._value ? formatNumber(animatedValue._value) : formatNumber(0)}
    </Animated.Text>
  );
};

// Enhanced version with listener for real-time updates
const AnimatedNumberRealTime = ({
  value,
  style,
  formatAsCurrency = true,
  prefix = '$',
  duration = 800,
  delay = 0,
  onAnimationComplete,
  ...props
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const displayValue = useRef(0);
  const lastValue = useRef(0);

  useEffect(() => {
    if (value !== lastValue.current) {
      // Light haptic feedback when number changes
      if (lastValue.current !== 0) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const listener = animatedValue.addListener(({ value: animValue }) => {
        displayValue.current = animValue;
      });

      Animated.timing(animatedValue, {
        toValue: value,
        duration,
        delay,
        useNativeDriver: false,
      }).start(() => {
        lastValue.current = value;
        if (onAnimationComplete) {
          onAnimationComplete(value);
        }
        animatedValue.removeListener(listener);
      });

      return () => {
        animatedValue.removeListener(listener);
      };
    }
  }, [value, animatedValue, duration, delay, onAnimationComplete]);

  const formatNumber = (num) => {
    if (formatAsCurrency) {
      return `${prefix}${num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Animated.Text style={style} {...props}>
      {formatNumber(displayValue.current)}
    </Animated.Text>
  );
};

export default AnimatedNumber;
export { AnimatedNumberRealTime };