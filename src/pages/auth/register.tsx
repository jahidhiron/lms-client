import { useRouter } from 'next/router';
import RegisterForm from '~/components/pages/auth/RegisterForm';

const RegisterPage = () => {
  const router = useRouter();

  return (
    <div>
      <RegisterForm backUrl={router.back} />
    </div>
  );
};

export default RegisterPage;
