import { useRouter } from 'next/router';
import LoginForm from '~/components/pages/auth/LoginForm';

const LoginPage = () => {
  const router = useRouter();

  return (
    <div>
      <LoginForm backUrl={router.back} />
    </div>
  );
};

export default LoginPage;
