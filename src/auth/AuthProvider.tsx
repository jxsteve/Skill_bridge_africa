// Platform-neutral entry: Metro picks AuthProvider.native.tsx on iOS/Android
// and AuthProvider.web.tsx in browsers; this file provides the type surface.
export { AuthProvider, useAuth } from './AuthProvider.web';
