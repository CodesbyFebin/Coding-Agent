"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.browserVerification = void 0;
// Editorial converted from the reviewed pillar-database source. Claim-audited.
exports.browserVerification = {
    "pillarId": "browser-verification",
    "updated": "2026-09-24",
    "definition": "Headless browser execution (Playwright, Puppeteer) capturing screenshots, DOM snapshots, and console logs of frontend UI changes — verifying visual rendering, responsive layout fidelity, and browser runtime console errors.",
    "sections": [
        {
            "heading": "Browser Verification Fundamentals",
            "paragraphs": [
                "Browser verification provides headless execution of frontend code using tools like Playwright or Puppeteer, capturing comprehensive evidence of the rendering result. This is essential for agents that modify frontend code, generate React components, or update CSS, as it ensures that the visual output matches the intended design and does not introduce regressions. The verification captures: screenshots of the rendered page at key viewport sizes, DOM snapshots showing the HTML structure and component hierarchy, and console logs recording JavaScript errors, deprecation warnings, and other runtime events.",
                "Without browser verification, an agent could generate frontend code that is syntactically correct but visually broken: broken layouts, missing components, JavaScript errors that crash the page, or responsive design failures on mobile devices. Browser verification provides objective, evidence-based confirmation that the generated code works correctly in the browser."
            ]
        },
        {
            "heading": "Visual Regression Testing",
            "paragraphs": [
                "The system supports visual regression testing by capturing screenshots at multiple viewport sizes (mobile, tablet, desktop) and comparing them against baseline images using pixel-diff analysis. The pixel-diff reports: the percentage of pixels that differ, the location of differences on the page, and a confidence score indicating whether the changes are expected (e.g., a dynamic timestamp) or unexpected (a layout shift). Changes below a configurable threshold are considered acceptable, while changes above the threshold are flagged for reviewer examination.",
                "The system also supports accessibility regression: checking that the generated HTML maintains appropriate ARIA labels, heading hierarchy, and color contrast. Automated accessibility checks (axe-core) are run on the rendered page, and the results are included in the verification evidence.",
                "Visual regression testing is particularly valuable for: component library updates (ensuring new components don't break existing ones), responsive design changes (ensuring the layout adapts correctly to different screen sizes), and theme changes (ensuring light and dark modes both work correctly)."
            ]
        },
        {
            "heading": "Console Error and Runtime Validation",
            "paragraphs": [
                "The system captures the browser's console log, which includes JavaScript errors, deprecation warnings, and runtime events. Each console entry is classified by type (error, warning, info, log) and includes the message, source file, line number, and column. Errors and warnings are flagged as verification failures, while informational logs are included as evidence but do not cause the mission to fail.",
                "Runtime validation includes: checking that all expected global objects are defined, verifying that polyfills are in place for browser compatibility, and ensuring that the page's network requests complete successfully (no failed fetches or CORS errors). This comprehensive runtime check ensures that the generated frontend code not only renders correctly but also functions correctly in the browser.",
                "The console log and runtime validation results are included in the mission's audit evidence, providing full visibility into any browser-side issues that arose during the agent's execution."
            ]
        }
    ],
    "faq": [
        {
            "question": "What is browser verification?",
            "answer": "Headless browser execution (Playwright, Puppeteer) capturing screenshots, DOM snapshots, and console logs of frontend UI changes, verifying visual rendering, responsive layout fidelity, and browser runtime console errors."
        },
        {
            "question": "How does visual regression testing work?",
            "answer": "Captures screenshots at multiple viewport sizes and compares against baseline images using pixel-diff analysis. Reports percentage of pixels differing, location of differences, and confidence score for expected vs. unexpected changes."
        },
        {
            "question": "What console errors are captured?",
            "answer": "JavaScript errors, deprecation warnings, and runtime events. Each includes message, source file, line number, and column. Errors and warnings flagged as verification failures; informational logs included as evidence."
        },
        {
            "question": "Can this test responsive design?",
            "answer": "Yes. Screenshots are captured at multiple viewport sizes (mobile, tablet, desktop), and pixel-diff analysis reports differences at each size."
        },
        {
            "question": "How are accessibility issues handled?",
            "answer": "The system runs automated accessibility checks (axe-core) on the rendered page and includes results in the verification evidence. Issues are flagged as part of the mission's evidence."
        }
    ],
    "sources": [
        {
            "label": "CodingAgent source repository",
            "href": "https://github.com/CodesbyFebin/Coding-Agent"
        }
    ]
};
