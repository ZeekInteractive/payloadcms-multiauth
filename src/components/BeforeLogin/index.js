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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
require("./index.scss");
var baseClass = 'before-login';
var BeforeLogin = function () {
    var handleRegisterCLick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var startRegistration, module;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startRegistration = null;
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@simplewebauthn/browser')); })];
                case 1:
                    module = _b.sent();
                    startRegistration = module.startRegistration;
                    // add on click event to the button
                    (_a = document.getElementById("btnBeginAuth")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var elemSuccess, elemError, resp, attResp, _a, error_1, verificationResp, verificationJSON;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    elemSuccess = document.getElementById('success');
                                    elemError = document.getElementById('error');
                                    // check if the elements exist
                                    if (!elemSuccess || !elemError) {
                                        return [2 /*return*/];
                                    }
                                    // Reset success/error messages
                                    elemSuccess.innerHTML = '';
                                    elemError.innerHTML = '';
                                    return [4 /*yield*/, fetch('/multi-auth/register/challenge', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ email: 'ivan+test@zeek.com' }),
                                        })];
                                case 1:
                                    resp = _b.sent();
                                    if (!resp.ok) {
                                        elemError.innerText = "Error: ".concat(resp.status, " ").concat(resp.statusText);
                                        return [2 /*return*/];
                                    }
                                    _b.label = 2;
                                case 2:
                                    _b.trys.push([2, 5, , 6]);
                                    _a = startRegistration;
                                    return [4 /*yield*/, resp.json()];
                                case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                                case 4:
                                    // Pass the options to the authenticator and wait for a response
                                    attResp = _b.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_1 = _b.sent();
                                    // Some basic error handling
                                    if (error_1.name === 'InvalidStateError') {
                                        elemError.innerText = 'Error: Authenticator was probably already registered by user';
                                    }
                                    else {
                                        elemError.innerText = error_1;
                                    }
                                    console.log(error_1);
                                    throw error_1;
                                case 6: return [4 /*yield*/, fetch('/multi-auth/register/verify', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(attResp),
                                    })
                                    // Wait for the results of verification
                                ];
                                case 7:
                                    verificationResp = _b.sent();
                                    return [4 /*yield*/, verificationResp.json()
                                        // Show UI appropriate for the `verified` status
                                    ];
                                case 8:
                                    verificationJSON = _b.sent();
                                    // Show UI appropriate for the `verified` status
                                    if (verificationJSON && verificationJSON.verified) {
                                        elemSuccess.innerHTML = 'Success!';
                                    }
                                    else {
                                        elemError.innerHTML = "Oh no, something went wrong! Response: <pre>".concat(JSON.stringify(verificationJSON), "</pre>");
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); };
    var handleLoginCLick = function () { return __awaiter(void 0, void 0, void 0, function () {
        var startAuthentication, module;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    startAuthentication = null;
                    return [4 /*yield*/, Promise.resolve().then(function () { return __importStar(require('@simplewebauthn/browser')); })];
                case 1:
                    module = _b.sent();
                    startAuthentication = module.startAuthentication;
                    // add on click event to the button
                    (_a = document.getElementById("btnBeginLogin")) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () { return __awaiter(void 0, void 0, void 0, function () {
                        var elemSuccess, elemError, resp, asseResp, _a, error_2, verificationResp, verificationJSON;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    elemSuccess = document.getElementById('success');
                                    elemError = document.getElementById('error');
                                    // check if the elements exist
                                    if (!elemSuccess || !elemError) {
                                        return [2 /*return*/];
                                    }
                                    // Reset success/error messages
                                    elemSuccess.innerHTML = '';
                                    elemError.innerHTML = '';
                                    return [4 /*yield*/, fetch('/multi-auth/auth/challenge')];
                                case 1:
                                    resp = _b.sent();
                                    _b.label = 2;
                                case 2:
                                    _b.trys.push([2, 5, , 6]);
                                    _a = startAuthentication;
                                    return [4 /*yield*/, resp.json()];
                                case 3: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                                case 4:
                                    // Pass the options to the authenticator and wait for a response
                                    asseResp = _b.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    error_2 = _b.sent();
                                    // Some basic error handling
                                    elemError.innerText = error_2;
                                    throw error_2;
                                case 6: return [4 /*yield*/, fetch('/multi-auth/auth/verify', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(asseResp),
                                    })
                                    // Wait for the results of verification
                                ];
                                case 7:
                                    verificationResp = _b.sent();
                                    return [4 /*yield*/, verificationResp.json()
                                        // Show UI appropriate for the `verified` status
                                    ];
                                case 8:
                                    verificationJSON = _b.sent();
                                    // Show UI appropriate for the `verified` status
                                    if (verificationJSON && verificationJSON.verified) {
                                        elemSuccess.innerHTML = 'Success!';
                                    }
                                    else {
                                        elemError.innerHTML = "Oh no, something went wrong! Response: <pre>".concat(JSON.stringify(verificationJSON), "</pre>");
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [2 /*return*/];
            }
        });
    }); };
    return (react_1.default.createElement("div", { className: baseClass },
        react_1.default.createElement("button", { id: "btnBeginAuth", onClick: handleRegisterCLick }, "Register WebAuthn Authenticator"),
        react_1.default.createElement("button", { id: "btnBeginLogin", onClick: handleLoginCLick }, "Login with WebAuthn Authenticator"),
        react_1.default.createElement("p", { id: "success" }),
        react_1.default.createElement("p", { id: "error" }),
        react_1.default.createElement("h4", null, "This component was added by the plugin")));
};
exports.default = BeforeLogin;
