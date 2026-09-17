"use strict";
// Structured long-form editorial content for pillar pages. Each completed
// pillar has a PillarEditorial; the PillarDetailPage renders it, the
// indexability policy gates the sitemap on its presence, and the prerender
// ships it in the initial HTML. Content is hand-authored — never generated
// boilerplate — per the claim-safety doctrine: architecture is described as
// design direction, and compliance/regulatory outcomes stay qualified.
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wordCount = wordCount;
function wordCount(e) {
    var _a;
    var parts = [e.definition];
    for (var _i = 0, _b = e.sections; _i < _b.length; _i++) {
        var s = _b[_i];
        parts.push.apply(parts, __spreadArray(__spreadArray([s.heading], s.paragraphs, false), ((_a = s.bullets) !== null && _a !== void 0 ? _a : []), false));
    }
    for (var _c = 0, _d = e.faq; _c < _d.length; _c++) {
        var f = _d[_c];
        parts.push(f.question, f.answer);
    }
    return parts.join(' ').split(/\s+/).filter(Boolean).length;
}
