import { Strategy } from 'passport-strategy'
import type { Request } from 'express'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import type { VerifiedAuthenticationResponse } from '@simplewebauthn/typescript-types'
import {Authenticator} from "passport";

export class WebAuthnStrategy extends Strategy {
  name = 'webauthn'
  getUserAuthenticators: (userId: string) => Authenticator[]

  // eslint-disable-next-line @typescript-eslint/no-parameter-properties
  constructor(getUserAuthenticators: (userId: string) => Authenticator[]) {
    super()
    this.getUserAuthenticators = getUserAuthenticators
  }

  // eslint-disable-next-line consistent-return
  authenticate(req: Request, options?: any): void {
    const { username, response } = req.body
    if (!response || !req.session?.challenge) {
      return this.fail('Missing response data or session challenge', 400)
    }

    const user = req.user // Assume user is already populated by prior middleware
    if (!user) {
      return this.fail('User not found', 404)
    }

    const authenticators = this.getUserAuthenticators(user.id)
    if (!authenticators.length) {
      return this.fail('No registered devices', 404)
    }

    const expectedChallenge = req.session.challenge

    verifyAuthenticationResponse({
      credential: response,
      expectedChallenge,
      expectedOrigin: 'https://your.domain.com', // Replace with your actual domain
      expectedRPID: 'your.domain.com', // Replace with your actual RP ID
      authenticator: authenticators[0], // Assuming the first registered device
    })
      .then((verification: VerifiedAuthenticationResponse) => {
        if (verification.verified) {
          return this.success(user)
        }
        return this.fail('Verification failed', 401)
      })
      .catch(err => {
        return this.error(err)
      })
  }
}
