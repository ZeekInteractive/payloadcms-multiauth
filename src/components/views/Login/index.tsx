// src/components/Login.tsx
import React, { useState } from 'react'
import { useCookies } from 'react-cookie'
import { AdminViewComponent } from 'payload/config'
import './index.scss'

const Login: AdminViewComponent = () => {
  const [cookies, setCookie] = useCookies(['payload-token'])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFaToken, setTwoFaToken] = useState('')
  const [authMethod, setAuthMethod] = useState<'password' | 'password_2fa' | 'webauthn' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await fetch('/multi-auth/auth/pre', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setAuthMethod(data.authMethod)
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'An error occurred')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    console.log(email, password, twoFaToken, authMethod)

    const body: any = { email, password }
    if (authMethod === 'password_2fa') {
      body.token = twoFaToken
    }

    const response = await fetch('/multi-auth/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then(resp => {
        return resp
      })
      .catch(reqError => {
        setError(reqError.message || 'Login failed')
        return reqError
      })

    const respJson = await response.json()

    // if response is 200 continue
    if (respJson) {
      setCookie('payload-token', respJson.data.token, { path: '/' })
      window.location.href = '/admin'
    } else {
      setError(respJson.message || 'Login failed')
    }
  }

  const handlePasskeyLogin = async () => {
    let startAuthentication: any = null
    const module = await import('@simplewebauthn/browser')
    startAuthentication = module.startAuthentication

    // add on click event to the button
    const elemSuccess = document.getElementById('success')
    // <span>/<p>/etc...
    const elemError = document.getElementById('error')

    // check if the elements exist
    if (!elemSuccess || !elemError) {
      return
    }

    // Reset success/error messages
    elemSuccess.innerHTML = ''
    elemError.innerHTML = ''

    const resp: Response = await fetch('/multi-auth/auth/challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const respJson = await resp.json()
    console.log(respJson)
    let asseResp
    try {
      // Pass the options to the authenticator and wait for a response
      asseResp = await startAuthentication(respJson)
    } catch (reqError) {
      // Some basic error handling
      elemError.innerText = reqError as string
      throw error
    }

    console.log(asseResp)
    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationResp = await fetch('/multi-auth/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, asseResp }),
    })
    console.log(verificationResp)

    // Show UI appropriate for the `verified` status
    if (verificationResp.ok) {
      const json = await verificationResp.json()
      setCookie('payload-token', json.data.token, {path: '/'})
      window.location.href = '/admin'
    } else {
      const errorData = await verificationResp.json()
      setError(errorData.message || 'Login failed')
    }
  }

  // @ts-ignore
  return (
    <div className="custom-login">
      <h1>Login</h1>
      {!authMethod ? (
        <form onSubmit={handleEmailSubmit}>
          <div>
            <label>Email:</label>
            <input
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p>{error}</p>}
          <button type="submit">Next</button>
        </form>
      ) : (
        <form onSubmit={handleLoginSubmit}>
          <div>
            <label>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
          </div>
          {authMethod !== 'webauthn' && (
            <>
              <div>
                <label>Password:</label>
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {authMethod === 'password_2fa' && (
                <div>
                  <label>One Time Password:</label>
                  <input
                    type="text"
                    value={twoFaToken}
                    onChange={e => setTwoFaToken(e.target.value)}
                    required
                  />
                </div>
              )}
            </>
          )}
          {authMethod === 'webauthn' && (
            <div>
              <button type="button" onClick={handlePasskeyLogin}>
                Login with Passkey
              </button>
              <p>Click the button to login with your security key</p>
            </div>
          )}
          <div id="success"></div>
          <div id="error"></div>
          {error && <p>{error}</p>}
          {authMethod !== 'webauthn' && <button type="submit">Login</button>}
        </form>
      )}
    </div>
  )
}

export default Login
