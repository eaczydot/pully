import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Keypad from '../components/Keypad';
import PercentageSlider from '../components/PercentageSlider';
import CircularActionCard from '../components/CircularActionCard';
import { theme, createButtonStyle, createCardStyle } from '../theme';

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

  const handlePercentageChange = (percentage) => {
    setTipData(prev => ({
      ...prev,
      supportStaffPercentage: percentage
    }));
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
      {/* Hero Amount Display */}
      <View style={styles.heroSection}>
        <Text style={styles.availableText}>Available</Text>
        <Text style={styles.amountText}>
          {formatCurrency(displayValue)}
        </Text>
        <Text style={styles.subtitleText}>Tonight's Total Tips</Text>
        
        {/* Quick Amount Pills */}
        <View style={styles.quickAmountsContainer}>
          {quickAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={styles.quickAmountPill}
              onPress={() => setQuickAmount(amount)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickAmountText}>${amount}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Circular Action Cards */}
      <View style={styles.actionsContainer}>
        <CircularActionCard
          icon="document-text-outline"
          label="Notes"
          color={theme.colors.teal}
          size="medium"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <CircularActionCard
          icon="time-outline"
          label="History"
          color={theme.colors.purple}
          size="medium"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <CircularActionCard
          icon="settings-outline"
          label="Settings"
          color={theme.colors.coral}
          size="medium"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
        <CircularActionCard
          icon="help-circle-outline"
          label="Help"
          color={theme.colors.mint}
          size="medium"
          onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        />
      </View>

      {/* Support Staff Percentage */}
      <View style={styles.sliderSection}>
        <PercentageSlider
          value={tipData.supportStaffPercentage}
          onValueChange={handlePercentageChange}
          min={0}
          max={50}
          step={5}
          title="Support Staff Share"
        />
      </View>

      {/* Preview Split */}
      <View style={styles.previewContainer}>
        <View style={styles.splitPreview}>
          <View style={styles.splitCard}>
            <LinearGradient
              colors={[theme.colors.teal, theme.colors.tealDark]}
              style={styles.splitGradient}
            >
              <Text style={styles.splitEmoji}>🍸</Text>
              <Text style={styles.splitLabel}>Bartenders</Text>
              <Text style={styles.splitAmount}>
                {formatCurrency((parseFloat(displayValue) || 0) * (100 - tipData.supportStaffPercentage) / 100)}
              </Text>
              <Text style={styles.splitPercentage}>{100 - tipData.supportStaffPercentage}%</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.splitCard}>
            <LinearGradient
              colors={[theme.colors.purple, theme.colors.purpleDark]}
              style={styles.splitGradient}
            >
              <Text style={styles.splitEmoji}>🛠</Text>
              <Text style={styles.splitLabel}>Support</Text>
              <Text style={styles.splitAmount}>
                {formatCurrency((parseFloat(displayValue) || 0) * tipData.supportStaffPercentage / 100)}
              </Text>
              <Text style={styles.splitPercentage}>{tipData.supportStaffPercentage}%</Text>
            </LinearGradient>
          </View>
        </View>
      </View>

      {/* Modern Keypad */}
      <Keypad
        onNumberPress={handleNumberPress}
        onDecimalPress={handleDecimalPress}
        onDeletePress={handleDeletePress}
      />

      {/* Continue Floating Button */}
      {parseFloat(displayValue) > 0 && (
        <View style={styles.floatingActionContainer}>
          <TouchableOpacity 
            style={styles.continueFloatingButton}
            onPress={handleSave}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[theme.colors.teal, theme.colors.tealDark]}
              style={styles.continueGradient}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.text} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxxxl,
  },
  availableText: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  amountText: {
    ...theme.typography.hero,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitleText: {
    ...theme.typography.footnote,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.xl,
  },
  quickAmountsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  quickAmountPill: {
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.pill,
    ...theme.shadows.soft,
  },
  quickAmountText: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxxl,
  },
  sliderSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  previewContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  splitPreview: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  splitCard: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  splitGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  splitEmoji: {
    fontSize: 28,
    marginBottom: theme.spacing.xs,
  },
  splitLabel: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    opacity: 0.9,
    marginBottom: theme.spacing.sm,
  },
  splitAmount: {
    ...theme.typography.heading,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  splitPercentage: {
    ...theme.typography.micro,
    color: theme.colors.text,
    opacity: 0.8,
    fontWeight: '500',
  },
  floatingActionContainer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
  },
  continueFloatingButton: {
    borderRadius: theme.borderRadius.pill,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  continueButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
});

export default TipCalculatorScreen;