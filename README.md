# Badminton Expense Splitter

A modern Next.js web application for splitting badminton expenses among players. Features a clean, mobile-friendly UI with a green/dark sports theme.

## Features

- **Setup Section**: Configure shuttlecock price per unit and total court fee
- **Player Management**: Add and remove players from your group
- **Game Logging**: Log games with 4 players (2 vs 2) and track shuttlecock usage
- **Live Summary**: Real-time cost calculations showing individual player costs
- **Data Persistence**: All data is saved to LocalStorage automatically
- **Mobile-Friendly**: Responsive design that works on all devices

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. **Setup**: Enter the shuttlecock price per unit and total court fee
2. **Add Players**: Add all players who will be splitting the expenses
3. **Log Games**: For each game, select 4 players (2 vs 2) and enter the number of shuttlecocks used
4. **View Summary**: See the total cost breakdown and individual player costs

## Cost Calculation

The app calculates costs as follows:
- Each player's shuttlecock cost = (Total shuttlecocks they used × Price per shuttlecock)
- Each player's court fee share = Total court fee ÷ Number of players
- Total cost per player = Shuttlecock cost + Court fee share

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **LocalStorage** - Data persistence
