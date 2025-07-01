import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Keypad from '../components/Keypad';
import PercentageSlider from '../components/PercentageSlider';
import CircularActionCard from '../components/CircularActionCard';
import AnimatedCard from '../components/AnimatedCard';
import FloatingActionButton from '../components/FloatingActionButton';
import AnimatedNumber from '../components/AnimatedNumber';
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  const handleSave = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const amount = parseFloat(displayValue) || 0;
    setTipData(prev => ({
      ...prev,
      totalTips: amount
    }));
    
    // Success feedback
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 100);
    
    onNext();
  };

  const handlePercentageChange = (percentage) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDisplayValue(amount.toString());
    
    // Success feedback for quick selection
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 50);
  };

  const currentAmount = parseFloat(displayValue) || 0;
  const bartenderAmount = currentAmount * (100 - tipData.supportStaffPercentage) / 100;
  const supportAmount = currentAmount * tipData.supportStaffPercentage / 100;

  return (
    <View style={styles.container}>
      {/* Hero Amount Display with Animation */}
      <AnimatedCard
        animationType="scale"
        delay={0}
        style={styles.heroCard}
      >
        <View style={styles.heroSection}>
          <Text style={styles.availableText}>Available</Text>
          <Text style={styles.amountText}>
            {formatCurrency(displayValue)}
          </Text>
          <Text style={styles.subtitleText}>Tonight's Total Tips</Text>
          
          {/* Quick Amount Pills with Staggered Animation */}
          <View style={styles.quickAmountsContainer}>
            {quickAmounts.map((amount, index) => (
              <AnimatedCard
                key={amount}
                animationType="scale"
                delay={200 + (index * 100)}
                onPress={() => setQuickAmount(amount)}
                style={styles.quickAmountCard}
              >
                <Text style={styles.quickAmountText}>${amount}</Text>
              </AnimatedCard>
            ))}
          </View>
        </View>
      </AnimatedCard>

      {/* Circular Action Cards with Staggered Animation */}
      <View style={styles.actionsContainer}>
        <CircularActionCard
          icon="document-text-outline"
          label="Notes"
          color={theme.colors.teal}
          size="medium"
          delay={600}
          animationType="bounce"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
        <CircularActionCard
          icon="time-outline"
          label="History"
          color={theme.colors.purple}
          size="medium"
          delay={700}
          animationType="bounce"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
        <CircularActionCard
          icon="settings-outline"
          label="Settings"
          color={theme.colors.coral}
          size="medium"
          delay={800}
          animationType="bounce"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
        <CircularActionCard
          icon="help-circle-outline"
          label="Help"
          color={theme.colors.mint}
          size="medium"
          delay={900}
          animationType="bounce"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
      </View>

      {/* Support Staff Percentage with Animation */}
      <AnimatedCard
        animationType="slideUp"
        delay={1000}
        style={styles.sliderCard}
      >
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
      </AnimatedCard>

      {/* Split Preview with Animation and Animated Numbers */}
      <View style={styles.previewContainer}>
        <AnimatedCard
          animationType="slideUp"
          delay={1200}
          style={styles.splitCard}
        >
          <LinearGradient
            colors={[theme.colors.teal, theme.colors.tealDark]}
            style={styles.splitGradient}
          >
            <Text style={styles.splitEmoji}>🍸</Text>
            <Text style={styles.splitLabel}>Bartenders</Text>
            <AnimatedNumber
              value={bartenderAmount}
              style={styles.splitAmount}
              duration={600}
              delay={1400}
            />
            <Text style={styles.splitPercentage}>{100 - tipData.supportStaffPercentage}%</Text>
          </LinearGradient>
        </AnimatedCard>
        
        <AnimatedCard
          animationType="slideUp"
          delay={1300}
          style={styles.splitCard}
        >
          <LinearGradient
            colors={[theme.colors.purple, theme.colors.purpleDark]}
            style={styles.splitGradient}
          >
            <Text style={styles.splitEmoji}>🛠</Text>
            <Text style={styles.splitLabel}>Support</Text>
            <AnimatedNumber
              value={supportAmount}
              style={styles.splitAmount}
              duration={600}
              delay={1500}
            />
            <Text style={styles.splitPercentage}>{tipData.supportStaffPercentage}%</Text>
          </LinearGradient>
        </AnimatedCard>
      </View>

      {/* Modern Keypad */}
      <Keypad
        onNumberPress={handleNumberPress}
        onDecimalPress={handleDecimalPress}
        onDeletePress={handleDeletePress}
      />

      {/* Enhanced Floating Continue Button */}
      <FloatingActionButton
        onPress={handleSave}
        visible={parseFloat(displayValue) > 0}
        delay={1600}
        style={styles.floatingActionContainer}
        colors={[theme.colors.teal, theme.colors.tealDark]}
      >
        <View style={styles.continueContent}>
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color={theme.colors.text} />
        </View>
      </FloatingActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  heroCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
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
  quickAmountCard: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.pill,
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
  sliderCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  sliderSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxl,
  },
  previewContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  splitCard: {
    flex: 1,
    overflow: 'hidden',
  },
  splitGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  splitEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  splitLabel: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    opacity: 0.9,
    marginBottom: theme.spacing.md,
    fontWeight: '500',
  },
  splitAmount: {
    ...theme.typography.heading,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    fontSize: 22,
  },
  splitPercentage: {
    ...theme.typography.micro,
    color: theme.colors.text,
    opacity: 0.8,
    fontWeight: '600',
  },
  floatingActionContainer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.lg,
    right: theme.spacing.lg,
    alignSelf: 'stretch',
  },
  continueContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  continueButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
});

export default TipCalculatorScreen;