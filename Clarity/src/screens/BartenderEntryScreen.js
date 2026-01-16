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

const BartenderEntryScreen = ({ tipData, setTipData, onNext, onPrevious }) => {
  const [currentBartender, setCurrentBartender] = useState(0);
  const [entryMode, setEntryMode] = useState('name'); // 'name' or 'hours'
  const [nameInput, setNameInput] = useState('');
  const [hoursInput, setHoursInput] = useState('0');

  const addNewBartender = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newBartender = {
      id: Date.now(),
      name: '',
      hours: 0
    };
    setTipData(prev => ({
      ...prev,
      bartenders: [...prev.bartenders, newBartender]
    }));
    setCurrentBartender(tipData.bartenders.length);
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

  const saveBartender = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!nameInput.trim()) {
      Alert.alert('Error', 'Please enter a name for the bartender');
      return;
    }

    const hours = parseFloat(hoursInput) || 0;
    if (hours <= 0) {
      Alert.alert('Error', 'Please enter valid hours worked');
      return;
    }

    setTipData(prev => ({
      ...prev,
      bartenders: prev.bartenders.map((bartender, index) => 
        index === currentBartender 
          ? { ...bartender, name: nameInput.trim(), hours }
          : bartender
      )
    }));

    // Reset for next entry
    setNameInput('');
    setHoursInput('0');
    setEntryMode('name');
  };

  const deleteBartender = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setTipData(prev => ({
      ...prev,
      bartenders: prev.bartenders.filter((_, i) => i !== index)
    }));
    if (currentBartender >= tipData.bartenders.length - 1) {
      setCurrentBartender(Math.max(0, tipData.bartenders.length - 2));
    }
  };

  const editBartender = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const bartender = tipData.bartenders[index];
    setCurrentBartender(index);
    setNameInput(bartender.name);
    setHoursInput(bartender.hours.toString());
    setEntryMode('name');
  };

  const currentBartenderData = tipData.bartenders[currentBartender];
  const totalHours = tipData.bartenders.reduce((sum, b) => sum + b.hours, 0);
  const completedBartenders = tipData.bartenders.filter(b => b.name && b.hours > 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onPrevious} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Bartender Entry</Text>
          <Text style={styles.headerSubtitle}>
            {completedBartenders.length} of {tipData.bartenders.length || 1} entered
          </Text>
        </View>
        
        <TouchableOpacity onPress={addNewBartender} style={styles.addButton}>
          <Ionicons name="add" size={24} color={theme.colors.teal} />
        </TouchableOpacity>
      </View>

      {/* Entry Section */}
      <View style={styles.entrySection}>
        {entryMode === 'name' ? (
          <View style={styles.nameEntry}>
            <Text style={styles.entryLabel}>Bartender Name</Text>
            <TextInput
              style={styles.nameInput}
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Enter bartender name"
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
                  colors={[theme.colors.teal, '#00B794']}
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
              onPress={saveBartender}
            >
              <LinearGradient
                colors={[theme.colors.success, '#2EAD4A']}
                style={styles.saveButtonGradient}
              >
                <Ionicons name="checkmark" size={20} color={theme.colors.text} />
                <Text style={styles.saveButtonText}>Save Bartender</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bartender List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Added Bartenders</Text>
          {totalHours > 0 && (
            <Text style={styles.totalHours}>Total: {totalHours} hours</Text>
          )}
        </View>
        
        {tipData.bartenders.map((bartender, index) => (
          <View key={bartender.id} style={styles.bartenderCard}>
            <TouchableOpacity 
              style={styles.bartenderContent}
              onPress={() => editBartender(index)}
              activeOpacity={0.7}
            >
              <View style={styles.bartenderInfo}>
                <Text style={styles.bartenderName}>
                  {bartender.name || 'Unnamed Bartender'}
                </Text>
                <Text style={styles.bartenderDetails}>
                  {bartender.hours} hours
                  {totalHours > 0 && (
                    <Text style={styles.bartenderPercentage}>
                      {' • '}{((bartender.hours / totalHours) * 100).toFixed(1)}%
                    </Text>
                  )}
                </Text>
              </View>
              
              <View style={styles.bartenderActions}>
                <TouchableOpacity 
                  onPress={() => editBartender(index)}
                  style={styles.editButton}
                >
                  <Ionicons name="pencil" size={16} color={theme.colors.textSecondary} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => deleteBartender(index)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        ))}
        
        {tipData.bartenders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>👋</Text>
            <Text style={styles.emptyStateText}>Add your first bartender to get started</Text>
          </View>
        )}
      </ScrollView>

      {/* Continue Button */}
      {completedBartenders.length > 0 && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.continueMainButton} onPress={onNext}>
            <LinearGradient
              colors={[theme.colors.teal, '#00B794']}
              style={styles.continueMainButtonGradient}
            >
              <Text style={styles.continueMainButtonText}>Continue to Support Staff</Text>
              <Ionicons name="arrow-forward" size={20} color={theme.colors.text} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

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
  entrySection: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
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
  bartenderCard: {
    ...createCardStyle('sm'),
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  bartenderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  bartenderInfo: {
    flex: 1,
  },
  bartenderName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  bartenderDetails: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  bartenderPercentage: {
    color: theme.colors.teal,
  },
  bartenderActions: {
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

export default BartenderEntryScreen;