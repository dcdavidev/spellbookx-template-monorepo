/**
 * @file A friendly greeting.
 * @author Davide Di Criscito
 */

/**
 * Builds a friendly greeting.
 * @param name - Who to greet. Defaults to `world`.
 * @returns The greeting, for example `Hello, world!`.
 */
export function greet(name = 'world'): string {
  return `Hello, ${name}!`;
}
