"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnStrategy = exports.payloadWebAuthn = void 0;
var plugin_1 = require("./plugin");
Object.defineProperty(exports, "payloadWebAuthn", { enumerable: true, get: function () { return plugin_1.payloadWebAuthn; } });
var WebAuthnStrategy_1 = require("./strategies/WebAuthnStrategy");
Object.defineProperty(exports, "WebAuthnStrategy", { enumerable: true, get: function () { return WebAuthnStrategy_1.WebAuthnStrategy; } });
