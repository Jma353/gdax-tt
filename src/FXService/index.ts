import * as RobustCalculator from './calculators/RobustCalculator';
import SimpleRateCalculator from './calculators/SimpleRateCalculator';

export * from './FXService';
export * from './FXRateCalculator';
export * from './FXProvider';

import * as CoinMarketCapProvider from './providers/CoinMarketCapProvider';
import * as OpenExchangeProvider from './providers/OpenExchangeProvider';
import * as ExchangeRatesAPIProvider from './providers/ExchangeRatesAPIProvider';
import * as CryptoProvider from './providers/CryptoProvider';
import { FailoverProvider } from './providers/FailoverProvider';
import FailoverCalculator from './calculators/FailoverCalculator';

export const Providers = {
    CoinMarketCapProvider,
    OpenExchangeProvider,
    ExchangeRatesAPIProvider,
    CryptoProvider,
    FailoverProvider
};

export const Calculators = {
    SimpleRateCalculator,
    RobustCalculator,
    FailoverCalculator
};
