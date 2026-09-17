"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var registry_1 = require("./content/registry");
var types_1 = require("./content/types");
console.log('Number of entries in registry:', Object.keys(registry_1.REGISTRY).length);
var problematic = [];
for (var _i = 0, _a = Object.entries(registry_1.REGISTRY); _i < _a.length; _i++) {
    var _b = _a[_i], id = _b[0], editorial = _b[1];
    if (!editorial) {
        console.error("Editorial for ".concat(id, " is undefined or null"));
        problematic.push(id);
        continue;
    }
    try {
        var wc = (0, types_1.wordCount)(editorial);
        if (isNaN(wc)) {
            console.error("Word count for ".concat(id, " is NaN"));
            problematic.push(id);
        }
    }
    catch (e) {
        console.error("Error computing word count for ".concat(id, ":"), e);
        problematic.push(id);
    }
}
if (problematic.length === 0) {
    console.log('All editorials are valid.');
}
// Also check for duplicate pillarIds in the registry values (should not happen)
var pillarIds = Object.keys(registry_1.REGISTRY);
var duplicates = pillarIds.filter(function (id, index) { return pillarIds.indexOf(id) !== index; });
if (duplicates.length > 0) {
    console.error('Duplicate pillarIds in registry:', duplicates);
}
else {
    console.log('No duplicate pillarIds in registry.');
}
