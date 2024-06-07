"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebAuthnStrategy = void 0;
var passport_strategy_1 = require("passport-strategy");
var server_1 = require("@simplewebauthn/server");
var WebAuthnStrategy = /** @class */ (function (_super) {
    __extends(WebAuthnStrategy, _super);
    // eslint-disable-next-line @typescript-eslint/no-parameter-properties
    function WebAuthnStrategy(getUserAuthenticators) {
        var _this = _super.call(this) || this;
        _this.name = 'webauthn';
        _this.getUserAuthenticators = getUserAuthenticators;
        return _this;
    }
    // eslint-disable-next-line consistent-return
    WebAuthnStrategy.prototype.authenticate = function (req, options) {
        var _this = this;
        var _a;
        var _b = req.body, username = _b.username, response = _b.response;
        if (!response || !((_a = req.session) === null || _a === void 0 ? void 0 : _a.challenge)) {
            return this.fail('Missing response data or session challenge', 400);
        }
        var user = req.user; // Assume user is already populated by prior middleware
        if (!user) {
            return this.fail('User not found', 404);
        }
        var authenticators = this.getUserAuthenticators(user.id);
        if (!authenticators.length) {
            return this.fail('No registered devices', 404);
        }
        var expectedChallenge = req.session.challenge;
        (0, server_1.verifyAuthenticationResponse)({
            credential: response,
            expectedChallenge: expectedChallenge,
            expectedOrigin: 'https://your.domain.com',
            expectedRPID: 'your.domain.com',
            authenticator: authenticators[0], // Assuming the first registered device
        })
            .then(function (verification) {
            if (verification.verified) {
                return _this.success(user);
            }
            return _this.fail('Verification failed', 401);
        })
            .catch(function (err) {
            return _this.error(err);
        });
    };
    return WebAuthnStrategy;
}(passport_strategy_1.Strategy));
exports.WebAuthnStrategy = WebAuthnStrategy;
