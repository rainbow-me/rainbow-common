# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/)

## [Unreleased]
### Added
* ENS support

### Changed
* Update WalletConnect support
* Upped limit for OpenSea assets
* Fix for initially estimating gas
* Hitting transactions API directly

### Removed

## [0.6.44](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.44)
### Added
* Autorefresh for unique tokens

### Changed
* Fix incorrect gas limit estimation for ETH sent to smart contracts
* Remove transactions from pending list that have been dropped or replaced
* Parsing historical transactions and prices in chunks
* Cleared out check for sufficient gas and balance when clearing send fields

## [0.6.38](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.38)
### Removed
* Removed Matomo

## [0.6.37](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.37)
### Changed
* Updated Dapple endpoint

## [0.6.35](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.35)
### Added
* English tags for default transaction data
* Pass along dapp name in transaction details
* WBTC pricing support

### Changed
* Promisified transactions fetching
* Improved transaction handling for non-ETH and non direct token transfers

### Removed

## [0.6.14](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.14)
### Removed
* API key for CC

## [0.6.13](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.13)
### Changed
* Fixes for Send component for reselect assets

## [0.6.11](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.11)
### Changed
* Separate reducer for transactions, assets, prices, settings
* Promisified assets refresh

## [0.6.9](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.9)
### Changed
* Fix for native currency display on send
* Fix for USD tracking for total balances

## [0.6.8](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.8)
### Changed
* Fix for currency selection

## [0.6.6](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.6)
### Changed
* Fix for default asset selection in send

## [0.6.5](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.5)
### Changed
* Logic fix for clearing account redux

## [0.6.4](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.4)
### Added
* Fetch API prices with existing assets even if fetching new assets fails

## [0.6.3](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.3)
### Added
* Functions for handling WalletConnect sessions by Dapp name

## [0.6.2](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.2)
### Added
* English text for message signing

## [0.6.1](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.1)
### Added
* Support for total balances in USD for Piwik

### Changed
* Format for data used for Piwik

## [0.6.0](https://github.com/rainbow-me/rainbow-common/releases/tag/0.6.0)
### Added
* Piwik tracking
* CHANGELOG

### Changed
* Exposing additional data for NFTs
