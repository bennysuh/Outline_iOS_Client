"use strict";

IntlMessageFormat.__addLocaleData({ "locale": "sk", "pluralRuleFunction": function pluralRuleFunction(n, ord) {
    var s = String(n).split("."),
        i = s[0],
        v0 = !s[1];if (ord) return "other";return n == 1 && v0 ? "one" : i >= 2 && i <= 4 && v0 ? "few" : !v0 ? "many" : "other";
  } });