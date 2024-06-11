import { extendWebpackConfig } from './webpack'
import type { PluginTypes } from './types'
import type {Config, Endpoint, Plugin} from 'payload/config'
import {CollectionBeforeLoginHook, CollectionConfig } from 'payload/dist/exports/types'
import base32 from 'hi-base32'
import Login from "./components/views/Login";
import {
  generateSecret,
  validateToken,
} from "@sunknudsen/totp"
import pluginConfig from "./pluginConfig";
import { loginResponseEndpoint,
  loginChallengeEndpoint,
  multiAuthLoginEndpoint,
  multiAuthPreEndpoint,
  registerChallengeEndpoint,
  registerResponseEndpoint,
} from './endpoints/Endpoints'
import MFAKey from "./components/fields/afterInput/MFAKey";

export const payloadWebAuthn: (pluginOptions: PluginTypes) => Plugin = (pluginOptions) => async (incomingConfig) => {
  let config: Config = {...incomingConfig}

  // Extend the webpack configuration if needed
  const webpack = extendWebpackConfig(incomingConfig);

  config.admin = {
    ...(config.admin || {}),
    webpack,
  };

  // Check if the plugin is disabled; apply webpack changes regardless
  if (pluginOptions.enabled === false) {
    return config;
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
      views: {
        ...(config.admin?.components?.views || {}),
        CustomLogin: {
          path: '/login-2fa',
          Component: Login,
        }

      },
    },
    user: pluginConfig.authCollectionSlug,
  }

  let collections = config.collections || [];

  const webAuthnUser: CollectionConfig = {
    slug: pluginConfig.authCollectionSlug,
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
        defaultValue: () => generateSecret(20),
        admin: {
          readOnly: true,
          components: {
            afterInput: [MFAKey]
          }
        },
      },
      {
        label: 'MFA Google Key',
        name: 'google_mfa_key',
        type: 'text',
        hooks: {
          beforeChange: [
            (data) => {
              return base32.encode(data.siblingData.mfa_key)
            },
          ],
        },
        admin: {
          hidden: true,
          readOnly: true,
          description:
            'Enter this key into Google Authenticator. Save to see updated value.',
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
        relationTo: pluginConfig.authCollectionSlug,
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
              return new Uint8Array(JSON.parse(value).buffer)
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

  config.endpoints = [
    ...endpoints,
    registerResponseEndpoint,
    registerChallengeEndpoint,
    loginChallengeEndpoint,
    loginResponseEndpoint,
    multiAuthPreEndpoint,
    multiAuthLoginEndpoint
  ];

  return config;
};

