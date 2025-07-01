import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, createCardStyle } from '../theme';

const ModernCard = ({
  children,
  onPress,
  variant = 'default',
  elevation = 'md',
  style,
  gradient = false,
  gradientColors,
  ...props
}) => {
  const getGradientColors = () => {
    if (gradientColors) return gradientColors;
    
    switch (variant) {
      case 'teal':
        return [theme.colors.teal, '#00B794'];
      case 'purple':
        return [theme.colors.purple, '#574BCE'];
      case 'success':
        return [theme.colors.success, '#2EAD4A'];
      case 'coral':
        return [theme.colors.coral, '#FF5252'];
      case 'primary':
        return [theme.colors.primary, '#0056CC'];
      default:
        return [theme.colors.card, theme.colors.cardElevated];
    }
  };

  if (gradient) {
    const CardComponent = onPress ? TouchableOpacity : View;
    
    return (
      <CardComponent
        style={[styles.container, style]}
        onPress={onPress}
        activeOpacity={onPress ? 0.8 : 1}
        {...props}
      >
        <LinearGradient
          colors={getGradientColors()}
          style={[
            createCardStyle(elevation),
            styles.gradientCard
          ]}
        >
          {children}
        </LinearGradient>
      </CardComponent>
    );
  }

  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[
        createCardStyle(elevation),
        style
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  gradientCard: {
    backgroundColor: 'transparent',
  },
});

export default ModernCard;