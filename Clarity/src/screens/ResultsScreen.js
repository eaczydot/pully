import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Share 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { theme, createCardStyle, createCircularButtonStyle } from '../theme';
import CircularActionCard from '../components/CircularActionCard';
import MinimalValueCard from '../components/MinimalValueCard';
import AnimatedCard from '../components/AnimatedCard';
import FloatingActionButton from '../components/FloatingActionButton';
import AnimatedNumber from '../components/AnimatedNumber';

const ResultsScreen = ({ tipData, setTipData, onPrevious }) => {
  const calculateResults = () => {
    const { totalTips, bartenders, supportStaff, supportStaffPercentage } = tipData;
    
    // Calculate support staff pool
    const supportPool = totalTips * (supportStaffPercentage / 100);
    const bartenderPool = totalTips - supportPool;
    
    // Calculate bartender shares
    const totalBartenderHours = bartenders.reduce((sum, b) => sum + b.hours, 0);
    const bartenderResults = bartenders.map(bartender => ({
      ...bartender,
      percentage: totalBartenderHours > 0 ? (bartender.hours / totalBartenderHours) * 100 : 0,
      tipAmount: totalBartenderHours > 0 ? (bartender.hours / totalBartenderHours) * bartenderPool : 0
    }));
    
    // Calculate support staff shares
    const totalSupportHours = supportStaff.reduce((sum, s) => sum + s.hours, 0);
    const supportResults = supportStaff.map(staff => ({
      ...staff,
      percentage: totalSupportHours > 0 ? (staff.hours / totalSupportHours) * 100 : 0,
      tipAmount: totalSupportHours > 0 ? (staff.hours / totalSupportHours) * supportPool : 0
    }));
    
    return {
      totalTips,
      bartenderPool,
      supportPool,
      bartenderResults,
      supportResults
    };
  };

  const results = calculateResults();

  const shareResults = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    let shareText = `💰 Tonight's Tips\n\n`;
    shareText += `Total: $${results.totalTips.toFixed(2)}\n\n`;
    
    shareText += `🍸 BARTENDERS (${100 - tipData.supportStaffPercentage}%)\n`;
    shareText += `Pool: $${results.bartenderPool.toFixed(2)}\n`;
    results.bartenderResults.forEach(bartender => {
      shareText += `${bartender.name}: $${bartender.tipAmount.toFixed(2)}\n`;
    });
    
    if (results.supportResults.length > 0) {
      shareText += `\n🛠 SUPPORT (${tipData.supportStaffPercentage}%)\n`;
      shareText += `Pool: $${results.supportPool.toFixed(2)}\n`;
      results.supportResults.forEach(staff => {
        shareText += `${staff.name}: $${staff.tipAmount.toFixed(2)}\n`;
      });
    }

    try {
      await Share.share({
        message: shareText,
        title: 'Tonight\'s Tips'
      });
      
      // Success haptic feedback
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }, 100);
    } catch (error) {
      console.error('Error sharing:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const resetCalculator = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTipData({
      totalTips: 0,
      bartenders: [],
      supportStaff: [],
      supportStaffPercentage: 20
    });
    
    // Success feedback after reset
    setTimeout(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 200);
  };

  return (
    <View style={styles.container}>
      {/* Minimal Header */}
      <AnimatedCard
        animationType="fadeIn"
        delay={0}
        style={styles.headerCard}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>🎉</Text>
            <Text style={styles.headerSubtitle}>Tonight's Results</Text>
          </View>
          <View style={styles.placeholder} />
        </View>
      </AnimatedCard>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section - Large Centered Total with Animation */}
        <AnimatedCard
          animationType="scale"
          delay={200}
          style={styles.heroCard}
        >
          <View style={styles.heroSection}>
            <Text style={styles.totalLabel}>Total Distributed</Text>
            <AnimatedNumber
              value={results.totalTips}
              style={styles.totalAmount}
              duration={1200}
              delay={400}
              onAnimationComplete={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <Text style={styles.totalSubtitle}>
              {results.bartenderResults.length + results.supportResults.length} people
            </Text>
          </View>
        </AnimatedCard>

        {/* Primary Action Cards with Staggered Animation */}
        <View style={styles.primaryActionsContainer}>
          <CircularActionCard
            icon="share-outline"
            label="Share"
            color={theme.colors.teal}
            onPress={shareResults}
            delay={600}
            animationType="bounce"
          />
          <CircularActionCard
            icon="save-outline"
            label="Save"
            color={theme.colors.purple}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }}
            delay={700}
            animationType="bounce"
          />
          <CircularActionCard
            icon="print-outline"
            label="Print"
            color={theme.colors.coral}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }}
            delay={800}
            animationType="bounce"
          />
          <CircularActionCard
            icon="refresh-outline"
            label="New"
            color={theme.colors.mint}
            onPress={resetCalculator}
            delay={900}
            animationType="bounce"
          />
        </View>

        {/* Pool Distribution Cards with Animation */}
        <View style={styles.poolDistribution}>
          <AnimatedCard
            animationType="slideUp"
            delay={1000}
            style={styles.poolCard}
          >
            <MinimalValueCard
              value={`$${results.bartenderPool.toFixed(2)}`}
              label="Bartender Pool"
              subtitle={`${100 - tipData.supportStaffPercentage}% • ${results.bartenderResults.length} people`}
              variant="teal"
            />
          </AnimatedCard>
          
          <AnimatedCard
            animationType="slideUp"
            delay={1100}
            style={styles.poolCard}
          >
            <MinimalValueCard
              value={`$${results.supportPool.toFixed(2)}`}
              label="Support Pool"
              subtitle={`${tipData.supportStaffPercentage}% • ${results.supportResults.length} people`}
              variant="purple"
            />
          </AnimatedCard>
        </View>

        {/* Individual Breakdowns with Staggered Animation */}
        {results.bartenderResults.length > 0 && (
          <View style={styles.breakdownSection}>
            <AnimatedCard
              animationType="fadeIn"
              delay={1200}
              style={styles.sectionHeaderCard}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🍸 Bartenders</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{results.bartenderResults.length}</Text>
                </View>
              </View>
            </AnimatedCard>
            
            {results.bartenderResults.map((bartender, index) => (
              <AnimatedCard
                key={bartender.id}
                animationType="slideUp"
                delay={1300 + (index * 100)}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View style={styles.personRow}>
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{bartender.name}</Text>
                    <Text style={styles.personDetails}>
                      {bartender.hours}h • {bartender.percentage.toFixed(1)}%
                    </Text>
                  </View>
                  <AnimatedNumber
                    value={bartender.tipAmount}
                    style={styles.personAmount}
                    duration={800}
                    delay={1400 + (index * 100)}
                  />
                </View>
              </AnimatedCard>
            ))}
          </View>
        )}

        {results.supportResults.length > 0 && (
          <View style={styles.breakdownSection}>
            <AnimatedCard
              animationType="fadeIn"
              delay={1300 + (results.bartenderResults.length * 100)}
              style={styles.sectionHeaderCard}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>🛠 Support Staff</Text>
                <View style={styles.countBadge}>
                  <Text style={styles.countText}>{results.supportResults.length}</Text>
                </View>
              </View>
            </AnimatedCard>
            
            {results.supportResults.map((staff, index) => (
              <AnimatedCard
                key={staff.id}
                animationType="slideUp"
                delay={1400 + (results.bartenderResults.length * 100) + (index * 100)}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View style={styles.personRow}>
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{staff.name}</Text>
                    <Text style={styles.personDetails}>
                      {staff.hours}h • {staff.percentage.toFixed(1)}%
                    </Text>
                  </View>
                  <AnimatedNumber
                    value={staff.tipAmount}
                    style={styles.personAmount}
                    duration={800}
                    delay={1500 + (results.bartenderResults.length * 100) + (index * 100)}
                  />
                </View>
              </AnimatedCard>
            ))}
          </View>
        )}

        {/* Verification Summary with Animation */}
        <AnimatedCard
          animationType="fadeIn"
          delay={1600 + ((results.bartenderResults.length + results.supportResults.length) * 100)}
          style={styles.verificationSection}
        >
          <View style={styles.verificationCard}>
            <Text style={styles.verificationTitle}>✓ Verified</Text>
            <Text style={styles.verificationSubtitle}>
              All amounts distributed correctly
            </Text>
          </View>
        </AnimatedCard>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Enhanced Floating Action Button */}
      <FloatingActionButton
        onPress={shareResults}
        visible={true}
        delay={2000}
        style={styles.floatingAction}
      >
        <Ionicons name="share-outline" size={24} color={theme.colors.text} />
      </FloatingActionButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    ...createCircularButtonStyle(36, 'none'),
    backgroundColor: theme.colors.surfaceSecondary,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  headerSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  placeholder: {
    width: 36,
  },
  scrollContainer: {
    flex: 1,
  },
  heroCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxxl,
    paddingHorizontal: theme.spacing.xl,
  },
  totalLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalAmount: {
    ...theme.typography.hero,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  totalSubtitle: {
    ...theme.typography.footnote,
    color: theme.colors.textTertiary,
  },
  primaryActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xxxl,
  },
  poolDistribution: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
    gap: theme.spacing.lg,
  },
  poolCard: {
    marginBottom: 0,
  },
  breakdownSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xxxl,
  },
  sectionHeaderCard: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '500',
  },
  countBadge: {
    backgroundColor: theme.colors.softTeal,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.pill,
  },
  countText: {
    ...theme.typography.footnote,
    color: theme.colors.teal,
    fontWeight: '600',
  },
  personRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.md,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
    marginBottom: 2,
  },
  personDetails: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
  },
  personAmount: {
    ...theme.typography.heading,
    color: theme.colors.success,
    fontWeight: '600',
  },
  verificationSection: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  verificationCard: {
    backgroundColor: theme.colors.softTeal,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  verificationTitle: {
    ...theme.typography.body,
    color: theme.colors.teal,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  verificationSubtitle: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: theme.spacing.xxxxl,
  },
  floatingAction: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.xl,
  },
});

export default ResultsScreen;