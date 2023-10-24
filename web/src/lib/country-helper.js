import CountryList from 'country-codes-list';
import CurrencyCodes from 'currency-codes';
import CurrencySymbolMap from './currency-symbol-map';

export default class CountryHelper {
    static getCountries = () => {
        return CountryList.all().map((item) => ({
            name: item.countryNameEn,
            dialingCode: item.countryCallingCode,
            isoCode: item.countryCode,
            currencyCode: item.currencyCode
        }))
    }

    static getCountry = (countryCode) => {
        const item = CountryList.findOne("countryCode", countryCode);
        if (item) return {
            name: item.countryNameEn,
            dialingCode: item.countryCallingCode,
            isoCode: item.countryCode,
            currencyCode: item.currencyCode
        }
        return null;
    }

    static getCurrencies = () => {
        let codes = CurrencyCodes.codes()
        return codes.map(code => {
            const currency = CurrencyCodes.code(code);
            return {
                name: currency.currency,
                code: currency.code,
                namePlural: currency.currency,
                symbol: CurrencySymbolMap[code],
                symbolNative: CurrencySymbolMap[code],
            }
        })
    }

    static getCurrency = (code) => {
        const currency = CurrencyCodes.code(code);
        if (currency) return {
            name: currency.currency,
            code: currency.code,
            namePlural: currency.currency,
            symbol: CurrencySymbolMap[code],
            symbolNative: CurrencySymbolMap[code],
        }

        return null;
    }
}

