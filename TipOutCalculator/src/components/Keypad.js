import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Haptics } from 'react-native';

const { width } = Dimensions.get('window');

const Keypad = ({ onNumberPress, onDecimalPress, onDeletePress, showDecimal = true }) => {
  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [showDecimal ? '.' : '', '0', '⌫']
  ];

  const handlePress = (value) => {
    // Add haptic feedback for better mobile UX
    if (Haptics?.impactAsync) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (value === '⌫') {
      onDeletePress();
    } else if (value === '.') {
      onDecimalPress();
    } else if (value !== '') {
      onNumberPress(value);
    }
  };

  return (
    <View style={styles.container}>
      {buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((button, buttonIndex) => (
            <TouchableOpacity
              key={buttonIndex}
              style={[
                styles.button,
                button === '' && styles.invisibleButton,
                button === '⌫' && styles.deleteButton
              ]}
              onPress={() => handlePress(button)}
              disabled={button === ''}
              activeOpacity={0.1}
            >
              <Text style={[
                styles.buttonText,
                button === '⌫' && styles.deleteButtonText
              ]}>
                {button}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    width: (width - 72) / 3,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginHorizontal: 6,
  },
  invisibleButton: {
    opacity: 0,
    backgroundColor: 'transparent',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#000000',
  },
  deleteButtonText: {
    fontSize: 22,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default Keypad;