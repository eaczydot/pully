import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Keypad from '../components/Keypad';
import { theme, createButtonStyle, createCardStyle, createCircularButtonStyle } from '../theme';

const { width } = Dimensions.get('window');

const TipCalculatorScreen = ({ tipData, setTipData, onNext }) => {
  const [displayValue, setDisplayValue] = useState(tipData.totalTips.toString());

  const handleNumberPress = (number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (displayValue === '0') {
      setDisplayValue(number);
    } else {
      setDisplayValue(displayValue + number);
    }
  };

  const handleDecimalPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const handleDeletePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  const quickAmounts = [100, 250, 500, 1000];

  const setQuickAmount = (amount) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDisplayValue(amount.toString());
  };

  return (
    <View style={styles.container}>
      {/* Main Amount Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.availableText}>Total Tips for Tonight</Text>
        <Text style={styles.amountText}>
          {formatCurrency(displayValue)}
        </Text>
        
        {/* Quick Amount Buttons */}
        <View style={styles.quickAmountsContainer}>
          {quickAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.quickAmountButton}
              onPress={() => setQuickAmount(amount)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickAmountText}>${amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Cards */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="document-text-outline" size={24} color={theme.colors.teal} />
            </View>
            <Text style={styles.actionText}>Notes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="calendar-outline" size={24} color={theme.colors.purple} />
            </View>
            <Text style={styles.actionText}>History</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="share-outline" size={24} color={theme.colors.coral} />
            </View>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Preview */}
      <View style={styles.categoryPreview}>
        <View style={styles.categoryCard}>
          <View style={styles.categoryIconContainer}>
            <Text style={styles.categoryEmoji}>🍸</Text>
          </View>
          <View style={styles.categoryInfo}>
            <Text style={styles.categoryTitle}>Bartender Pool</Text>
            <Text style={styles.categorySubtitle}>80% of total tips</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.continueContainer}>
        <TouchableOpacity 
          style={[styles.continueButton, parseFloat(displayValue) > 0 && styles.continueButtonActive]}
          onPress={handleSave}
          disabled={parseFloat(displayValue) <= 0}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={parseFloat(displayValue) > 0 
              ? [theme.colors.teal, '#00B794'] 
              : [theme.colors.surfaceSecondary, theme.colors.surfaceSecondary]
            }
            style={styles.continueButtonGradient}
          >
            <Text style={[
              styles.continueButtonText,
              parseFloat(displayValue) > 0 && styles.continueButtonTextActive
            ]}>
              Continue to Bartenders
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color={parseFloat(displayValue) > 0 ? theme.colors.text : theme.colors.textSecondary} 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Modern Keypad */}
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
    backgroundColor: theme.colors.background,
  },
  displayContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxxl,
  },
  availableText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  amountText: {
    ...theme.typography.display,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickAmountButton: {
    ...createButtonStyle('secondary', 'sm'),
    minWidth: 60,
  },
  quickAmountText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  actionCard: {
    ...createCardStyle('sm'),
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  actionIconContainer: {
    ...createCircularButtonStyle(48),
    backgroundColor: theme.colors.surfaceTertiary,
    marginBottom: theme.spacing.md,
  },
  actionText: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  categoryPreview: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  categoryCard: {
    ...createCardStyle('sm'),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: 2,
  },
  categorySubtitle: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
  },
  continueContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  continueButton: {
    borderRadius: theme.borderRadius.pill,
    overflow: 'hidden',
  },
  continueButtonGradient: {
    ...createButtonStyle('primary', 'lg'),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  continueButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  continueButtonTextActive: {
    color: theme.colors.text,
  },
  continueButtonActive: {
    ...theme.shadows.md,
  },
});

export default TipCalculatorScreen;