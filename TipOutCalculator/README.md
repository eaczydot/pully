# 🍸 Tip Out Calculator

A React Native iPhone app built with Expo that helps bartenders and managers calculate tip distribution fairly based on hours worked.

## Features

- **Clean iOS-style interface** inspired by native iPhone apps
- **Swipe navigation** between screens (left/right for progression, up/down for categories)
- **Easy data entry** with custom keypad for numbers and text input for names
- **Automatic calculations** with 20% going to support staff by default
- **Fair distribution** based on percentage of hours worked within each role
- **Results sharing** to easily distribute calculations to staff
- **Real-time verification** to ensure all tips are properly allocated

## How It Works

### 1. Total Tips Entry
- Enter the total tips to be distributed
- Clean calculator-style interface with large display

### 2. Bartender Entry
- Add each bartender's name and hours worked
- Swipe left/right to navigate between bartenders
- See real-time percentage calculations

### 3. Support Staff Entry
- Add support staff members and their hours
- Automatically calculates 20% of total tips for support staff pool
- Shows individual allocations based on hours worked

### 4. Results
- View complete breakdown of tip distribution
- Share results via text, email, or other apps
- Verification section ensures math is correct

## Installation & Setup

```bash
# Clone or download the project
cd TipOutCalculator

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS simulator (requires macOS)
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

## Usage

### Navigation
- **Swipe left**: Next screen/person
- **Swipe right**: Previous screen/person
- **Progress dots**: Show current screen position

### Tip Calculation Logic
1. **Total Tips**: Enter the full amount to be distributed
2. **Support Staff Allocation**: 20% of total tips automatically allocated
3. **Bartender Pool**: Remaining 80% distributed among bartenders
4. **Hour-based Distribution**: Each person's share = (their hours / total hours in role) × role pool

### Example Calculation
- Total Tips: $1,000
- Support Staff Pool: $200 (20%)
- Bartender Pool: $800 (80%)

If bartender worked 8 hours out of 24 total bartender hours:
- Their share: (8/24) × $800 = $266.67

## Technical Details

### Built With
- **React Native** with Expo
- **React Native Gesture Handler** for swipe navigation
- **React Native Reanimated** for smooth animations

### Key Components
- `TipCalculatorScreen`: Total tips entry
- `BartenderEntryScreen`: Bartender data collection
- `SupportStaffScreen`: Support staff data collection
- `ResultsScreen`: Final calculations and sharing
- `Keypad`: Reusable number input component

### File Structure
```
TipOutCalculator/
├── App.js                 # Main app with navigation
├── src/
│   ├── screens/
│   │   ├── TipCalculatorScreen.js
│   │   ├── BartenderEntryScreen.js
│   │   ├── SupportStaffScreen.js
│   │   └── ResultsScreen.js
│   └── components/
│       └── Keypad.js
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
└── package.json          # Dependencies
```

## Customization

### Changing Support Staff Percentage
Edit the `supportStaffPercentage` value in the initial state (App.js):
```javascript
const [tipData, setTipData] = useState({
  totalTips: 0,
  bartenders: [],
  supportStaff: [],
  supportStaffPercentage: 20  // Change this value
});
```

### Styling
All styles follow iOS design guidelines with:
- SF Pro font weights
- iOS color palette
- Native-feeling animations
- Proper spacing and typography

## Contributing

This app was designed for restaurant/bar tip distribution but can be adapted for other tip-pooling scenarios. Feel free to customize the interface and calculations for your specific needs.

## License

Open source - feel free to use and modify for your business needs.