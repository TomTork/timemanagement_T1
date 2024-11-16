export function checkEndpoint(endpoint: string, endpoints: (RegExp | string)[]): boolean {
  return endpoints.some((pattern) => {
    if (typeof pattern === 'string') {
      return endpoint.includes(pattern);
    } else if (pattern instanceof RegExp) {
      return pattern.test(endpoint);
    }
    return false;
  });
}
