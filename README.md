# BigQuery Cost Estimator

A lightweight Chrome/Edge extension that calculates the estimated cost of your BigQuery queries directly in the Google BigQuery Console.

## Features

- **Cost Calculation:** Automatically reads the displayed query size and applies a standard price per TB rate (default: \$6.25/TB).
- **No Server Calls:** All cost calculations are performed locally; no data is transmitted to any external server.
- **Easy to Use:** Once installed, the Extension appends a simple cost estimate next to BigQuery’s own “Estimated to process…” text.

## Installation

1. **Download or Clone** this repository.
2. **Go to** `chrome://extensions` (Chrome) or `edge://extensions` (Edge).
3. **Enable** **Developer Mode** (usually found in the top-right corner).
4. **Load Unpacked** and select the folder containing `manifest.json`.
5. Reload the BigQuery Console. The cost estimate will appear automatically whenever the query size is displayed.

## Contributing

1. Fork this repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m "Add a cool feature"`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request describing your changes.

## Support and Contact

- If you encounter any issues or have suggestions, please open an issue on our [GitHub issues page](#).

## License

This project is released under [The Unlicense](https://unlicense.org/). By contributing, you agree to release your contributions under the same license.
