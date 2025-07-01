import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { theme, createButtonStyle } from '../theme';

const ModernButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress && onPress();
    }
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [theme.colors.primary, '#0056CC'];
      case 'teal':
        return [theme.colors.teal, '#00B794'];
      case 'purple':
        return [theme.colors.purple, '#574BCE'];
      case 'success':
        return [theme.colors.success, '#2EAD4A'];
      case 'coral':
        return [theme.colors.coral, '#FF5252'];
      default:
        return [theme.colors.surfaceSecondary, theme.colors.surfaceSecondary];
    }
  };

  const renderContent = () => (
    <>
      {icon && iconPosition === 'left' && (
        <Ionicons 
          name={icon} 
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} 
          color={disabled ? theme.colors.textSecondary : theme.colors.text}
          style={styles.iconLeft}
        />
      )}
      
      <Text 
        style={[
          styles.buttonText,
          styles[`${size}Text`],
          disabled && styles.disabledText,
          textStyle
        ]}
      >
        {title}
      </Text>
      
      {icon && iconPosition === 'right' && (
        <Ionicons 
          name={icon} 
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} 
          color={disabled ? theme.colors.textSecondary : theme.colors.text}
          style={styles.iconRight}
        />
      )}
    </>
  );

  if (variant === 'secondary' || disabled) {
    return (
      <TouchableOpacity
        style={[
          createButtonStyle(disabled ? 'secondary' : variant, size),
          disabled && styles.disabledButton,
          style
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.7}
        {...props}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.gradientContainer, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={[
          createButtonStyle(variant, size),
          styles.gradientButton
        ]}
      >
        {renderContent()}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: theme.borderRadius.pill,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  gradientButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  iconLeft: {
    marginRight: theme.spacing.sm,
  },
  iconRight: {
    marginLeft: theme.spacing.sm,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.textSecondary,
  },
});

export default ModernButton;