import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const CelebrationEffect = ({ 
  visible, 
  onComplete,
  type = 'confetti', // 'confetti', 'pulse', 'sparkle'
  duration = 2000,
  particleCount = 20 
}) => {
  const particles = useRef(
    Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotate: new Animated.Value(0),
      opacity: new Animated.Value(0),
    }))
  ).current;

  const pulseScale = useRef(new Animated.Value(0)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Success haptic sequence
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 200);

      if (type === 'confetti') {
        startConfettiAnimation();
      } else if (type === 'pulse') {
        startPulseAnimation();
      } else if (type === 'sparkle') {
        startSparkleAnimation();
      }
    }
  }, [visible, type]);

  const startConfettiAnimation = () => {
    const animations = particles.map((particle, index) => {
      // Random starting positions around center
      const startX = (Math.random() - 0.5) * 100;
      const startY = (Math.random() - 0.5) * 100;
      
      // Random end positions
      const endX = (Math.random() - 0.5) * width;
      const endY = Math.random() * height - height / 2;
      
      // Random rotation
      const endRotation = Math.random() * 720; // 0-720 degrees

      particle.translateX.setValue(startX);
      particle.translateY.setValue(startY);
      particle.scale.setValue(0);
      particle.rotate.setValue(0);
      particle.opacity.setValue(0);

      return Animated.parallel([
        // Entrance
        Animated.timing(particle.scale, {
          toValue: Math.random() * 0.8 + 0.4, // 0.4 to 1.2
          duration: 200,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 1,
          duration: 200,
          delay: index * 50,
          useNativeDriver: true,
        }),
        // Movement
        Animated.timing(particle.translateX, {
          toValue: endX,
          duration: duration - 500,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateY, {
          toValue: endY,
          duration: duration - 500,
          delay: index * 50,
          useNativeDriver: true,
        }),
        // Rotation
        Animated.timing(particle.rotate, {
          toValue: endRotation,
          duration: duration - 200,
          delay: index * 50,
          useNativeDriver: true,
        }),
        // Exit
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 300,
          delay: duration - 800 + index * 20,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      if (onComplete) onComplete();
    });
  };

  const startPulseAnimation = () => {
    const pulseSequence = Animated.sequence([
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.8,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 1.5,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]);

    pulseSequence.start(() => {
      if (onComplete) onComplete();
    });
  };

  const startSparkleAnimation = () => {
    const sparkleAnimations = particles.slice(0, 8).map((particle, index) => {
      const angle = (index / 8) * Math.PI * 2;
      const radius = 80;
      const endX = Math.cos(angle) * radius;
      const endY = Math.sin(angle) * radius;

      particle.translateX.setValue(0);
      particle.translateY.setValue(0);
      particle.scale.setValue(0);
      particle.opacity.setValue(0);

      return Animated.sequence([
        Animated.parallel([
          Animated.spring(particle.scale, {
            toValue: 1,
            tension: 200,
            friction: 6,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 1,
            duration: 200,
            delay: index * 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(particle.translateX, {
            toValue: endX,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(particle.translateY, {
            toValue: endY,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.stagger(50, sparkleAnimations).start(() => {
      if (onComplete) onComplete();
    });
  };

  const getParticleColor = (index) => {
    const colors = [
      theme.colors.teal,
      theme.colors.purple,
      theme.colors.coral,
      theme.colors.mint,
      theme.colors.success,
      theme.colors.warning,
    ];
    return colors[index % colors.length];
  };

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {type === 'pulse' && (
        <Animated.View
          style={[
            styles.pulse,
            {
              transform: [{ scale: pulseScale }],
              opacity: pulseOpacity,
            },
          ]}
        />
      )}
      
      {(type === 'confetti' || type === 'sparkle') &&
        particles.map((particle, index) => (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              type === 'sparkle' ? styles.sparkle : styles.confetti,
              {
                backgroundColor: getParticleColor(index),
                transform: [
                  { translateX: particle.translateX },
                  { translateY: particle.translateY },
                  { scale: particle.scale },
                  {
                    rotate: particle.rotate.interpolate({
                      inputRange: [0, 360],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
                opacity: particle.opacity,
              },
            ]}
          />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  pulse: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.teal,
    position: 'absolute',
  },
  particle: {
    position: 'absolute',
  },
  confetti: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  sparkle: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default CelebrationEffect;