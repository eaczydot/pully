import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Share 
} from 'react-native';

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
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tip Out Results</Text>
        <TouchableOpacity onPress={shareResults} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.totalTipsText}>Total Tips</Text>
          <Text style={styles.totalTipsAmount}>${results.totalTips.toFixed(2)}</Text>
          
          <View style={styles.poolsContainer}>
            <View style={styles.poolItem}>
              <Text style={styles.poolLabel}>Bartender Pool</Text>
              <Text style={styles.poolAmount}>${results.bartenderPool.toFixed(2)}</Text>
              <Text style={styles.poolPercentage}>{100 - tipData.supportStaffPercentage}%</Text>
            </View>
            
            <View style={styles.poolItem}>
              <Text style={styles.poolLabel}>Support Pool</Text>
              <Text style={styles.poolAmount}>${results.supportPool.toFixed(2)}</Text>
              <Text style={styles.poolPercentage}>{tipData.supportStaffPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Bartenders */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🍸 Bartenders</Text>
          </View>
          
          {results.bartenderResults.map((bartender, index) => (
            <View key={bartender.id} style={styles.personItem}>
              <View style={styles.personInfo}>
                <Text style={styles.personName}>{bartender.name}</Text>
                <Text style={styles.personHours}>{bartender.hours} hours</Text>
              </View>
              <View style={styles.personPayout}>
                <Text style={styles.personAmount}>${bartender.tipAmount.toFixed(2)}</Text>
                <Text style={styles.personPercentage}>{bartender.percentage.toFixed(1)}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Support Staff */}
        {results.supportResults.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🛠 Support Staff</Text>
            </View>
            
            {results.supportResults.map((staff, index) => (
              <View key={staff.id} style={styles.personItem}>
                <View style={styles.personInfo}>
                  <Text style={styles.personName}>{staff.name}</Text>
                  <Text style={styles.personHours}>{staff.hours} hours</Text>
                </View>
                <View style={styles.personPayout}>
                  <Text style={styles.personAmount}>${staff.tipAmount.toFixed(2)}</Text>
                  <Text style={styles.personPercentage}>{staff.percentage.toFixed(1)}%</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Verification */}
        <View style={styles.verificationContainer}>
          <Text style={styles.verificationTitle}>Verification</Text>
          <Text style={styles.verificationText}>
            Total Distributed: ${(
              results.bartenderResults.reduce((sum, b) => sum + b.tipAmount, 0) +
              results.supportResults.reduce((sum, s) => sum + s.tipAmount, 0)
            ).toFixed(2)}
          </Text>
          <Text style={styles.verificationText}>
            Original Total: ${results.totalTips.toFixed(2)}
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetCalculator}>
          <Text style={styles.resetButtonText}>New Calculation</Text>
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
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  shareButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 20,
    color: '#007AFF',
  },
  scrollContainer: {
    flex: 1,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
  },
  totalTipsText: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  totalTipsAmount: {
    fontSize: 48,
    fontWeight: '300',
    color: '#000',
    marginBottom: 30,
  },
  poolsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  poolItem: {
    alignItems: 'center',
  },
  poolLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  poolAmount: {
    fontSize: 20,
    fontWeight: '500',
    color: '#000',
    marginBottom: 2,
  },
  poolPercentage: {
    fontSize: 12,
    color: '#007AFF',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  personItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E7',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  personHours: {
    fontSize: 15,
    color: '#8E8E93',
    marginTop: 2,
  },
  personPayout: {
    alignItems: 'flex-end',
  },
  personAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
  },
  personPercentage: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  verificationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#F2F2F7',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
  },
  verificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  verificationText: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 10,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
  shareMainButton: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  shareMainButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ResultsScreen;