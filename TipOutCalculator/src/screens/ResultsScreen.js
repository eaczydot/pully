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
import { theme, createButtonStyle, createCardStyle, createCircularButtonStyle } from '../theme';

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
    
    let shareText = `🍸 Tip Out Calculator Results\n\n`;
    shareText += `Total Tips: $${results.totalTips.toFixed(2)}\n`;
    shareText += `Bartender Pool (${100 - tipData.supportStaffPercentage}%): $${results.bartenderPool.toFixed(2)}\n`;
    shareText += `Support Staff Pool (${tipData.supportStaffPercentage}%): $${results.supportPool.toFixed(2)}\n\n`;
    
    shareText += `👩‍🍳 BARTENDERS:\n`;
    results.bartenderResults.forEach(bartender => {
      shareText += `${bartender.name}: $${bartender.tipAmount.toFixed(2)} (${bartender.percentage.toFixed(1)}%)\n`;
    });
    
    if (results.supportResults.length > 0) {
      shareText += `\n🛠 SUPPORT STAFF:\n`;
      results.supportResults.forEach(staff => {
        shareText += `${staff.name}: $${staff.tipAmount.toFixed(2)} (${staff.percentage.toFixed(1)}%)\n`;
      });
    }

    try {
      await Share.share({
        message: shareText,
        title: 'Tip Out Results'
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tonight's Results</Text>
        <TouchableOpacity onPress={shareResults} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={theme.colors.teal} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Main Total Display */}
        <View style={styles.mainDisplay}>
          <Text style={styles.totalLabel}>Total Tips Distributed</Text>
          <Text style={styles.totalAmount}>${results.totalTips.toFixed(2)}</Text>
          
          {/* Pool Summary Cards */}
          <View style={styles.poolSummary}>
            <View style={styles.poolCard}>
              <LinearGradient
                colors={[theme.colors.teal, '#00B794']}
                style={styles.poolGradient}
              >
                <Text style={styles.poolLabel}>Bartender Pool</Text>
                <Text style={styles.poolAmount}>${results.bartenderPool.toFixed(2)}</Text>
                <Text style={styles.poolPercentage}>{100 - tipData.supportStaffPercentage}%</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.poolCard}>
              <LinearGradient
                colors={[theme.colors.purple, '#574BCE']}
                style={styles.poolGradient}
              >
                <Text style={styles.poolLabel}>Support Pool</Text>
                <Text style={styles.poolAmount}>${results.supportPool.toFixed(2)}</Text>
                <Text style={styles.poolPercentage}>{tipData.supportStaffPercentage}%</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Action Cards Row */}
        <View style={styles.actionCardsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={shareResults}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="share-outline" size={24} color={theme.colors.teal} />
            </View>
            <Text style={styles.actionCardText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="save-outline" size={24} color={theme.colors.purple} />
            </View>
            <Text style={styles.actionCardText}>Save</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="print-outline" size={24} color={theme.colors.coral} />
            </View>
            <Text style={styles.actionCardText}>Print</Text>
          </TouchableOpacity>
        </View>

        {/* Bartenders Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionEmoji}>🍸</Text>
              <Text style={styles.sectionTitle}>Bartenders</Text>
            </View>
            <Text style={styles.sectionCount}>{results.bartenderResults.length}</Text>
          </View>
          
          {results.bartenderResults.map((bartender, index) => (
            <View key={bartender.id} style={styles.personCard}>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>{bartender.name}</Text>
                <Text style={styles.personHours}>{bartender.hours} hours • {bartender.percentage.toFixed(1)}%</Text>
              </View>
              <View style={styles.personPayout}>
                <Text style={styles.personAmount}>${bartender.tipAmount.toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Support Staff Section */}
        {results.supportResults.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionEmoji}>🛠</Text>
                <Text style={styles.sectionTitle}>Support Staff</Text>
              </View>
              <Text style={styles.sectionCount}>{results.supportResults.length}</Text>
            </View>
            
            {results.supportResults.map((staff, index) => (
              <View key={staff.id} style={styles.personCard}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{staff.name}</Text>
                  <Text style={styles.personHours}>{staff.hours} hours • {staff.percentage.toFixed(1)}%</Text>
                </View>
                <View style={styles.personPayout}>
                  <Text style={styles.personAmount}>${staff.tipAmount.toFixed(2)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Verification Card */}
        <View style={styles.verificationCard}>
          <Text style={styles.verificationTitle}>Verification</Text>
          <View style={styles.verificationRow}>
            <Text style={styles.verificationLabel}>Total Distributed:</Text>
            <Text style={styles.verificationAmount}>
              ${(
                results.bartenderResults.reduce((sum, b) => sum + b.tipAmount, 0) +
                results.supportResults.reduce((sum, s) => sum + s.tipAmount, 0)
              ).toFixed(2)}
            </Text>
          </View>
          <View style={styles.verificationRow}>
            <Text style={styles.verificationLabel}>Original Total:</Text>
            <Text style={styles.verificationAmount}>${results.totalTips.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.resetButton} onPress={resetCalculator}>
          <Text style={styles.resetButtonText}>New Calculation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareMainButton} onPress={shareResults}>
          <LinearGradient
            colors={[theme.colors.teal, '#00B794']}
            style={styles.shareButtonGradient}
          >
            <Ionicons name="share-outline" size={20} color={theme.colors.text} />
            <Text style={styles.shareMainButtonText}>Share Results</Text>
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
    paddingVertical: theme.spacing.lg,
  },
  backButton: {
    ...createCircularButtonStyle(40),
    backgroundColor: theme.colors.surfaceSecondary,
  },
  headerTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
  },
  shareButton: {
    ...createCircularButtonStyle(40),
    backgroundColor: theme.colors.surfaceSecondary,
  },
  scrollContainer: {
    flex: 1,
  },
  mainDisplay: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxxl,
  },
  totalLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  totalAmount: {
    ...theme.typography.display,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  poolSummary: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
  },
  poolCard: {
    flex: 1,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  poolGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  poolLabel: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    opacity: 0.8,
    marginBottom: theme.spacing.xs,
  },
  poolAmount: {
    ...theme.typography.heading,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  poolPercentage: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    opacity: 0.9,
  },
  actionCardsContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  actionCard: {
    ...createCardStyle('sm'),
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  actionIconContainer: {
    ...createCircularButtonStyle(48),
    backgroundColor: theme.colors.surfaceTertiary,
    marginBottom: theme.spacing.sm,
  },
  actionCardText: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
  },
  sectionContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  sectionTitle: {
    ...theme.typography.title,
    color: theme.colors.text,
    fontSize: 24,
  },
  sectionCount: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.pill,
  },
  personCard: {
    ...createCardStyle('sm'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  personHours: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  personPayout: {
    alignItems: 'flex-end',
  },
  personAmount: {
    ...theme.typography.heading,
    color: theme.colors.success,
    fontWeight: '700',
  },
  verificationCard: {
    ...createCardStyle('sm'),
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  verificationTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: theme.spacing.md,
  },
  verificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  verificationLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  verificationAmount: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: '500',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  resetButton: {
    ...createButtonStyle('secondary', 'lg'),
    flex: 1,
  },
  resetButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  shareMainButton: {
    flex: 1,
    borderRadius: theme.borderRadius.pill,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  shareButtonGradient: {
    ...createButtonStyle('primary', 'lg'),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  shareMainButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
});

export default ResultsScreen;