import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Share,
  Alert
} from 'react-native';

const ResultsScreen = ({ tipData, setTipData, onPrevious, goToScreen }) => {
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
    let shareText = `🍸 Tip Distribution Results\n\n`;
    shareText += `💰 Total Tips: $${results.totalTips.toFixed(2)}\n\n`;
    
    if (results.bartenderResults.length > 0) {
      shareText += `👩‍🍳 BARTENDERS (${100 - tipData.supportStaffPercentage}% - $${results.bartenderPool.toFixed(2)}):\n`;
      results.bartenderResults.forEach(bartender => {
        shareText += `• ${bartender.name}: $${bartender.tipAmount.toFixed(2)} (${bartender.hours}h, ${bartender.percentage.toFixed(1)}%)\n`;
      });
      shareText += `\n`;
    }
    
    if (results.supportResults.length > 0) {
      shareText += `🛠 SUPPORT STAFF (${tipData.supportStaffPercentage}% - $${results.supportPool.toFixed(2)}):\n`;
      results.supportResults.forEach(staff => {
        shareText += `• ${staff.name}: $${staff.tipAmount.toFixed(2)} (${staff.hours}h, ${staff.percentage.toFixed(1)}%)\n`;
      });
    }

    shareText += `\n✅ Total Distributed: $${(
      results.bartenderResults.reduce((sum, b) => sum + b.tipAmount, 0) +
      results.supportResults.reduce((sum, s) => sum + s.tipAmount, 0)
    ).toFixed(2)}`;

    try {
      await Share.share({
        message: shareText,
        title: 'Tip Distribution Results'
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share results');
    }
  };

  const startNewCalculation = () => {
    Alert.alert(
      'Start New Calculation',
      'This will clear all current data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start New', 
          style: 'destructive',
          onPress: () => {
            setTipData({
              totalTips: 0,
              bartenders: [],
              supportStaff: [],
              supportStaffPercentage: 20
            });
            goToScreen(0);
          }
        }
      ]
    );
  };

  const totalDistributed = results.bartenderResults.reduce((sum, b) => sum + b.tipAmount, 0) +
                          results.supportResults.reduce((sum, s) => sum + s.tipAmount, 0);
  const isBalanced = Math.abs(totalDistributed - results.totalTips) < 0.01;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Results</Text>
          <Text style={styles.headerSubtitle}>Tip distribution breakdown</Text>
        </View>
        <TouchableOpacity onPress={shareResults} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Total Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Tips</Text>
          <Text style={styles.summaryAmount}>${results.totalTips.toFixed(2)}</Text>
          
          <View style={styles.poolsRow}>
            <View style={styles.poolCard}>
              <Text style={styles.poolLabel}>Bartenders</Text>
              <Text style={styles.poolAmount}>${results.bartenderPool.toFixed(2)}</Text>
              <Text style={styles.poolPercentage}>{100 - tipData.supportStaffPercentage}%</Text>
            </View>
            
            <View style={[styles.poolCard, styles.supportPoolCard]}>
              <Text style={styles.poolLabel}>Support Staff</Text>
              <Text style={styles.poolAmount}>${results.supportPool.toFixed(2)}</Text>
              <Text style={styles.poolPercentage}>{tipData.supportStaffPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Bartenders Section */}
        {results.bartenderResults.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🍸 Bartenders</Text>
              <Text style={styles.sectionCount}>({results.bartenderResults.length})</Text>
            </View>
            
            {results.bartenderResults.map((bartender, index) => (
              <View key={bartender.id} style={styles.personCard}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{bartender.name}</Text>
                  <Text style={styles.personDetails}>
                    {bartender.hours} hours • {bartender.percentage.toFixed(1)}%
                  </Text>
                </View>
                <Text style={styles.personAmount}>${bartender.tipAmount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Support Staff Section */}
        {results.supportResults.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🛠 Support Staff</Text>
              <Text style={styles.sectionCount}>({results.supportResults.length})</Text>
            </View>
            
            {results.supportResults.map((staff, index) => (
              <View key={staff.id} style={[styles.personCard, styles.supportPersonCard]}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{staff.name}</Text>
                  <Text style={styles.personDetails}>
                    {staff.hours} hours • {staff.percentage.toFixed(1)}%
                  </Text>
                </View>
                <Text style={[styles.personAmount, styles.supportAmount]}>${staff.tipAmount.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Verification */}
        <View style={[styles.verificationCard, isBalanced ? styles.verificationSuccess : styles.verificationError]}>
          <Text style={styles.verificationTitle}>
            {isBalanced ? '✅ Calculation Verified' : '⚠️ Calculation Error'}
          </Text>
          <Text style={styles.verificationText}>
            Total Distributed: ${totalDistributed.toFixed(2)}
          </Text>
          <Text style={styles.verificationText}>
            Original Total: ${results.totalTips.toFixed(2)}
          </Text>
          {!isBalanced && (
            <Text style={styles.verificationError}>
              Difference: ${Math.abs(totalDistributed - results.totalTips).toFixed(2)}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.newCalculationButton} onPress={startNewCalculation}>
          <Text style={styles.newCalculationButtonText}>New Calculation</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareMainButton} onPress={shareResults}>
          <Text style={styles.shareMainButtonText}>Share Results</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
  },
  backButtonText: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  shareButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
  },
  shareButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 24,
    marginVertical: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 48,
    fontWeight: '300',
    color: '#000000',
    marginBottom: 24,
  },
  poolsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  poolCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  supportPoolCard: {
    borderColor: '#FF9500',
  },
  poolLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '500',
  },
  poolAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  poolPercentage: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  section: {
    marginVertical: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  sectionCount: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 8,
    fontWeight: '500',
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  supportPersonCard: {
    backgroundColor: '#FFF8F0',
    borderLeftColor: '#FF9500',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  personDetails: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  personAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  supportAmount: {
    color: '#FF9500',
  },
  verificationCard: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
    borderWidth: 2,
  },
  verificationSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#34C759',
  },
  verificationError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FF6B6B',
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  verificationText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  newCalculationButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E7',
  },
  newCalculationButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  shareMainButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  shareMainButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResultsScreen;