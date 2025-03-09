# Kurta MY Admin Color System

This document outlines the color system and styling guidelines for the Kurta MY Admin interface.

## Color Variables

Our color system is defined in `colors.css` using CSS custom properties. These variables ensure consistency across the application.

### Base Colors
- `--color-neutral-950`: #0a0a0a (Primary background)
- `--color-neutral-900`: #171717 (Secondary background)
- `--color-neutral-800`: #262626 (Borders)
- `--color-neutral-400`: #a3a3a3 (Secondary text)
- `--color-white`: #ffffff (Primary text)

### Status Colors
- Success: `--color-success` (#22c55e)
- Warning: `--color-warning` (#eab308)
- Error: `--color-error` (#ef4444)
- Info: `--color-info` (#3b82f6)

Each status color has a light variant (10% opacity) for backgrounds:
- `--color-success-light`
- `--color-warning-light`
- `--color-error-light`
- `--color-info-light`

## Utility Classes

### Background Classes
- `.bg-card`: Primary card background with border
- `.bg-hover`: Hover state background

### Text Classes
- `.text-primary`: Primary text color (white)
- `.text-secondary`: Secondary text color (neutral-400)

### Status Classes
- `.status-completed`: Green background with text
- `.status-pending`: Yellow background with text
- `.status-processing`: Blue background with text
- `.status-cancelled`: Red background with text

## Usage Guidelines

1. **Cards and Containers**
   - Use `bg-card` for card backgrounds
   - Use `border-neutral-800` for borders
   - Use `bg-hover` for hover states

2. **Typography**
   - Use `text-primary` for main headings and important text
   - Use `text-secondary` for supporting text and labels
   - Use `text-info` for links and interactive elements

3. **Status Indicators**
   - Use appropriate status classes for order states
   - Use light variants for status backgrounds
   - Use full colors for status text

4. **Charts and Data Visualization**
   - Use status colors for different data series
   - Use light variants for backgrounds
   - Maintain consistent color meaning across visualizations

## Examples

```tsx
// Card example
<Card className="bg-card">
  <h2 className="text-primary">Card Title</h2>
  <p className="text-secondary">Supporting text</p>
</Card>

// Status badge example
<span className="status-completed">
  Completed
</span>

// Interactive element example
<Link className="text-info hover:text-info/80">
  Click me
</Link>
```

## Accessibility

- Maintain a minimum contrast ratio of 4.5:1 for text
- Use semantic HTML elements
- Provide hover and focus states for interactive elements
- Include ARIA labels where necessary 