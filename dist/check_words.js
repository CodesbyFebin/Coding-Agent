"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./src/content/registry");
var types_1 = require("./src/content/types");
console.log('Completed editorial count:', Object.values(registry_1.REGISTRY).filter(function (e) { return (0, types_1.wordCount)(e) >= 2000; }).length);
var below = [];
for (var _i = 0, _a = Object.entries(registry_1.REGISTRY); _i < _a.length; _i++) {
    var _b = _a[_i], id = _b[0], editorial = _b[1];
    var wc = (0, types_1.wordCount)(editorial);
    if (wc < 2000) {
        below.push({ id: id, wc: wc, editorial: editorial });
    }
}
console.log('Below 2000 words:', below.length);
below.sort(function (a, b) { return a.wc - b.wc; }).forEach(function (_a) {
    var id = _a.id, wc = _a.wc;
    console.log("".concat(id, ": ").concat(wc));
});
// Output the bottom 30 that need to be increased
console.log('\nBottom 30 to increase:');
below.slice(0, 30).forEach(function (_a) {
    var id = _a.id, wc = _a.wc;
    console.log("".concat(id, ": ").concat(wc, " (need ").concat(2000 - wc, " more words)"));
});
