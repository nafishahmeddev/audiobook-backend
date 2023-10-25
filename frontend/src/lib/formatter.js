import moment from "moment";
export default class Formatter {
    static dateTimeFormat = (dateTime, format = "DD.MM.YYYY hh:mm:ss A") => {
        const m = moment.utc(dateTime);
        if (m.isValid) return m.format(format);
        return dateTime;
    }

    static formatCurrency = (amount, currency, options = { maxFrac: 4 }) => {
        // try {
        //     return new Intl.NumberFormat("en-US", { style: "currency", currency: currency }).format(amount)
        // } catch (err) {
        return currency + " " + new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: options.maxFrac ?? 4 }).format(amount)
        // }
    }
    static titleCase = (str) => {
        str = (str ?? "").replace("_", " ").toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }
}