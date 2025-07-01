import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { theme, createCircularButtonStyle } from '../theme';

const { width } = Dimensions.get('window');

const Keypad = ({ onNumberPress, onDecimalPress, onDeletePress, showDecimal = true }) => {
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [showDecimal ? '.' : '', '0', '⌫']
  ];

  const handlePress = (value) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (value === '⌫') {
      onDeletePress();
    } else if (value === '.') {
      onDecimalPress();
    } else if (value !== '') {
      onNumberPress(value);
    }
  };

  const renderButton = (button, rowIndex, buttonIndex) => {
    const isNumber = !isNaN(button) || button === '.';
    const isDelete = button === '⌫';
    const isEmpty = button === '';
    
    return (
      <TouchableOpacity
        key={buttonIndex}
        style={[
          styles.button,
          isEmpty && styles.invisibleButton,
          isDelete && styles.deleteButton,
        ]}
        onPress={() => handlePress(button)}
        disabled={isEmpty}
        activeOpacity={0.3}
      >
        <View style={[
          styles.buttonContent,
          isDelete && styles.deleteButtonContent,
        ]}>
          {isDelete ? (
            <Ionicons 
              name="backspace-outline" 
              size={28} 
              color={theme.colors.textSecondary} 
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
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  deleteButton: {
    // Delete button specific styles
  },
  deleteButtonContent: {
    backgroundColor: theme.colors.surfaceTertiary,
  },
  invisibleButton: {
    opacity: 0,
    pointerEvents: 'none',
  },
  buttonText: {
    ...theme.typography.title,
    color: theme.colors.text,
    fontWeight: '300',
  },
  deleteButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: theme.colors.textSecondary,
  },
});

export default Keypad;