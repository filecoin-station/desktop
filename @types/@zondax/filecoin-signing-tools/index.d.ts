declare module '@zondax/filecoin-signing-tools' {
  export class ExtendedKey {
    get public_raw(): Uint8Array
    get private_raw(): Uint8Array
    get public_hexstring(): string
    get private_hexstring(): string
    get public_base64(): string
    get private_base64(): string
    get address(): string
  }

  export function generateMnemonic(): string

  export function keyDerive(
    mnemonic: string,
    path: string,
    password: string,
    language_code?: string
  ): ExtendedKey

  export function keyDeriveFromSeed(seed: any, path: string): ExtendedKey

  export function keyRecover(private_key_js: any, testnet: boolean): ExtendedKey

  export function keyRecoverBLS(
    private_key_js: any,
    testnet: boolean
  ): ExtendedKey

  export function transactionSerialize(message: any): string

  export function transactionSerializeRaw(unsigned_message: any): Uint8Array

  export function transactionParse(cbor_js: any, testnet: boolean): any

  export function transactionSign(unsigned_tx_js: any, private_key_js: any): any

  export function transactionSignLotus(
    unsigned_tx_js: any,
    private_key_js: any
  ): string

  export function transactionSignRaw(
    unsigned_tx_js: any,
    private_key_js: any
  ): any

  export function verifySignature(signature_js: any, message_js: any): boolean

  export function createMultisigWithFee(
    sender_address: string,
    addresses: any,
    value: string,
    required: number,
    nonce: number,
    duration: string,
    start_epoch: string,
    gas_limit: string,
    gas_fee_cap: string,
    gas_premium: string,
    network: string
  ): any

  export function createMultisig(
    sender_address: string,
    addresses: any,
    value: string,
    required: number,
    nonce: number,
    duration: string,
    start_epoch: string,
    network: string
  ): any

  export function proposeMultisigWithFee(
    multisig_address: string,
    to_address: string,
    from_address: string,
    amount: string,
    nonce: number,
    gas_limit: string,
    gas_fee_cap: string,
    gas_premium: string,
    method: number,
    params: string
  ): any

  export function proposeMultisig(
    multisig_address: string,
    to_address: string,
    from_address: string,
    amount: string,
    nonce: number,
    method: number,
    params: string
  ): any

  export function approveMultisigWithFee(
    multisig_address: string,
    message_id: number,
    proposer_address: string,
    to_address: string,
    amount: string,
    from_address: string,
    nonce: number,
    gas_limit: string,
    gas_fee_cap: string,
    gas_premium: string
  ): any

  export function approveMultisig(
    multisig_address: string,
    message_id: number,
    proposer_address: string,
    to_address: string,
    amount: string,
    from_address: string,
    nonce: number
  ): any

  export function cancelMultisigWithFee(
    multisig_address: string,
    message_id: number,
    proposer_address: string,
    to_address: string,
    amount: string,
    from_address: string,
    nonce: number,
    gas_limit: string,
    gas_fee_cap: string,
    gas_premium: string
  ): any

  export function cancelMultisig(
    multisig_address: string,
    message_id: number,
    proposer_address: string,
    to_address: string,
    amount: string,
    from_address: string,
    nonce: number
  ): any

  export function createPymtChanWithFee(
    from_address: string,
    to_address: string,
    amount: string,
    nonce: number,
    gas_limit: string,
    gas_fee_cap: string,
    gas_premium: string,
    network: string
  ): any

  export function createPymtChan(
    from_address: string,
    to_address: string,
    amount: string,
    nonce: number,
    network: string
  ): any

  export function settlePymtChanWithFee(
    pch_address: string,
    from_address: string,
    nonce: number,
    gas_limit: string,
    gas_fee_cap: string,
    gas_premium: string
  ): any

  export function settlePymtChan(
    pch_address: string,
    from_address: string,
    nonce: number
  ): any

  export function collectPymtChanWithFee(
    pch_address: string,
    from_address: string,
    nonce: number,
    gas_limit: string,
    gas_fee_cap: string,
    gas_premium: string
  ): any

  export function collectPymtChan(
    pch_address: string,
    from_address: string,
    nonce: number
  ): any

  export function updatePymtChanWithFee(
    pch_address: string,
    from_address: string,
    signed_voucher: string,
    nonce: number,
    gas_limit: string,
    gas_fee_cap: string,
    gas_premium: string
  ): any

  export function updatePymtChan(
    pch_address: string,
    from_address: string,
    signed_voucher: string,
    nonce: number
  ): any

  export function signVoucher(voucher: string, private_key_js: any): any

  export function createVoucher(
    payment_channel_address: string,
    time_lock_min: string,
    time_lock_max: string,
    amount: string,
    lane: string,
    nonce: number,
    min_settle_height: string
  ): any

  export function serializeParams(params_value: any): Uint8Array

  export function deserializeParams(
    params_base64: string,
    actor_type: string,
    method: number
  ): any

  export function deserializeConstructorParams(
    params_base64: string,
    code_cid: string
  ): any

  export function verifyVoucherSignature(
    voucher_base64: string,
    address_signer: string
  ): boolean

  export function getCid(message: any): string
}
