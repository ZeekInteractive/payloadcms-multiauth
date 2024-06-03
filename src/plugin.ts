import { extendWebpackConfig } from './webpack'
import { WebAuthnStrategy } from './strategies/WebAuthnStrategy'
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} from '@simplewebauthn/server'
import type { PluginTypes } from './types'
import type {Config, Endpoint, Plugin} from 'payload/config'
import {CollectionBeforeLoginHook, CollectionConfig } from 'payload/dist/exports/types'
import BeforeLogin from "./components/BeforeLogin"
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types'
import { getUserPasskeys } from './utils'
import Passkey from './types/Passkey'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import base32 from 'hi-base32'
import Login from "./components/views/Login";
import { nanoid } from 'nanoid'
import {
  generateSecret,
  validateToken,
} from "@sunknudsen/totp"
import { randomBytes } from 'crypto'
import {CollectionAfterChangeHook} from "payload/types";

export const payloadWebAuthn: (pluginOptions: PluginTypes) => Plugin = (pluginOptions) => async (incomingConfig) => {
  let config: Config = {...incomingConfig}

  // Extend the webpack configuration if needed
  const webpack = extendWebpackConfig(incomingConfig);
  const collectionSlug = 'webauthn-users';
  async function loadSimpleWebAuthn() {
    const simpleWebAuthn = await import('@simplewebauthn/browser');
  }

  config.admin = {
    ...(config.admin || {}),
    webpack,
  };

  // Check if the plugin is disabled; apply webpack changes regardless
  if (pluginOptions.enabled === false) {
    return config;
  }

  const getUserByEmail = async (email: string, payload: any) => {
    const users = await payload.find({
      collection: collectionSlug,
      where: {email: {equals: email}},
      depth: 2,
    });

    if (!users || users.length === 0) {
      return null;
    }

    return users.docs[0];
  }

  const MFAHook: CollectionBeforeLoginHook = async ({req, context, user}) => {
    if (user.authMethod !== 'password_2fa') {
      return
    }

    let login = validateToken(user.mfa_key, req.body.token);
    if (!login) {
      throw new Error('Invalid token')
    }
  }

  config.admin = {
    ...(config.admin || {}),
    components: {
      ...(config.admin?.components || {}),
      beforeLogin: [BeforeLogin],
      views: {
        ...(config.admin?.components?.views || {}),
        CustomLogin: {
          path: '/login-2fa',
          Component: Login,
        }

      },
    },
    user: collectionSlug,
  };

  let collections = config.collections || [];

  const webAuthnUser: CollectionConfig = {
    slug: collectionSlug,
    hooks: {
      beforeLogin:
        process.env.PAYLOAD_PUBLIC_ENABLE_MFA === '1' ? [MFAHook] : [],
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
        required: true,
        admin: {
          readOnly: true,
        },
        defaultValue: () => generateSecret(20),
      },
      {
        label: 'MFA Google Key',
        name: 'google_mfa_key',
        type: 'text',
        admin: {
          hidden: true,
          readOnly: true,
        },
        hooks: {
          beforeChange: [
            (data) => {
              return base32.encode(data.siblingData.mfa_key)
            },
          ],
        },
        admin: {
          readOnly: true,
          description:
            'Enter this key into Google Authenticator.  Save to see updated value.',
        },
      },
    ],
  };

  const authenticators: CollectionConfig = {
    slug: 'authenticators',
    admin: {
      hidden: true,
    },
    fields: [
      {
        name: 'user',
        label: 'User',
        type: 'relationship',
        relationTo: collectionSlug,
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
            ({value}) => {
              return JSON.stringify(value)
            }
          ],
          afterRead: [
            ({value}) => {
              return JSON.parse(value)
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

  config.collections = [
    ...collections,
    webAuthnUser,
    authenticators,
  ]

  let endpoints = config.endpoints || [];

  const testEndpoint: Endpoint = {
    path: '/test',
    method: 'get',
    handler: (req, res) => {
      return res.json({message: 'Hello, world!'})
    },
  };

  const registerChallengeEndpoint: Endpoint = {
    path: '/multi-auth/register/challenge',
    method: 'post',
    root: true,
    handler: async (req, res) => {
      let body = req.body;

      if (!body.email) {
        return res.status(400).json({message: 'Email is required'});
      }

      try {
        // Retrieve the user from the database
        const users = await req.payload.find({
          collection: collectionSlug,
          where: {email: {equals: body.email}},
          depth: 2
        });

        if (!users || users.length === 0) {
          return res.status(404).send('User not found');
        }

        // @ts-ignore
        const user = users.docs[0];
        console.log(user)
        const userPasskeys = await getUserPasskeys(user, req.payload);
        const rpName = 'PayloadCMS WebAuthn Example';
        const rpID = 'localhost';
        const origin = `http://${rpID}:3000`;

        // Generate registration options
        const options = await generateRegistrationOptions({
          rpName,
          rpID,
          userName: user.email,
          attestationType: 'none',
          excludeCredentials: userPasskeys.map((passkey: { credentialID: any; transports: any; }) => ({
            id: passkey.credentialID,
          })),
          authenticatorSelection: {
            residentKey: 'preferred',
            userVerification: 'preferred',
            authenticatorAttachment: 'platform',
          },
        });

        // save the options to the user
        await req.payload.update({
          collection: collectionSlug,
          id: user.id,
          data: {
            registrationOptions: options,
          },
        });

        // Send the options back to the client
        res.json(options);
      } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Internal Server Error');
      }
    },
  };

  // add verify-registration endpoint
  const registerResponseEndpoint: Endpoint = {
    path: '/multi-auth/register/verify',
    method: 'post',
    root: true,
    handler: async (req, res) => {
      let body = req.body;
      const users = await req.payload.find({
        collection: collectionSlug,
        where: {email: {equals: 'ivan+test@zeek.com'}},
        depth: 2,
      });

      if (!users || users.length === 0) {
        return res.status(404).send('User not found');
      }

      // @ts-ignore
      const user = users.docs[0];
      console.log("verify")
      // @ts-ignore
      const currentOptions: PublicKeyCredentialCreationOptionsJSON = user.registrationOptions;
      let verification;
      try {
        verification = await verifyRegistrationResponse({
          response: body,
          expectedChallenge: currentOptions.challenge,
          expectedOrigin: 'http://localhost:3000',
          expectedRPID: 'localhost',
        });
      } catch (error) {
        console.error(error);
        return res.status(400).send({error: error.message});
      }

      const {verified} = verification;
      const {registrationInfo} = verification;
      const {
        credentialID,
        credentialPublicKey,
        counter,
        credentialDeviceType,
        credentialBackedUp,
      } = registrationInfo;

      const newPasskey: Passkey = {
        user: user.id,
        webAuthnUserID: currentOptions.user.id,
        credentialID: credentialID,
        publicKey: credentialPublicKey,
        counter,
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: body.response.transports.join(','),
      };

      // Save the new passkey to the database
      const payload = await req.payload.create({
        collection: 'authenticators',
        data: newPasskey,
      });

      return res.json({verified});

    },
  };

  const loginChallengeEndpoint: Endpoint = {
    path: '/multi-auth/auth/challenge',
    method: 'post',
    root: true,
    handler: async (req, res) => {
      if (!req.body || !req.body.email) {
        return res.status(400).json({message: 'Email missing'});
      }

      const user = await getUserByEmail(req.body.email, req.payload);
      const userPasskeys = await getUserPasskeys(user, req.payload);

      const options = await generateAuthenticationOptions({
        rpID: 'localhost', // Use your actual domain in production
        allowCredentials: userPasskeys.map((passkey: { credentialID: any; }) => ({
          id: passkey.credentialID,
          type: 'public-key',
          transports: ['usb', 'nfc', 'ble', 'internal'],
          challenge: passkey.challenge,
        })),
        userVerification: 'preferred',
      });
      console.log(options)
      await req.payload.update({
        collection: collectionSlug,
        id: user.id,
        data: {options} as any,
      })
      res.json(options);

      return res;
    },
  };

  const loginResponseEndpoint: Endpoint = {
    path: '/multi-auth/auth/verify',
    method: 'post',
    root: true,
    handler: async (req, res) => {
      const { body } = req;
      if (!body) {
        return res.status(400).json({message: 'Malformed request'});
      }

      const user = await getUserByEmail('ivan+test@zeek.com', req.payload);
      const passkeys = await getUserPasskeys(user, req.payload);
      const passkey = passkeys.find((passkey: { credentialID: any; }) => passkey.credentialID === body.id);

      if (!passkey) {
        return res.status(401).json({message: 'Invalid credentials'});
      }

      // let verification;
      // try {
      //   verification = await verifyAuthenticationResponse({
      //     response: body,
      //     expectedChallenge: user.registrationOptions.challenge,
      //     expectedOrigin: 'http://localhost:3000',
      //     expectedRPID: 'localhost',
      //     authenticator: {
      //       credentialID: passkey.credentialID,
      //       credentialPublicKey: passkey.publicKey,
      //       counter: passkey.counter,
      //       transports: passkey.transports,
      //     },
      //   });
      // } catch (error) {
      //   console.error(error);
      //   return res.status(400).send({ error: error.message });
      // }

      // const { verified } = verification;

      const password = randomBytes(32).toString('hex')

      // await req.payload.update({
      //   collection: collectionSlug,
      //   id: user.id,
      //   data: {password} as any,
      // })

      const loginData = {
        collection: collectionSlug,
        data: {
          email: user.email,
          password: 'Caconmi08!',
        },
        req: req,
      }
      console.log(loginData)
      const result = await req.payload.login(loginData)

      let data = {success: true, data: result}
      console.log(data)
      return res.json(data);
    }
  };

  const multiAuthPreEndpoint: Endpoint = {
    path: '/multi-auth/auth/pre',
    method: 'post',
    root: true,
    handler: async (req, res) => {
      // secure this request
      if (!req.body) {
        return res.status(400).json({message: 'Malformed request'});
      }

      const {email} = req.body;

      const user = await getUserByEmail(email, req.payload);

      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      // return user preferred authentication method
      return res.json({authMethod: user.authMethod || 'password'});
    }
  };

  const multiAuthLoginEndpoint: Endpoint = {
    path: '/multi-auth/auth/login',
    method: 'post',
    root: true,
    handler: async (req, res) => {
      // secure this request
      if (!req.body) {
        return res.status(400).json({message: 'Malformed request'});
      }

      const {email, password} = req.body;
      const user = await getUserByEmail(email, req.payload);

      if (!user) {
        return res.status(404).json({message: 'User not found'});
      }

      const loginData = {
        collection: collectionSlug,
        data: {
          email: email,
          password: password,
        },
        req: req,
      }

      let result
      try {
        result = await req.payload.login(loginData)
      } catch (error) {
        console.log(error.message)
        return res.status(401).json({message: error.message});
      }

      if(user.authMethod === 'password_2fa' && user.tokenValidation === false) {
        return res.status(401).json({message: 'Invalid token'})
      }

      let data = {success: true, data: result}
      return res.json(data);
    }
  };

  config.endpoints = [
    ...endpoints,
    testEndpoint,
    registerResponseEndpoint,
    registerChallengeEndpoint,
    loginChallengeEndpoint,
    loginResponseEndpoint,
    multiAuthPreEndpoint,
    multiAuthLoginEndpoint
  ];

  return config;
};

