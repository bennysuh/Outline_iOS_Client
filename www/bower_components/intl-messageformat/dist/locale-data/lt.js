"use strict";

IntlMessageFormat.__addLocaleData({ "locale": "lt", "pluralRuleFunction": function pluralRuleFunction(n, ord) {
    var s = String(n).split("."),
        f = s[1] || "",
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);if (ord) return "other";return n10 == 1 && (n100 < 11 || n100 > 19) ? "one" : n10 >= 2 && n10 <= 9 && (n100 < 11 || n100 > 19) ? "few" : f != 0 ? "many" : "other";
  } });