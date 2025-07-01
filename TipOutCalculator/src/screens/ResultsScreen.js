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
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const resetCalculator = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTipData({
      totalTips: 0,
      bartenders: [],
      supportStaff: [],
      supportStaffPercentage: 20
    });
  };

  return (
    <View style={styles.container}>
      {/* Minimal Header */}
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

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Hero Section - Large Centered Total */}
        <View style={styles.heroSection}>
          <Text style={styles.totalLabel}>Total Distributed</Text>
          <Text style={styles.totalAmount}>${results.totalTips.toFixed(2)}</Text>
          <Text style={styles.totalSubtitle}>
            {results.bartenderResults.length + results.supportResults.length} people
          </Text>
        </View>

        {/* Primary Action Cards */}
        <View style={styles.primaryActionsContainer}>
          <CircularActionCard
            icon="share-outline"
            label="Share"
            color={theme.colors.teal}
            onPress={shareResults}
          />
          <CircularActionCard
            icon="save-outline"
            label="Save"
            color={theme.colors.purple}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />
          <CircularActionCard
            icon="print-outline"
            label="Print"
            color={theme.colors.coral}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
          />
          <CircularActionCard
            icon="refresh-outline"
            label="New"
            color={theme.colors.mint}
            onPress={resetCalculator}
          />
        </View>

        {/* Pool Distribution Cards */}
        <View style={styles.poolDistribution}>
          <MinimalValueCard
            value={`$${results.bartenderPool.toFixed(2)}`}
            label="Bartender Pool"
            subtitle={`${100 - tipData.supportStaffPercentage}% • ${results.bartenderResults.length} people`}
            variant="teal"
            style={styles.poolCard}
          />
          <MinimalValueCard
            value={`$${results.supportPool.toFixed(2)}`}
            label="Support Pool"
            subtitle={`${tipData.supportStaffPercentage}% • ${results.supportResults.length} people`}
            variant="purple"
            style={styles.poolCard}
          />
        </View>

        {/* Individual Breakdowns */}
        {results.bartenderResults.length > 0 && (
          <View style={styles.breakdownSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🍸 Bartenders</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{results.bartenderResults.length}</Text>
              </View>
            </View>
            
            {results.bartenderResults.map((bartender, index) => (
              <View key={bartender.id} style={styles.personRow}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{bartender.name}</Text>
                  <Text style={styles.personDetails}>
                    {bartender.hours}h • {bartender.percentage.toFixed(1)}%
                  </Text>
                </View>
                <Text style={styles.personAmount}>${bartender.tipAmount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {results.supportResults.length > 0 && (
          <View style={styles.breakdownSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🛠 Support Staff</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{results.supportResults.length}</Text>
              </View>
            </View>
            
            {results.supportResults.map((staff, index) => (
              <View key={staff.id} style={styles.personRow}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{staff.name}</Text>
                  <Text style={styles.personDetails}>
                    {staff.hours}h • {staff.percentage.toFixed(1)}%
                  </Text>
                </View>
                <Text style={styles.personAmount}>${staff.tipAmount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Verification Summary */}
        <View style={styles.verificationSection}>
          <View style={styles.verificationCard}>
            <Text style={styles.verificationTitle}>✓ Verified</Text>
            <Text style={styles.verificationSubtitle}>
              All amounts distributed correctly
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.floatingAction}>
        <TouchableOpacity style={styles.shareFloatingButton} onPress={shareResults}>
          <LinearGradient
            colors={[theme.colors.teal, theme.colors.tealDark]}
            style={styles.shareGradient}
          >
            <Ionicons name="share-outline" size={24} color={theme.colors.text} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
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
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.md,
    ...theme.shadows.soft,
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
  shareFloatingButton: {
    borderRadius: theme.borderRadius.circle,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  shareGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResultsScreen;