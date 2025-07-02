import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const KeypadButton = ({ button, onPress, isSpecial = false }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const rippleScale = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    
    // Immediate visual feedback
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 0.92,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(rippleScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback based on button type
    if (button === '⌫') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (button === '.') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (!isNaN(button)) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
    
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rippleScale.setValue(0);
    });
  };

  const handlePress = () => {
    // Additional haptic for number confirmation
    if (!isNaN(button)) {
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 50);
    }
    
    onPress(button);
  };

  const isEmpty = button === '';
  const isDelete = button === '⌫';
  const isNumber = !isNaN(button) || button === '.';

  if (isEmpty) {
    return <View style={styles.button} />;
  }

  return (
    <TouchableOpacity
      style={styles.button}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.buttonContent,
          isDelete && styles.deleteButtonContent,
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {/* Ripple Effect */}
        <Animated.View
          style={[
            styles.ripple,
            {
              opacity: rippleOpacity,
              transform: [{ scale: rippleScale }],
            },
          ]}
        />
        
        {/* Button Content */}
        {isDelete ? (
          <Animated.View
            style={[
              styles.deleteIcon,
              {
                transform: [{ scale: isPressed ? 1.1 : 1 }],
              },
            ]}
          >
            <Ionicons 
              name="backspace-outline" 
              size={24} 
              color={theme.colors.text} 
            />
          </Animated.View>
        ) : (
          <Animated.Text 
            style={[
              styles.buttonText,
              isPressed && styles.pressedText,
            ]}
          >
            {button}
          </Animated.Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const Keypad = ({ onNumberPress, onDecimalPress, onDeletePress, showDecimal = true }) => {
  const [pressedButton, setPressedButton] = useState(null);
  
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [showDecimal ? '.' : '', '0', '⌫']
  ];

  const keypadScale = useRef(new Animated.Value(0)).current;
  const keypadOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // Entrance animation for entire keypad
    Animated.parallel([
      Animated.spring(keypadScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(keypadOpacity, {
        toValue: 1,
        duration: 400,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = (value) => {
    setPressedButton(value);
    
    // Reset pressed state after animation
    setTimeout(() => {
      setPressedButton(null);
    }, 150);

    if (value === '⌫') {
      onDeletePress();
    } else if (value === '.') {
      onDecimalPress();
    } else if (value !== '') {
      onNumberPress(value);
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: keypadOpacity,
          transform: [{ scale: keypadScale }],
        },
      ]}
    >
      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((button, buttonIndex) => (
            <KeypadButton
              key={`${rowIndex}-${buttonIndex}`}
              button={button}
              onPress={handlePress}
              isSpecial={button === '⌫' || button === '.'}
            />
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  button: {
    width: (width - (theme.spacing.lg * 2) - (theme.spacing.lg * 2)) / 3,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
    overflow: 'hidden',
  },
  deleteButtonContent: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  ripple: {
    position: 'absolute',
    width: '120%',
    height: '120%',
    borderRadius: 50,
    backgroundColor: theme.colors.text,
  },
  buttonText: {
    ...theme.typography.amountMedium,
    color: theme.colors.text,
    fontWeight: '200',
    fontSize: 32,
    zIndex: 1,
  },
  pressedText: {
    color: theme.colors.teal,
  },
  deleteIcon: {
    zIndex: 1,
  },
});

export default Keypad;