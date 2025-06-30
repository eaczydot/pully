import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Keypad from '../components/Keypad';

const TipCalculatorScreen = ({ tipData, setTipData, onNext }) => {
  const [displayValue, setDisplayValue] = useState(tipData.totalTips.toString());

  const handleNumberPress = (number) => {
    if (displayValue === '0') {
      setDisplayValue(number);
    } else {
      setDisplayValue(displayValue + number);
    }
  };

  const handleDecimalPress = () => {
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleDeletePress = () => {
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  const handleSave = () => {
    const amount = parseFloat(displayValue) || 0;
    setTipData(prev => ({
      ...prev,
      totalTips: amount
    }));
    onNext();
  };

  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return `$${num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  return (
    <View style={styles.container}>
      {/* Amount Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.availableText}>Total Tips</Text>
        <Text style={styles.amountText}>
          {formatCurrency(displayValue)}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>📝</Text>
          <Text style={styles.actionText}>Note</Text>
        </TouchableOpacity>
      </View>

      {/* Category Section */}
      <View style={styles.categoryContainer}>
        <View style={styles.categoryItem}>
          <View style={styles.categoryIcon}>
            <Text style={styles.categoryEmoji}>🍸</Text>
          </View>
          <Text style={styles.categoryText}>Bartender Tips</Text>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.saveContainer}>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Keypad */}
      <Keypad
        onNumberPress={handleNumberPress}
        onDecimalPress={handleDecimalPress}
        onDeletePress={handleDeletePress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  availableText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  amountText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#000',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  actionText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E7',
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryEmoji: {
    fontSize: 20,
  },
  categoryText: {
    fontSize: 17,
    color: '#000',
    flex: 1,
  },
  saveContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default TipCalculatorScreen;