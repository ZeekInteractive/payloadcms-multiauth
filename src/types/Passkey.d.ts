interface Passkey {

  // SQL: Store as `TEXT`. Index this column
  credentialID: string
  // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
  //      Caution: Node ORM's may map this to a Buffer on retrieval,
  //      convert to Uint8Array as necessary
  publicKey: string
  // SQL: Foreign Key to an instance of your internal user model
  user: UserModel
  // SQL: Store as `TEXT`. Index this column. A UNIQUE constraint on
  //      (webAuthnUserID + user) also achieves maximum user privacy
  webAuthnUserID: string
  // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
  counter: number
  // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
  // Ex: 'singleDevice' | 'multiDevice'
  deviceType: CredentialDeviceType
  // SQL: `BOOL` or whatever similar type is supported
  backedUp: boolean
  // SQL: `VARCHAR(255)` and store string array as a CSV string
  // Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
  transports?: AuthenticatorTransportFuture[]
}

export default Passkey
