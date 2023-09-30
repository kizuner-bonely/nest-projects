import { createContext } from 'react'

export function createToken<T>(service: () => T, initialValue?: T) {
  return createContext(initialValue as T)
}
