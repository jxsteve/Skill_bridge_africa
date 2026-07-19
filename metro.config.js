const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Some Privy dependencies ship package exports that Metro cannot resolve yet.
const legacyResolutionPackages = ['isows', 'zustand', 'jose'];

const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    legacyResolutionPackages.some(
      (pkg) => moduleName === pkg || moduleName.startsWith(`${pkg}/`),
    )
  ) {
    const ctx = { ...context, unstable_enablePackageExports: false };
    return (defaultResolveRequest ?? ctx.resolveRequest)(ctx, moduleName, platform);
  }
  return (defaultResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
