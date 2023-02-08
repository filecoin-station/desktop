declare module '@zondax/filecoin-signing-tools/js' {
  export enum ProtocolIndicator {
    ID = 0,
    SECP256K1,
    ACTOR,
    BLS
  }

  export class ExtendedKey {
    constructor(privateKey: Buffer, testnet: boolean)
    publicKey: Buffer
    privateKey: Buffer
    address: string
    get public_raw(): Uint8Array
    get private_raw(): Uint8Array
    get public_hexstring(): string
    get private_hexstring(): string
    get public_base64(): string
    get private_base64(): string
  }

  export interface Message {
    To: string
    From: string
    Nonce: number
    Value: string
    GasFeeCap: string
    GasPremium: string
    GasLimit: number
    Method: number
    Params: string
  }

  export interface SignedMessage {
    Signature: {
      Data: string
      Type: ProtocolIndicator
    }
  }

  export function generateMnemonic(): string

  export function keyDerive(
    mnemonic: string,
    path: string,
    password: string
  ): ExtendedKey

  export function keyDeriveFromSeed(
    seed: string | Buffer,
    path: string
  ): ExtendedKey

  export function keyRecover(
    privateKey: string | Buffer,
    testnet: boolean
  ): ExtendedKey

  export function transactionSerialize(transaction: Message): string

  export function transactionSerializeRaw(transaction: Message): Uint8Array

  export function transactionParse(
    cborMessage: string,
    testnet: boolean
  ): Message

  export function transactionSign(
    unsignedMessage: Message,
    privateKey: string | Buffer
  ): SignedMessage

  export function transactionSignRaw(
    unsignedMessage: Message | string | Buffer,
    privateKey: string | Buffer
  ): Buffer

  export function verifySignature(
    signature: string | Buffer,
    message: Message | string | Buffer
  ): boolean

  export function addressAsBytes(address: string): Buffer

  export function bytesToAddress(address: any, testnet: boolean): string
}
