import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

const MFAKey = () => {
  const [showQRCode, setShowQRCode] = useState(false)

  const email = (document.getElementById('field-email') as HTMLInputElement)?.value
  const secret = (document.getElementById('field-mfa_key') as HTMLInputElement)?.value

  // Return null if email or secret is not available
  if (!email || !secret) {
    return null
  }

  const toggleQRCode = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setShowQRCode(prevShowQRCode => !prevShowQRCode)
  }

  return (
    <div>
      <a href="#" onClick={toggleQRCode}>
        {showQRCode ? 'Hide QR Code' : 'Show QR Code'}
      </a>
      {showQRCode && (
        <div>
          <QRCodeSVG value={`otpauth://totp/Example:${email}?secret=${secret}&issuer=PayLoadCMS`} />
        </div>
      )}
    </div>
  )
}

export default MFAKey
