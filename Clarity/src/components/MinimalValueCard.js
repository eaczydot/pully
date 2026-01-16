import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const MinimalValueCard = ({
  value,
  label,
  subtitle,
  variant = 'default',
  size = 'large',
  style,
}) => {
  const getGradientColors = () => {
    switch (variant) {
      case 'teal':
        return [theme.colors.teal, '#00B794'];
      case 'purple':
        return [theme.colors.purple, '#574BCE'];
      case 'success':
        return [theme.colors.success, '#2EAD4A'];
      case 'coral':
        return [theme.colors.coral, '#FF5252'];
      default:
        return [theme.colors.surfaceSecondary, theme.colors.surfaceTertiary];
    }
  };

  const renderContent = () => (
    <View style={styles.content}>
      <Text style={[
        styles.label,
        size === 'small' && styles.smallLabel
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.value,
        size === 'small' && styles.smallValue
      ]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[
          styles.subtitle,
          size === 'small' && styles.smallSubtitle
        ]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  if (variant === 'default') {
    return (
      <View style={[styles.container, styles.defaultCard, style]}>
        {renderContent()}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradientCard}
      >
        {renderContent()}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  defaultCard: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.xl,
  },
  gradientCard: {
    padding: theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  value: {
    ...theme.typography.display,
    color: theme.colors.text,
    fontWeight: '200',
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    opacity: 0.9,
    textAlign: 'center',
  },
  smallLabel: {
    fontSize: 13,
  },
  smallValue: {
    fontSize: 32,
    fontWeight: '300',
  },
  smallSubtitle: {
    fontSize: 11,
  },
});

export default MinimalValueCard;