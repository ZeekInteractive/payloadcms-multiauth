"use strict";
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
var server_1 = require("@simplewebauthn/server");
var utils_1 = require("../utils");
var pluginConfig_1 = __importDefault(require("../pluginConfig"));
var registerChallengeEndpoint = {
    path: '/multi-auth/register/challenge',
    method: 'post',
    root: true,
    handler: function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
        var body, user, userPasskeys, rpName, rpID, options, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    if (!body.email) {
                        return [2 /*return*/, res.status(400).json({ message: 'Email is required' })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, (0, utils_1.getUserByEmail)(body.email, req.payload, pluginConfig_1.default.authCollectionSlug)];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, (0, utils_1.getUserPasskeys)(user, req.payload)];
                case 3:
                    userPasskeys = _a.sent();
                    rpName = pluginConfig_1.default.rpName;
                    rpID = pluginConfig_1.default.rpID;
                    return [4 /*yield*/, (0, server_1.generateRegistrationOptions)({
                            rpName: rpName,
                            rpID: rpID,
                            userName: user.email,
                            attestationType: 'none',
                            excludeCredentials: userPasskeys.map(function (passkey) { return ({
                                id: passkey.credentialID,
                            }); }),
                            authenticatorSelection: {
                                residentKey: 'preferred',
                                userVerification: 'preferred',
                                authenticatorAttachment: 'platform',
                            },
                        })
                        // save the options to the user
                    ];
                case 4:
                    options = _a.sent();
                    // save the options to the user
                    return [4 /*yield*/, req.payload.update({
                            collection: pluginConfig_1.default.authCollectionSlug,
                            id: user.id,
                            data: {
                                registrationOptions: options,
                            },
                        })
                        // Send the options back to the client
                    ];
                case 5:
                    // save the options to the user
                    _a.sent();
                    // Send the options back to the client
                    res.json(options);
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error processing request:', error_1);
                    res.status(500).send('Internal Server Error');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); },
};
exports.default = registerChallengeEndpoint;
