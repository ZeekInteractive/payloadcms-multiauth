import React from 'react'
import { Email } from 'payload/components/fields/Email'
import { FieldProps } from 'payload/dist/admin/components/forms/types'

const EmailField: React.FC<FieldProps> = (props) => {
  return (
    <Email
      {...props}
      label="Custom Email Field"
      placeholder="Enter your email"
    />
  )
}

export default EmailField
