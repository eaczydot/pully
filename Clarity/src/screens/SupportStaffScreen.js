import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Keypad from '../components/Keypad';
import { theme, createButtonStyle, createCardStyle, createCircularButtonStyle } from '../theme';

const SupportStaffScreen = ({ tipData, setTipData, onNext, onPrevious }) => {
  const [currentStaff, setCurrentStaff] = useState(0);
  const [entryMode, setEntryMode] = useState('name'); // 'name' or 'hours'
  const [nameInput, setNameInput] = useState('');
  const [hoursInput, setHoursInput] = useState('0');

  const addNewStaff = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newStaff = {
      id: Date.now(),
      name: '',
      hours: 0
    };
    setTipData(prev => ({
      ...prev,
      supportStaff: [...prev.supportStaff, newStaff]
    }));
    setCurrentStaff(tipData.supportStaff.length);
    setEntryMode('name');
    setNameInput('');
    setHoursInput('0');
  };

  const handleNumberPress = (number) => {
    if (entryMode === 'hours') {
      if (hoursInput === '0') {
        setHoursInput(number);
      } else {
        setHoursInput(hoursInput + number);
      }
    }
  };

  const handleDecimalPress = () => {
    if (entryMode === 'hours' && !hoursInput.includes('.')) {
      setHoursInput(hoursInput + '.');
    }
  };

  const handleDeletePress = () => {
    if (entryMode === 'hours') {
      if (hoursInput.length > 1) {
        setHoursInput(hoursInput.slice(0, -1));
      } else {
        setHoursInput('0');
      }
    }
  };

  const saveStaff = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!nameInput.trim()) {
      Alert.alert('Error', 'Please enter a name for the support staff');
      return;
    }

    const hours = parseFloat(hoursInput) || 0;
    if (hours <= 0) {
      Alert.alert('Error', 'Please enter valid hours worked');
      return;
    }

    setTipData(prev => ({
      ...prev,
      supportStaff: prev.supportStaff.map((staff, index) => 
        index === currentStaff 
          ? { ...staff, name: nameInput.trim(), hours }
          : staff
      )
    }));

    // Reset for next entry
    setNameInput('');
    setHoursInput('0');
    setEntryMode('name');
  };

  const deleteStaff = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTipData(prev => ({
      ...prev,
      supportStaff: prev.supportStaff.filter((_, i) => i !== index)
    }));
    if (currentStaff >= tipData.supportStaff.length - 1) {
      setCurrentStaff(Math.max(0, tipData.supportStaff.length - 2));
    }
  };

  const editStaff = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const staff = tipData.supportStaff[index];
    setCurrentStaff(index);
    setNameInput(staff.name);
    setHoursInput(staff.hours.toString());
    setEntryMode('name');
  };

  const totalHours = tipData.supportStaff.reduce((sum, s) => sum + s.hours, 0);
  const supportTipPool = tipData.totalTips * (tipData.supportStaffPercentage / 100);
  const completedStaff = tipData.supportStaff.filter(s => s.name && s.hours > 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Support Staff</Text>
          <Text style={styles.headerSubtitle}>
            {completedStaff.length} of {tipData.supportStaff.length || 1} entered
          </Text>
        </View>
        
        <TouchableOpacity onPress={addNewStaff} style={styles.addButton}>
          <Ionicons name="add" size={24} color={theme.colors.purple} />
        </TouchableOpacity>
      </View>

      {/* Support Staff Pool Info */}
      <View style={styles.poolInfo}>
        <LinearGradient
          colors={[theme.colors.purple, '#574BCE']}
          style={styles.poolInfoGradient}
        >
          <Text style={styles.poolInfoLabel}>Support Staff Pool</Text>
          <Text style={styles.poolInfoAmount}>
            ${supportTipPool.toFixed(2)}
          </Text>
          <Text style={styles.poolInfoPercentage}>
            {tipData.supportStaffPercentage}% of total tips
          </Text>
        </LinearGradient>
      </View>

      {/* Entry Section */}
      <View style={styles.entrySection}>
        {entryMode === 'name' ? (
          <View style={styles.nameEntry}>
            <Text style={styles.entryLabel}>Support Staff Name</Text>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter staff name"
              placeholderTextColor={theme.colors.textSecondary}
              autoFocus={!nameInput}
              returnKeyType="next"
              onSubmitEditing={() => {
                if (nameInput.trim()) {
                  setEntryMode('hours');
                }
              }}
            />
            
            {nameInput.trim() && (
              <TouchableOpacity 
                style={styles.continueButton}
                onPress={() => setEntryMode('hours')}
              >
                <LinearGradient
                  colors={[theme.colors.purple, '#574BCE']}
                  style={styles.continueButtonGradient}
                >
                  <Text style={styles.continueButtonText}>Set Hours</Text>
                  <Ionicons name="arrow-forward" size={18} color={theme.colors.text} />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.hoursEntry}>
            <Text style={styles.entryLabel}>Hours Worked</Text>
            <Text style={styles.nameDisplay}>{nameInput}</Text>
            <Text style={styles.hoursDisplay}>{hoursInput} hours</Text>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={saveStaff}
            >
              <LinearGradient
                colors={[theme.colors.success, '#2EAD4A']}
                style={styles.saveButtonGradient}
              >
                <Ionicons name="checkmark" size={20} color={theme.colors.text} />
                <Text style={styles.saveButtonText}>Save Support Staff</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Support Staff List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Added Support Staff</Text>
          {totalHours > 0 && (
            <Text style={styles.totalHours}>Total: {totalHours} hours</Text>
          )}
        </View>
        
        {tipData.supportStaff.map((staff, index) => {
          const percentage = totalHours > 0 ? (staff.hours / totalHours) * 100 : 0;
          const tipAmount = supportTipPool * (percentage / 100);
          
          return (
            <View key={staff.id} style={styles.staffCard}>
              <TouchableOpacity 
                style={styles.staffContent}
                onPress={() => editStaff(index)}
                activeOpacity={0.7}
              >
                <View style={styles.staffInfo}>
                  <Text style={styles.staffName}>
                    {staff.name || 'Unnamed Staff'}
                  </Text>
                  <Text style={styles.staffDetails}>
                    {staff.hours} hours
                    {totalHours > 0 && (
                      <Text style={styles.staffPercentage}>
                        {' • '}{percentage.toFixed(1)}%
                      </Text>
                    )}
                  </Text>
                  {tipAmount > 0 && (
                    <Text style={styles.staffTipAmount}>
                      ${tipAmount.toFixed(2)}
                    </Text>
                  )}
                </View>
                
                <View style={styles.staffActions}>
                  <TouchableOpacity 
                    onPress={() => editStaff(index)}
                    style={styles.editButton}
                  >
                    <Ionicons name="pencil" size={16} color={theme.colors.textSecondary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => deleteStaff(index)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
        
        {tipData.supportStaff.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>🛠</Text>
            <Text style={styles.emptyStateText}>
              Add support staff to distribute tips
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Support staff are optional
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.continueMainButton} onPress={onNext}>
          <LinearGradient
            colors={[theme.colors.teal, '#00B794']}
            style={styles.continueMainButtonGradient}
          >
            <Text style={styles.continueMainButtonText}>Calculate Results</Text>
            <Ionicons name="calculator" size={20} color={theme.colors.text} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Keypad (only show when entering hours) */}
      {entryMode === 'hours' && (
        <Keypad
          onNumberPress={handleNumberPress}
          onDecimalPress={handleDecimalPress}
          onDeletePress={handleDeletePress}
        />
      )}
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
  headerCenter: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    ...theme.typography.heading,
    color: theme.colors.text,
  },
  headerSubtitle: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    ...createCircularButtonStyle(40),
    backgroundColor: theme.colors.surfaceSecondary,
  },
  poolInfo: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  poolInfoGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  poolInfoLabel: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    opacity: 0.8,
    marginBottom: theme.spacing.xs,
  },
  poolInfoAmount: {
    ...theme.typography.title,
    color: theme.colors.text,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  poolInfoPercentage: {
    ...theme.typography.footnote,
    color: theme.colors.text,
    opacity: 0.9,
  },
  entrySection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  nameEntry: {
    width: '100%',
    alignItems: 'center',
  },
  hoursEntry: {
    width: '100%',
    alignItems: 'center',
  },
  entryLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  nameInput: {
    ...theme.typography.title,
    color: theme.colors.text,
    textAlign: 'center',
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    minWidth: 250,
    marginBottom: theme.spacing.xl,
  },
  nameDisplay: {
    ...theme.typography.heading,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  hoursDisplay: {
    ...theme.typography.display,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
  },
  continueButton: {
    borderRadius: theme.borderRadius.pill,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  continueButtonGradient: {
    ...createButtonStyle('primary', 'md'),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  continueButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  saveButton: {
    borderRadius: theme.borderRadius.pill,
    overflow: 'hidden',
    ...theme.shadows.sm,
  },
  saveButtonGradient: {
    ...createButtonStyle('success', 'lg'),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  saveButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  listTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
  },
  totalHours: {
    ...theme.typography.footnote,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surfaceSecondary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.pill,
  },
  staffCard: {
    ...createCardStyle('sm'),
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  staffContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  staffDetails: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  staffPercentage: {
    color: theme.colors.purple,
  },
  staffTipAmount: {
    ...theme.typography.footnote,
    color: theme.colors.success,
    fontWeight: '600',
  },
  staffActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  editButton: {
    ...createCircularButtonStyle(32),
    backgroundColor: theme.colors.surfaceTertiary,
  },
  deleteButton: {
    ...createCircularButtonStyle(32),
    backgroundColor: theme.colors.surfaceTertiary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  emptyStateSubtext: {
    ...theme.typography.footnote,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  continueMainButton: {
    borderRadius: theme.borderRadius.pill,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  continueMainButtonGradient: {
    ...createButtonStyle('primary', 'lg'),
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  continueMainButtonText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
});

export default SupportStaffScreen;