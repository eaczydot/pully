import React, { useState } from 'react';
import { View, Text, StyleSheet, PanGestureHandler } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const PercentageSlider = ({
  value,
  onValueChange,
  min = 0,
  max = 50,
  step = 5,
  title = "Support Staff Allocation",
  style
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const getPercentage = () => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;
    const sliderWidth = 280; // Approximate slider width
    const percentage = Math.max(0, Math.min(100, (translationX / sliderWidth) * 100));
    const newValue = Math.round((percentage / 100) * (max - min) + min);
    
    // Snap to step increments
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    
    if (clampedValue !== value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange(clampedValue);
    }
  };

  const handleGestureStateChange = (event) => {
    if (event.nativeEvent.state === 4) { // BEGAN
      setIsDragging(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else if (event.nativeEvent.state === 5) { // END
      setIsDragging(false);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}%</Text>
          <Text style={styles.valueLabel}>of total tips</Text>
        </View>
      </View>
      
      <View style={styles.sliderContainer}>
        <View style={styles.track}>
          <LinearGradient
            colors={[theme.colors.teal, theme.colors.purple]}
            style={[
              styles.fill,
              { width: `${getPercentage()}%` }
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        </View>
        
        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onHandlerStateChange={handleGestureStateChange}
        >
          <View
            style={[
              styles.thumb,
              {
                left: `${getPercentage()}%`,
                transform: [{ scale: isDragging ? 1.2 : 1 }]
              }
            ]}
          >
            <LinearGradient
              colors={[theme.colors.teal, theme.colors.purple]}
              style={styles.thumbGradient}
            />
          </View>
        </PanGestureHandler>
      </View>
      
      <View style={styles.labels}>
        <Text style={styles.label}>{min}%</Text>
        <Text style={styles.label}>{max}%</Text>
      </View>
      
      <View style={styles.breakdown}>
        <View style={styles.breakdownItem}>
          <View style={[styles.breakdownDot, { backgroundColor: theme.colors.teal }]} />
          <Text style={styles.breakdownText}>Bartenders: {100 - value}%</Text>
        </View>
        <View style={styles.breakdownItem}>
          <View style={[styles.breakdownDot, { backgroundColor: theme.colors.purple }]} />
          <Text style={styles.breakdownText}>Support: {value}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...theme.shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  value: {
    ...theme.typography.heading,
    color: theme.colors.text,
    fontWeight: '700',
  },
  valueLabel: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
  },
  sliderContainer: {
    position: 'relative',
    height: 40,
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  track: {
    height: 8,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    marginLeft: -14,
    marginTop: -10,
    borderRadius: 14,
    backgroundColor: theme.colors.background,
    padding: 2,
    ...theme.shadows.lg,
  },
  thumbGradient: {
    flex: 1,
    borderRadius: 12,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
  },
  breakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  breakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.xs,
  },
  breakdownText: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
  },
});

export default PercentageSlider;