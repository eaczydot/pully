import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

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
                button === '' && styles.invisibleButton
              ]}
              onPress={() => handlePress(button)}
              disabled={button === ''}
              activeOpacity={0.2}
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    width: (width - 80) / 3,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  invisibleButton: {
    opacity: 0,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: '300',
    color: '#000',
  },
  deleteButtonText: {
    fontSize: 24,
    fontWeight: '400',
  },
});

export default Keypad;