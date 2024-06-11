"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payloadWebAuthn = void 0;
var webpack_1 = require("./webpack");
var hi_base32_1 = __importDefault(require("hi-base32"));
var Login_1 = __importDefault(require("./components/views/Login"));
var totp_1 = require("@sunknudsen/totp");
var pluginConfig_1 = __importDefault(require("./pluginConfig"));
var Endpoints_1 = require("./endpoints/Endpoints");
var MFAKey_1 = __importDefault(require("./components/fields/afterInput/MFAKey"));
var payloadWebAuthn = function (pluginOptions) { return function (incomingConfig) { return __awaiter(void 0, void 0, void 0, function () {
    var config, webpack, MFAHook, collections, webAuthnUser, authenticators, endpoints;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        config = __assign({}, incomingConfig);
        webpack = (0, webpack_1.extendWebpackConfig)(incomingConfig);
        config.admin = __assign(__assign({}, (config.admin || {})), { webpack: webpack });
        // Check if the plugin is disabled; apply webpack changes regardless
        if (pluginOptions.enabled === false) {
            return [2 /*return*/, config];
        }
        MFAHook = function (_a) {
            var req = _a.req, context = _a.context, user = _a.user;
            return __awaiter(void 0, void 0, void 0, function () {
                var login;
                return __generator(this, function (_b) {
                    if (user.authMethod !== 'password_2fa') {
                        return [2 /*return*/];
                    }
                    login = (0, totp_1.validateToken)(user.mfa_key, req.body.token);
                    if (!login) {
                        throw new Error('Invalid token');
                    }
                    return [2 /*return*/];
                });
            });
        };
        config.admin = __assign(__assign({}, (config.admin || {})), { components: __assign(__assign({}, (((_a = config.admin) === null || _a === void 0 ? void 0 : _a.components) || {})), { views: __assign(__assign({}, (((_c = (_b = config.admin) === null || _b === void 0 ? void 0 : _b.components) === null || _c === void 0 ? void 0 : _c.views) || {})), { CustomLogin: {
                        path: '/login-2fa',
                        Component: Login_1.default,
                    } }) }), user: pluginConfig_1.default.authCollectionSlug });
        collections = config.collections || [];
        webAuthnUser = {
            slug: pluginConfig_1.default.authCollectionSlug,
            hooks: {
                beforeLogin: process.env.PAYLOAD_PUBLIC_ENABLE_MFA === '1' ? [MFAHook] : [],
            },
            auth: {
                tokenExpiration: 86400,
                maxLoginAttempts: 3,
                lockTime: 600 * 1000
            },
            fields: [
                {
                    name: 'email',
                    label: 'Email',
                    type: 'text',
                    required: true,
                    unique: true,
                },
                {
                    name: 'registrationOptions',
                    label: 'Registration Options',
                    type: 'json',
                    admin: {
                        hidden: true,
                        readOnly: true,
                    },
                },
                {
                    name: 'authMethod',
                    label: 'Authentication Method',
                    type: 'select',
                    required: true,
                    defaultValue: 'password',
                    options: [
                        {
                            label: 'Password',
                            value: 'password',
                        },
                        {
                            label: 'Password + 2FA',
                            value: 'password_2fa',
                        },
                        {
                            label: 'Passkey',
                            value: 'webauthn',
                        },
                    ],
                },
                {
                    label: 'MFA Key',
                    name: 'mfa_key',
                    type: 'text',
                    defaultValue: function () { return (0, totp_1.generateSecret)(20); },
                    admin: {
                        readOnly: true,
                        components: {
                            afterInput: [MFAKey_1.default]
                        }
                    },
                },
                {
                    label: 'MFA Google Key',
                    name: 'google_mfa_key',
                    type: 'text',
                    hooks: {
                        beforeChange: [
                            function (data) {
                                return hi_base32_1.default.encode(data.siblingData.mfa_key);
                            },
                        ],
                    },
                    admin: {
                        hidden: true,
                        readOnly: true,
                        description: 'Enter this key into Google Authenticator. Save to see updated value.',
                    },
                },
            ],
        };
        authenticators = {
            slug: 'authenticators',
            admin: {
                hidden: true,
            },
            fields: [
                {
                    name: 'user',
                    label: 'User',
                    type: 'relationship',
                    relationTo: pluginConfig_1.default.authCollectionSlug,
                    required: true,
                    hasMany: false,
                },
                {
                    name: 'credentialID',
                    label: 'Credential ID',
                    type: 'text',
                    required: true,
                    unique: true,
                },
                {
                    name: 'publicKey',
                    label: 'Public Key',
                    type: 'text',
                    required: true,
                    hooks: {
                        beforeChange: [
                            function (_a) {
                                var value = _a.value;
                                return JSON.stringify(value);
                            }
                        ],
                        afterRead: [
                            function (_a) {
                                var value = _a.value;
                                return new Uint8Array(JSON.parse(value).buffer);
                            }
                        ],
                    }
                },
                {
                    name: 'webAuthnUserID',
                    label: 'WebAuthn User ID',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'counter',
                    label: 'Counter',
                    type: 'number',
                    required: true,
                },
                {
                    name: 'deviceType',
                    label: 'Device Type',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'backedUp',
                    label: 'Backed Up',
                    type: 'checkbox',
                    required: true,
                },
                {
                    name: 'transports',
                    label: 'Transports',
                    type: 'text',
                    required: true,
                }
            ],
        };
        config.collections = __spreadArray(__spreadArray([], collections, true), [
            webAuthnUser,
            authenticators,
        ], false);
        endpoints = config.endpoints || [];
        config.endpoints = __spreadArray(__spreadArray([], endpoints, true), [
            Endpoints_1.registerResponseEndpoint,
            Endpoints_1.registerChallengeEndpoint,
            Endpoints_1.loginChallengeEndpoint,
            Endpoints_1.loginResponseEndpoint,
            Endpoints_1.multiAuthPreEndpoint,
            Endpoints_1.multiAuthLoginEndpoint
        ], false);
        return [2 /*return*/, config];
    });
}); }; };
exports.payloadWebAuthn = payloadWebAuthn;
