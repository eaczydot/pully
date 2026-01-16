import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const Keypad = ({ onNumberPress, onDecimalPress, onDeletePress, showDecimal = true }) => {
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [showDecimal ? '.' : '', '0', '⌫']
  ];

  const handlePress = (value) => {
    if (value === '⌫') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onDeletePress();
    } else if (value === '.') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onDecimalPress();
    } else if (value !== '') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onNumberPress(value);
    }
  };

  const renderButton = (button, rowIndex, buttonIndex) => {
    const isNumber = !isNaN(button) || button === '.';
    const isDelete = button === '⌫';
    const isEmpty = button === '';
    const isZero = button === '0';
    
    return (
      <TouchableOpacity
        key={buttonIndex}
        style={[
          styles.button,
          isEmpty && styles.invisibleButton,
          isZero && styles.zeroButton,
        ]}
        onPress={() => handlePress(button)}
        disabled={isEmpty}
        activeOpacity={0.6}
      >
        <View style={[
          styles.buttonContent,
          isDelete && styles.deleteButtonContent,
          isZero && styles.zeroButtonContent,
        ]}>
          {isDelete ? (
            <Ionicons 
              name="backspace-outline" 
              size={24} 
              color={theme.colors.text} 
            />
          ) : (
            <Text style={[
              styles.buttonText,
              isDelete && styles.deleteButtonText
            ]}>
              {button}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((button, buttonIndex) => 
            renderButton(button, rowIndex, buttonIndex)
          )}
        </View>
      ))}
    </View>
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
  zeroButton: {
    // Zero button (middle position) gets special styling
  },
  buttonContent: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  zeroButtonContent: {
    backgroundColor: theme.colors.surfaceTertiary,
  },
  deleteButtonContent: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  invisibleButton: {
    opacity: 0,
    pointerEvents: 'none',
  },
  buttonText: {
    ...theme.typography.amountMedium,
    color: theme.colors.text,
    fontWeight: '200',
    fontSize: 32,
  },
  deleteButtonText: {
    color: theme.colors.text,
  },
});

export default Keypad;