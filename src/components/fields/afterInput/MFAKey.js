"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var qrcode_react_1 = require("qrcode.react");
var MFAKey = function () {
    var _a, _b;
    var _c = (0, react_1.useState)(false), showQRCode = _c[0], setShowQRCode = _c[1];
    var email = (_a = document.getElementById('field-email')) === null || _a === void 0 ? void 0 : _a.value;
    var secret = (_b = document.getElementById('field-mfa_key')) === null || _b === void 0 ? void 0 : _b.value;
    // Return null if email or secret is not available
    if (!email || !secret) {
        return null;
    }
    var toggleQRCode = function (e) {
        e.preventDefault();
        setShowQRCode(function (prevShowQRCode) { return !prevShowQRCode; });
    };
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("a", { href: "#", onClick: toggleQRCode }, showQRCode ? 'Hide QR Code' : 'Show QR Code'),
        showQRCode && (react_1.default.createElement("div", null,
            react_1.default.createElement(qrcode_react_1.QRCodeSVG, { value: "otpauth://totp/Example:".concat(email, "?secret=").concat(secret, "&issuer=PayLoadCMS") })))));
};
exports.default = MFAKey;
