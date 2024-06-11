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
Object.defineProperty(exports, "__esModule", { value: true });
// src/components/Login.tsx
var react_1 = __importStar(require("react"));
var react_cookie_1 = require("react-cookie");
require("./index.scss");
var Login = function () {
    var _a = (0, react_cookie_1.useCookies)(['payload-token']), cookies = _a[0], setCookie = _a[1];
    var _b = (0, react_1.useState)(''), email = _b[0], setEmail = _b[1];
    var _c = (0, react_1.useState)(''), password = _c[0], setPassword = _c[1];
    var _d = (0, react_1.useState)(''), twoFaToken = _d[0], setTwoFaToken = _d[1];
    var _e = (0, react_1.useState)(null), authMethod = _e[0], setAuthMethod = _e[1];
    var _f = (0, react_1.useState)(null), error = _f[0], setError = _f[1];
    var handleEmailSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var response, data, errorData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch('/multi-auth/auth/pre', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: email }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log(data);
                    setAuthMethod(data.authMethod);
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    errorData = _a.sent();
                    setError(errorData.message || 'An error occurred');
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    setError('An error occurred. Please try again.');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleLoginSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var body, response, respJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setError(null);
                    console.log(email, password, twoFaToken, authMethod);
                    body = { email: email, password: password };
                    if (authMethod === 'password_2fa') {
                        body.token = twoFaToken;
                    }
                    return [4 /*yield*/, fetch('/multi-auth/auth/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(body),
                        })
                            .then(function (resp) {
                            return resp;
                        })
                            .catch(function (reqError) {
                            setError(reqError.message || 'Login failed');
                            return reqError;
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()
                        // if response is 200 continue
                    ];
                case 2:
                    respJson = _a.sent();
                    // if response is 200 continue
                    if (respJson) {
                        setCookie('payload-token', respJson.data.token, { path: '/' });
                        window.location.href = '/admin';
                    }
                    else {
                        setError(respJson.message || 'Login failed');
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handlePasskeyLogin = function () { return __awaiter(void 0, void 0, void 0, function () {
        var startAuthentication, module, elemSuccess, elemError, resp, respJson, asseResp, reqError_1, verificationResp, json, errorData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startAuthentication = null;
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@simplewebauthn/browser')); })];
                case 1:
                    module = _a.sent();
                    startAuthentication = module.startAuthentication;
                    elemSuccess = document.getElementById('success');
                    elemError = document.getElementById('error');
                    // check if the elements exist
                    if (!elemSuccess || !elemError) {
                        return [2 /*return*/];
                    }
                    // Reset success/error messages
                    elemSuccess.innerHTML = '';
                    elemError.innerHTML = '';
                    return [4 /*yield*/, fetch('/multi-auth/auth/challenge', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: email }),
                        })];
                case 2:
                    resp = _a.sent();
                    return [4 /*yield*/, resp.json()];
                case 3:
                    respJson = _a.sent();
                    console.log(respJson);
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, startAuthentication(respJson)];
                case 5:
                    // Pass the options to the authenticator and wait for a response
                    asseResp = _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    reqError_1 = _a.sent();
                    // Some basic error handling
                    elemError.innerText = reqError_1;
                    throw error;
                case 7:
                    console.log(asseResp);
                    return [4 /*yield*/, fetch('/multi-auth/auth/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: email, asseResp: asseResp }),
                        })];
                case 8:
                    verificationResp = _a.sent();
                    console.log(verificationResp);
                    if (!verificationResp.ok) return [3 /*break*/, 10];
                    return [4 /*yield*/, verificationResp.json()];
                case 9:
                    json = _a.sent();
                    setCookie('payload-token', json.data.token, { path: '/' });
                    window.location.href = '/admin';
                    return [3 /*break*/, 12];
                case 10: return [4 /*yield*/, verificationResp.json()];
                case 11:
                    errorData = _a.sent();
                    setError(errorData.message || 'Login failed');
                    _a.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    }); };
    // @ts-ignore
    return (react_1.default.createElement("div", { className: "custom-login" },
        react_1.default.createElement("h1", null, "Login"),
        !authMethod ? (react_1.default.createElement("form", { onSubmit: handleEmailSubmit },
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", null, "Email:"),
                react_1.default.createElement("input", { autoFocus: true, type: "email", value: email, onChange: function (e) { return setEmail(e.target.value); }, required: true })),
            error && react_1.default.createElement("p", null, error),
            react_1.default.createElement("button", { type: "submit" }, "Next"))) : (react_1.default.createElement("form", { onSubmit: handleLoginSubmit },
            react_1.default.createElement("div", null,
                react_1.default.createElement("label", null, "Email:"),
                react_1.default.createElement("input", { type: "email", value: email, onChange: function (e) { return setEmail(e.target.value); }, required: true })),
            authMethod !== 'webauthn' && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", null,
                    react_1.default.createElement("label", null, "Password:"),
                    react_1.default.createElement("input", { autoFocus: true, type: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, required: true })),
                authMethod === 'password_2fa' && (react_1.default.createElement("div", null,
                    react_1.default.createElement("label", null, "One Time Password:"),
                    react_1.default.createElement("input", { type: "text", value: twoFaToken, onChange: function (e) { return setTwoFaToken(e.target.value); }, required: true }))))),
            authMethod === 'webauthn' && (react_1.default.createElement("div", null,
                react_1.default.createElement("button", { type: "button", onClick: handlePasskeyLogin }, "Login with Passkey"),
                react_1.default.createElement("p", null, "Click the button to login with your security key"))),
            react_1.default.createElement("div", { id: "success" }),
            react_1.default.createElement("div", { id: "error" }),
            error && react_1.default.createElement("p", null, error),
            authMethod !== 'webauthn' && react_1.default.createElement("button", { type: "submit" }, "Login")))));
};
exports.default = Login;
