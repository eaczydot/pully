# 🍸 Tip Out Calculator

A React Native iPhone app built with Expo that helps bartenders and managers calculate tip distribution fairly based on hours worked.

## Features

- **Clean iOS-style interface** inspired by native iPhone apps
- **Warped/wrapped horizontal text carousel** for employee selection with swipe gestures
- **Easy data entry** with custom keypad for numbers and text input for names
- **Automatic calculations** with 20% going to barbacks by default
- **Fair distribution** based on percentage of hours worked within each role
- **Results sharing** to easily distribute calculations to staff
- **Real-time verification** to ensure all tips are properly allocated

## How It Works

### 1. Total Tips Entry
- Enter the total tips to be distributed
- Clean calculator-style interface with large display

### 2. Employee & Role Selection (NEW!)
- **Warped/wrapped horizontal carousel** for intuitive employee navigation
- **Swipe up/down** to change between Bartender and Barback roles
- **Swipe left/right** to scroll through existing employees or add new ones
- **Unified experience** - no more separate screens for different roles
- **Real-time role pool calculations** as you switch between roles
- **Last item automatically allows adding new employee**

### 3. Hours Entry
- Use the custom keypad to enter hours worked
- See real-time percentage calculations
- Easy editing of existing entries

### 4. Results
- View complete breakdown of tip distribution
- Share results via text, email, or other apps
- Verification section ensures math is correct

## Carousel Navigation

### Role Selection (Vertical Swipe)
- **Swipe up**: Switch to Barback role
- **Swipe down**: Switch to Bartender role
- **Visual feedback**: Smooth animations and scaling effects

### Employee Selection (Horizontal Carousel)
- **Swipe left**: Navigate to next employee
- **Swipe right**: Navigate to previous employee
- **Warped effect**: Smooth continuous scrolling experience
- **Add New**: Automatically appears as the last item in the carousel
- **Visual feedback**: Selected employee is highlighted and scaled

### Key Features
- **Warped/wrapped carousel** for continuous scrolling
- **Smooth animations** with spring physics
- **Haptic feedback** for better mobile experience
- **Intuitive gestures** that feel native
- **Real-time updates** as you navigate
- **Scale and opacity effects** for visual hierarchy

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
- **Horizontal carousel**: Swipe left/right for employee selection
- **Vertical wheel**: Swipe up/down for role selection
- **Progress bar**: Shows current step in the process
- **Back/Next buttons**: Traditional navigation when needed

### Tip Calculation Logic
1. **Total Tips**: Enter the full amount to be distributed
2. **Barback Allocation**: 20% of total tips automatically allocated
3. **Bartender Pool**: Remaining 80% distributed among bartenders
4. **Hour-based Distribution**: Each person's share = (their hours / total hours in role) × role pool

### Example Calculation
- Total Tips: $1,000
- Barback Pool: $200 (20%)
- Bartender Pool: $800 (80%)

If bartender worked 8 hours out of 24 total bartender hours:
- Their share: (8/24) × $800 = $266.67

## Technical Details

### Built With
- **React Native** with Expo
- **React Native Gesture Handler** for carousel and wheel gestures
- **React Native Reanimated** for smooth animations

### Key Components
- `TipCalculatorScreen`: Total tips entry
- `PersonSelectionScreen`: Unified employee/role selection with carousel
- `WheelPicker`: Custom carousel and wheel picker component with gesture support
- `ResultsScreen`: Final calculations and sharing
- `Keypad`: Reusable number input component

### File Structure
```
TipOutCalculator/
├── App.js                 # Main app with navigation
├── src/
│   ├── screens/
│   │   ├── TipCalculatorScreen.js
│   │   ├── PersonSelectionScreen.js  # NEW: Unified selection
│   │   └── ResultsScreen.js
│   └── components/
│       ├── WheelPicker.js           # NEW: Carousel component
│       └── Keypad.js
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
└── package.json          # Dependencies
```

## Customization

### Changing Barback Percentage
Edit the `supportStaffPercentage` value in the initial state (App.js):
```javascript
const [tipData, setTipData] = useState({
  totalTips: 0,
  bartenders: [],
  supportStaff: [],
  supportStaffPercentage: 20  // Change this value
});
```

### Carousel Styling
The carousel can be customized in `src/components/WheelPicker.js`:
- **Item width**: Change `ITEM_WIDTH` constant
- **Carousel height**: Modify `CAROUSEL_HEIGHT` constant
- **Colors**: Modify the `styles` object
- **Animation speed**: Adjust `tension` and `friction` in spring animations
- **Scale effects**: Modify the `outputRange` for scale interpolation

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