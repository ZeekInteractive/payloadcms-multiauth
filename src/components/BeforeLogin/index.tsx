import React from 'react'
import './index.scss'

const baseClass = 'before-login'

const BeforeLogin: React.FC = () => {
  const handleRegisterCLick = async () => {
    let startRegistration: any = null
    const module = await import('@simplewebauthn/browser')
    startRegistration = module.startRegistration

    // add on click event to the button
    document.getElementById(`btnBeginAuth`)?.addEventListener('click', async () => {
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

      // GET registration options from the endpoint that calls
      // @simplewebauthn/server -> generateRegistrationOptions()
      const resp = await fetch('/multi-auth/register/challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'ivan+test@zeek.com' }),
      })

      if (!resp.ok) {
        elemError.innerText = `Error: ${resp.status} ${resp.statusText}`
        return
      }
      let attResp
      try {
        // Pass the options to the authenticator and wait for a response
        attResp = await startRegistration(await resp.json())
      } catch (error) {
        // Some basic error handling
        if (error.name === 'InvalidStateError') {
          elemError.innerText = 'Error: Authenticator was probably already registered by user'
        } else {
          elemError.innerText = error
        }
        console.log(error)

        throw error
      }

      // POST the response to the endpoint that calls
      // @simplewebauthn/server -> verifyRegistrationResponse()
      const verificationResp = await fetch('/multi-auth/register/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attResp),
      })

      // Wait for the results of verification
      const verificationJSON = await verificationResp.json()

      // Show UI appropriate for the `verified` status
      if (verificationJSON && verificationJSON.verified) {
        elemSuccess.innerHTML = 'Success!'
      } else {
        elemError.innerHTML = `Oh no, something went wrong! Response: <pre>${JSON.stringify(
          verificationJSON,
        )}</pre>`
      }
    })
  }

  const handleLoginCLick = async () => {
    let startAuthentication: any = null
    const module = await import('@simplewebauthn/browser')
    startAuthentication = module.startAuthentication

    // add on click event to the button
    document.getElementById(`btnBeginLogin`)?.addEventListener('click', async () => {
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

      // GET authentication options from the endpoint that calls
      // @simplewebauthn/server -> generateAuthenticationOptions()
      const resp = await fetch('/multi-auth/auth/challenge')

      let asseResp
      try {
        // Pass the options to the authenticator and wait for a response
        asseResp = await startAuthentication(await resp.json())
      } catch (error) {
        // Some basic error handling
        elemError.innerText = error
        throw error
      }

      // POST the response to the endpoint that calls
      // @simplewebauthn/server -> verifyAuthenticationResponse()
      const verificationResp = await fetch('/multi-auth/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asseResp),
      })

      // Wait for the results of verification
      const verificationJSON = await verificationResp.json()

      // Show UI appropriate for the `verified` status
      if (verificationJSON && verificationJSON.verified) {
        elemSuccess.innerHTML = 'Success!'
      } else {
        elemError.innerHTML = `Oh no, something went wrong! Response: <pre>${JSON.stringify(
          verificationJSON,
        )}</pre>`
      }
    })
  }

  return (
    <div className={baseClass}>
      <button id={`btnBeginAuth`} onClick={handleRegisterCLick}>
        Register WebAuthn Authenticator
      </button>
      <button id={`btnBeginLogin`} onClick={handleLoginCLick}>
        Login with WebAuthn Authenticator
      </button>
      <p id={`success`}></p>
      <p id={`error`}></p>
      <h4>This component was added by the plugin</h4>
    </div>
  )
}

export default BeforeLogin
