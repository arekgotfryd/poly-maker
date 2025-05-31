# Poly-Maker

A market making bot for Polymarket prediction markets. This bot automates the process of providing liquidity to markets on Polymarket by maintaining orders on both sides of the book with configurable parameters. A summary of my experience running this bot is available [here](https://x.com/defiance_cr/status/1906774862254800934)

## Overview

Poly-Maker is a comprehensive solution for automated market making on Polymarket. It includes:

- Real-time order book monitoring via WebSockets
- Position management with risk controls
- Customizable trade parameters fetched from Google Sheets
- Automated position merging functionality
- Sophisticated spread and price management

## Structure

The repository consists of several interconnected modules:

- `poly_data`: Core data management and market making logic
- `poly_merger`: Utility for merging positions (based on open-source Polymarket code)
- `poly_stats`: Account statistics tracking
- `poly_utils`: Shared utility functions
- `data_updater`: Separate module for collecting market information

## Requirements

- Python 3.8+
- Node.js (for poly_merger)
- Google Sheets API credentials
- Polymarket account and API credentials

## Installation

1. **Clone the repository**:
```
git clone https://github.com/yourusername/poly-maker.git
cd poly-maker
```

2. **Setup python and Install python dependencies**:
```
pyenv install 3.9.18  
```
```
pyenv local 3.9.18  
```
```
pyenv exec python -m pip install --upgrade pip
```
```
pyenv exec pip install -r requirements.txt
```
```
pip install -r requirements.txt
```

3. **Install Node.js dependencies for the merger**:
```
cd poly_merger
npm install
cd ..
```

4. **Set up environment variables**:
```
cp .env.example .env
```

5. **Configure your credentials in `.env`**:
- `PK`: Your private key for Polymarket
- `BROWSER_ADDRESS`: Your wallet address

Make sure your wallet has done at least one trade thru the UI so that the permissions are proper.

6. **Set up Google Sheets integration**:
   - Create a Google Service Account and download credentials to the main directory as `credentials.json` file
   - Copy the [sample Google Sheet](https://docs.google.com/spreadsheets/d/1Kt6yGY7CZpB75cLJJAdWo7LSp9Oz7pjqfuVWwgtn7Ns/edit?gid=1884499063#gid=1884499063)
   - Add your Google service account to the sheet with edit permissions
   - Update `SPREADSHEET_URL` in your `.env` file

7. **Update market data**:
   - Run `python update_markets.py` to fetch all available markets
   - This should run continuously in the background (preferably on a different IP than your trading bot)
   - Add markets you want to trade to the "Selected Markets" sheet. You'd wanna select markets from the "Volatility Markets" sheet.
   - Configure corresponding parameters in the "Hyperparameters" sheet. Default parameters that worked well in November are there.

8. **Start the market making bot**:
```
python main.py
```

## Configuration

The bot is configured via a Google Spreadsheet with several worksheets:

- **Selected Markets**: Markets you want to trade
- **All Markets**: Database of all markets on Polymarket
- **Hyperparameters**: Configuration parameters for the trading logic

## Usage

### Data Collection

Before running the main bot, you need to gather market data:

```
cd data_updater
python find_markets.py
```

This will populate your Google Sheet with available markets.

### Running the Bot

Start the market maker:

```
python main.py
```

The bot will:
1. Connect to Polymarket API
2. Subscribe to market data via WebSockets
3. Place and manage orders according to your configuration
4. Monitor and merge positions when beneficial

## Notes on poly_merger

The `poly_merger` module is a particularly powerful utility that handles position merging on Polymarket. It's built on open-source Polymarket code and provides a smooth way to consolidate positions, reducing gas fees and improving capital efficiency.

## Important Notes

- This code interacts with real markets and can potentially lose real money
- Test thoroughly with small amounts before deploying with significant capital
- The `data_updater` is technically a separate repository but is included here for convenience
- The `find_markets.py` script in the data_updater is essential for the bot to get market information

## License

MIT