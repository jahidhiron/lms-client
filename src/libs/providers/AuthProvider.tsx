import { useRouter } from 'next/router';
import { ReactNode, createContext, useContext, useEffect } from 'react';
import SplashScreen from '~/components/utils/SplashScreen';
import useAuth, { useAuthMutations } from '~/features/auth/use-auth';
import {
  DEFAULT_REDIRECT_PATH,
  TIMER_MIN_KEY,
  TIMER_SEC_KEY,
  UNAUTHORIZED_ERROR_NAME,
} from '~/helpers/constants';
import { isProtectedRoute } from '~/helpers/utils';

const AuthContext = createContext<Partial<ReturnType<typeof useAuth>>>({});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const router = useRouter();
  const auth = useAuth();
  const { logout } = useAuthMutations();

  useEffect(() => {
    if (!auth.isLoading) {
      if (
        auth.isAuthenticated &&
        !auth.session?.verified &&
        !router.pathname.includes('/auth/verify-otp')
      ) {
        sessionStorage.removeItem(TIMER_MIN_KEY);
        sessionStorage.removeItem(TIMER_SEC_KEY);
        router.replace({
          pathname: '/auth/verify-otp',
          query: {
            email: auth?.session?.email,
            type: 'email-verification',
          },
        });
        return;
      }
      if (
        auth.isAuthenticated &&
        router.pathname.includes('/auth') &&
        auth.session?.verified
      ) {
        router.replace(
          (router?.query?.redirect as string)?.replace('%3F', '') ||
            DEFAULT_REDIRECT_PATH[auth?.session?.role]
        );
        return;
      }
      if (!auth.isAuthenticated && isProtectedRoute(router.pathname)) {
        console.log('Redirect Url: ', router.asPath);
        router.replace({
          pathname: '/auth/login',
          query: {
            redirect: router.asPath,
            ...router.query,
          },
        });
        return;
      }
      if (auth.error && auth.isAuthenticated) {
        if (auth.error?.response?.data?.name === UNAUTHORIZED_ERROR_NAME) {
          logout();
        }
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, auth.session, logout]);

  return (
    <AuthContext.Provider value={{ ...auth }}>
      {auth.isLoading ? (
        <SplashScreen />
      ) : isProtectedRoute(router.pathname) && !auth.isAuthenticated ? (
        <SplashScreen />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuthContext = () => useContext(AuthContext);
