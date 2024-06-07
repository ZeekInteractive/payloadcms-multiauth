"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerResponseEndpoint = exports.registerChallengeEndpoint = exports.multiAuthPreEndpoint = exports.multiAuthLoginEndpoint = exports.loginChallengeEndpoint = exports.loginResponseEndpoint = void 0;
var loginResponseEndpoint_1 = __importDefault(require("./loginResponseEndpoint"));
exports.loginResponseEndpoint = loginResponseEndpoint_1.default;
var loginChallengeEndpoint_1 = __importDefault(require("./loginChallengeEndpoint"));
exports.loginChallengeEndpoint = loginChallengeEndpoint_1.default;
var multiAuthLoginEndpoint_1 = __importDefault(require("./multiAuthLoginEndpoint"));
exports.multiAuthLoginEndpoint = multiAuthLoginEndpoint_1.default;
var multiAuthPreEndpoint_1 = __importDefault(require("./multiAuthPreEndpoint"));
exports.multiAuthPreEndpoint = multiAuthPreEndpoint_1.default;
var registerChallengeEndpoint_1 = __importDefault(require("./registerChallengeEndpoint"));
exports.registerChallengeEndpoint = registerChallengeEndpoint_1.default;
var registerResponseEndpoint_1 = __importDefault(require("./registerResponseEndpoint"));
exports.registerResponseEndpoint = registerResponseEndpoint_1.default;
