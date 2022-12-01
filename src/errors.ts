
export class InvalidConfigError extends Error {
  name = 'InvalidConfigError'
  
  constructor(m?: string) {
    super(m)
    Object.setPrototypeOf(this, InvalidConfigError.prototype)
  }
}

export class MissingProviderError extends Error {
  name = 'MissingProviderError'
  
  constructor(m?: string) {
    super(m)
    Object.setPrototypeOf(this, MissingProviderError.prototype)
  }
}
  
export class MissingSignerError extends Error {
  name = 'MissingSignerError'
  
  constructor(m?: string) {
    super(m)
    Object.setPrototypeOf(this, MissingSignerError.prototype)
  }
}
