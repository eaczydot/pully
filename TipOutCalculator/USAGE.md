# 🍸 Tip Out Calculator - Quick Start Guide

## How to Use the App

### 1. Start the App
```bash
cd TipOutCalculator
npm run web    # For web browser
npm run ios    # For iOS simulator (macOS only)
npm run android # For Android emulator
```

### 2. Enter Total Tips
- On the first screen, use the keypad to enter the total tips amount
- The interface mimics the iOS calculator style
- Tap "Continue" to proceed to bartender entry

### 3. Add Bartenders
- Enter each bartender's name using the text input
- Switch to hours entry mode and use the keypad
- The app shows real-time percentage calculations
- Use navigation buttons or swipe to move between screens
- Add multiple bartenders using the "+" button

### 4. Add Support Staff
- Similar process to bartenders
- Support staff automatically gets 20% of total tips
- Individual shares calculated based on hours worked within the support staff pool

### 5. View Results
- Final screen shows complete breakdown
- Each person's exact tip amount and percentage
- Verification section ensures math is correct
- Share results via text, email, or other apps

## Key Features

### Fair Distribution Logic
- **Support Staff**: Gets 20% of total tips, distributed by hours worked
- **Bartenders**: Gets remaining 80%, distributed by hours worked
- **Percentage-based**: Your share = (your hours / total role hours) × role pool

### Easy Navigation
- **Previous/Next buttons**: Navigate between screens
- **Progress dots**: Show current position in the process
- **Swipe support**: Coming soon with gesture improvements

### Professional Interface
- **iOS-style design**: Clean, familiar interface
- **Large touch targets**: Easy to use on mobile
- **Real-time calculations**: See percentages as you enter data
- **Verification**: Built-in math checking

## Example Calculation

**Scenario**: $1,000 total tips
- **Support Staff Pool**: $200 (20%)
- **Bartender Pool**: $800 (80%)

**Bartenders**:
- Alice: 8 hours → 8/16 = 50% → $400
- Bob: 6 hours → 6/16 = 37.5% → $300
- Carol: 2 hours → 2/16 = 12.5% → $100

**Support Staff**:
- Dave: 4 hours → 4/6 = 66.7% → $133.33
- Eve: 2 hours → 2/6 = 33.3% → $66.67

**Total Distributed**: $1,000 ✓

## Customization

To change the support staff percentage, edit `App.js`:
```javascript
const [tipData, setTipData] = useState({
  // ... other properties
  supportStaffPercentage: 25  // Change from 20 to 25%
});
```

## Troubleshooting

### App Won't Start
- Make sure all dependencies are installed: `npm install`
- Clear cache: `npx expo start --clear`
- Check that you're in the TipOutCalculator directory

### Math Doesn't Add Up
- Check that all hours are entered correctly
- Verify total tips amount
- Use the verification section in results

### Can't Navigate
- Use the Previous/Next buttons at the top
- Make sure you've completed the current screen before proceeding

## Support

This app is designed for restaurant and bar tip distribution. The calculations are transparent and verifiable, making it perfect for ensuring fair tip distribution among staff members.