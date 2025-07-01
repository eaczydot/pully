import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const CircularActionCard = ({
  icon,
  label,
  onPress,
  color = theme.colors.teal,
  size = 'large',
  disabled = false,
  style,
}) => {
  const handlePress = () => {
    if (!disabled && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const sizes = {
    small: { diameter: 56, iconSize: 20 },
    medium: { diameter: 72, iconSize: 24 },
    large: { diameter:88, iconSize: 28 },
  };

  const { diameter, iconSize } = sizes[size];

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={[
        styles.iconContainer,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: disabled ? theme.colors.surfaceSecondary : color,
        }
      ]}>
        <Ionicons 
          name={icon} 
          size={iconSize} 
          color={disabled ? theme.colors.textSecondary : theme.colors.text} 
        />
      </View>
      <Text style={[
        styles.label,
        disabled && styles.disabledLabel
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 88,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  label: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  disabledLabel: {
    color: theme.colors.textSecondary,
  },
});

export default CircularActionCard;