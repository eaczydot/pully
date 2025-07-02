import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

const { width, height } = Dimensions.get('window');

const CelebrationEffect = ({ 
  visible, 
  onComplete,
  type = 'confetti', // 'confetti', 'rain', 'snow', 'yawn', 'bored', 'holiday'
  duration = 2000,
  particleCount = 20,
  amount = 0 
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

  // Auto-determine celebration type based on amount
  const getCelebrationType = () => {
    if (amount >= 250) return 'confetti';
    
    const currentMonth = new Date().getMonth();
    const currentHour = new Date().getHours();
    
    // Holiday seasons
    if (currentMonth === 11) return 'holiday'; // December - holiday particles
    if (currentMonth >= 2 && currentMonth <= 4) return 'rain'; // Spring rain
    if (currentMonth >= 5 && currentMonth <= 7) return 'sunny'; // Summer
    if (currentMonth >= 8 && currentMonth <= 10) return 'snow'; // Fall/Winter
    
    // Time-based moods for low amounts
    if (currentHour >= 22 || currentHour <= 6) return 'yawn'; // Late night/early morning
    if (amount < 50) return 'bored'; // Very low amounts
    
    return 'rain'; // Default weather
  };

  useEffect(() => {
    if (visible) {
      const celebrationType = type === 'auto' ? getCelebrationType() : type;
      
      // Contextual haptic feedback
      if (celebrationType === 'confetti') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }, 200);
      } else {
        // Gentler haptic for weather/mood animations
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (celebrationType === 'confetti') {
        startConfettiAnimation();
      } else if (['rain', 'snow'].includes(celebrationType)) {
        startWeatherAnimation(celebrationType);
      } else if (celebrationType === 'yawn') {
        startYawnAnimation();
      } else if (celebrationType === 'bored') {
        startBoredAnimation();
      } else if (celebrationType === 'holiday') {
        startHolidayAnimation();
      } else if (celebrationType === 'sunny') {
        startSunnyAnimation();
      } else {
        startPulseAnimation();
      }
    }
  }, [visible, type, amount]);

  const startConfettiAnimation = () => {
    const animations = particles.map((particle, index) => {
      const startX = (Math.random() - 0.5) * 100;
      const startY = (Math.random() - 0.5) * 100;
      const endX = (Math.random() - 0.5) * width;
      const endY = Math.random() * height - height / 2;
      const endRotation = Math.random() * 720;

      particle.translateX.setValue(startX);
      particle.translateY.setValue(startY);
      particle.scale.setValue(0);
      particle.rotate.setValue(0);
      particle.opacity.setValue(0);

      return Animated.parallel([
        Animated.timing(particle.scale, {
          toValue: Math.random() * 0.8 + 0.4,
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
        Animated.timing(particle.rotate, {
          toValue: endRotation,
          duration: duration - 200,
          delay: index * 50,
          useNativeDriver: true,
        }),
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

  const startWeatherAnimation = (weatherType) => {
    const isSnow = weatherType === 'snow';
    const particleCount = isSnow ? 15 : 12;
    
    const animations = particles.slice(0, particleCount).map((particle, index) => {
      const startX = Math.random() * width;
      const startY = -50;
      const endY = height + 50;
      const drift = isSnow ? (Math.random() - 0.5) * 100 : (Math.random() - 0.5) * 30;

      particle.translateX.setValue(startX);
      particle.translateY.setValue(startY);
      particle.scale.setValue(0);
      particle.opacity.setValue(0);

      return Animated.parallel([
        Animated.timing(particle.scale, {
          toValue: isSnow ? 0.6 : 0.3,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: isSnow ? 0.8 : 0.6,
          duration: 300,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateX, {
          toValue: startX + drift,
          duration: duration - 200,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateY, {
          toValue: endY,
          duration: duration - 200,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 200,
          delay: duration - 400,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(80, animations).start(() => {
      if (onComplete) onComplete();
    });
  };

  const startYawnAnimation = () => {
    // Slow, droopy particles falling lazily
    const animations = particles.slice(0, 8).map((particle, index) => {
      const startX = Math.random() * width;
      const startY = height * 0.3;
      const endY = height + 50;

      particle.translateX.setValue(startX);
      particle.translateY.setValue(startY);
      particle.scale.setValue(0);
      particle.opacity.setValue(0);

      return Animated.sequence([
        Animated.timing(particle.scale, {
          toValue: 0.4,
          duration: 500,
          delay: index * 200,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0.4,
          duration: 500,
          delay: index * 200,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateY, {
          toValue: endY,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      if (onComplete) onComplete();
    });
  };

  const startBoredAnimation = () => {
    // Very minimal, unenthusiastic animation
    const animations = particles.slice(0, 3).map((particle, index) => {
      particle.translateX.setValue(0);
      particle.translateY.setValue(0);
      particle.scale.setValue(0);
      particle.opacity.setValue(0);

      return Animated.sequence([
        Animated.timing(particle.scale, {
          toValue: 0.2,
          duration: 800,
          delay: index * 300,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.parallel(animations).start(() => {
      if (onComplete) onComplete();
    });
  };

  const startHolidayAnimation = () => {
    // Sparkly holiday particles with red/green/gold colors
    const animations = particles.slice(0, 12).map((particle, index) => {
      const angle = (index / 12) * Math.PI * 2;
      const radius = 60 + Math.random() * 40;
      const endX = Math.cos(angle) * radius;
      const endY = Math.sin(angle) * radius;

      particle.translateX.setValue(0);
      particle.translateY.setValue(0);
      particle.scale.setValue(0);
      particle.opacity.setValue(0);

      return Animated.sequence([
        Animated.parallel([
          Animated.spring(particle.scale, {
            toValue: 0.8,
            tension: 150,
            friction: 6,
            delay: index * 80,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0.9,
            duration: 200,
            delay: index * 80,
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
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.stagger(60, animations).start(() => {
      if (onComplete) onComplete();
    });
  };

  const startSunnyAnimation = () => {
    // Bright, cheerful particles radiating outward
    const animations = particles.slice(0, 10).map((particle, index) => {
      const angle = (index / 10) * Math.PI * 2;
      const radius = 100;
      const endX = Math.cos(angle) * radius;
      const endY = Math.sin(angle) * radius;

      particle.translateX.setValue(0);
      particle.translateY.setValue(0);
      particle.scale.setValue(0);
      particle.opacity.setValue(0);

      return Animated.parallel([
        Animated.spring(particle.scale, {
          toValue: 0.6,
          tension: 200,
          friction: 6,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0.8,
          duration: 200,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateX, {
          toValue: endX,
          duration: 800,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(particle.translateY, {
          toValue: endY,
          duration: 800,
          delay: index * 50,
          useNativeDriver: true,
        }),
        Animated.timing(particle.opacity, {
          toValue: 0,
          duration: 300,
          delay: 600,
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
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(pulseScale, {
          toValue: 1.8,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]);

    pulseSequence.start(() => {
      if (onComplete) onComplete();
    });
  };

  const getParticleColor = (index, celebrationType) => {
    if (celebrationType === 'confetti') {
      const colors = [theme.colors.teal, theme.colors.purple, theme.colors.coral, theme.colors.mint, theme.colors.success];
      return colors[index % colors.length];
    } else if (celebrationType === 'rain') {
      return '#87CEEB'; // Sky blue
    } else if (celebrationType === 'snow') {
      return '#FFFFFF'; // White
    } else if (celebrationType === 'holiday') {
      const holidayColors = ['#FF0000', '#00FF00', '#FFD700']; // Red, Green, Gold
      return holidayColors[index % holidayColors.length];
    } else if (celebrationType === 'sunny') {
      return '#FFD700'; // Golden
    } else if (celebrationType === 'yawn') {
      return '#666666'; // Gray
    } else if (celebrationType === 'bored') {
      return '#888888'; // Light gray
    }
    return theme.colors.teal;
  };

  const currentType = type === 'auto' ? getCelebrationType() : type;

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {currentType === 'pulse' && (
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
      
      {currentType !== 'pulse' &&
        particles.map((particle, index) => (
          <Animated.View
            key={particle.id}
            style={[
              styles.particle,
              currentType === 'snow' ? styles.snowflake : 
              currentType === 'rain' ? styles.raindrop :
              currentType === 'holiday' ? styles.holidayParticle :
              currentType === 'yawn' ? styles.yawnParticle :
              currentType === 'bored' ? styles.boredParticle :
              styles.confetti,
              {
                backgroundColor: getParticleColor(index, currentType),
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
  snowflake: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  raindrop: {
    width: 3,
    height: 12,
    borderRadius: 1.5,
  },
  holidayParticle: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  yawnParticle: {
    width: 10,
    height: 4,
    borderRadius: 2,
  },
  boredParticle: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default CelebrationEffect;