/***************************************************************************************************************************
 * @license                                                                                                                *
 * Copyright 2017 Coinbase, Inc.                                                                                           *
 *                                                                                                                         *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance          *
 * with the License. You may obtain a copy of the License at                                                               *
 *                                                                                                                         *
 * http://www.apache.org/licenses/LICENSE-2.0                                                                              *
 *                                                                                                                         *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on     *
 * an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the                      *
 * License for the specific language governing permissions and limitations under the License.                              *
 ***************************************************************************************************************************/

import SimpleRateCalculator from '../FXService/calculators/SimpleRateCalculator';
import { ConsoleLoggerFactory, Logger } from '../utils/Logger';
import { FXProviderConfig } from '../FXService/FXProvider';
import ExchangeRatesAPIFXProvider from '../FXService/providers/ExchangeRatesAPIProvider';
import OpenExchangeProvider, { OpenExchangeConfig } from '../FXService/providers/OpenExchangeProvider';
import { FXService, FXServiceConfig } from '../FXService/FXService';
import CoinMarketCapProvider from '../FXService/providers/CoinMarketCapProvider';

/**
 * Describes FXProvider types - passed into factory functions in order to 
 * instantiate various FXProviders
 * NOTE: OpenExchangeRates requires the API key to be specifies in the 
 *       OPENEXCHANGERATE_KEY environment variable.
 */
type FXProviderType = 'exchangeratesapi' | 'openexchangerates' | 'coinmarketcap';

/**
 * Create and return a new FXProvider.
 * @param provider {FXProviderType} Type of FXProvider to create
 * @param logger {Logger} An existing logger object.
 * @constructor
 */
export function FXProviderFactory(provider: FXProviderType, logger: Logger) {
    const baseConfig: FXProviderConfig = {
        logger: logger
    };
    switch (provider) {
        case 'exchangeratesapi':
            return new ExchangeRatesAPIFXProvider(baseConfig);
        case 'openexchangerates':
            const config: OpenExchangeConfig = { ...baseConfig, apiKey: process.env.OPENEXCHANGERATE_KEY };
            return new OpenExchangeProvider(config);
        case 'coinmarketcap':
            return new CoinMarketCapProvider(baseConfig);
        default:
            return new ExchangeRatesAPIFXProvider(baseConfig);
    }
}

/**
 * Generate an return an FXService provider with sane defaults. If no arguments are specified, Yahoo Finance is used
 * as the sole provider using a SimpleRateCalculator instance.
 *
 * The returned FXService has a default refresh interval of 10 minutes. By default, no currency pairs are set, so a
 * recommended pattern is to set them directly after receiving the FXService, i.e.
 *
 * ```
 *   const service = SimpleFXServiceFactory().addCurrencyePair({ from: 'USD', to: 'EUR'});
 * ```
 *
 * @param provider {FXProviderType} Type of FXProvider to create
 * @param logger {Logger} If not specified a new ConsoleLogger will be created
 * @param refreshInterval {number} the period (in ms) to poll the underlying API for new prices
 */
export function SimpleFXServiceFactory(provider: FXProviderType = 'exchangeratesapi', logger?: Logger, refreshInterval?: number) {
    const log: Logger = logger || ConsoleLoggerFactory();
    const fxProvider = FXProviderFactory(provider, logger);
    const calculator = new SimpleRateCalculator(fxProvider, log);
    const config: FXServiceConfig = {
        logger: logger,
        refreshInterval: refreshInterval || 10 * 60 * 1000, // 10 minutes
        calculator: calculator
    };
    return new FXService(config);
}
