import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Page = () => {
  const navigate = useNavigate();

  return (
    <div>
      page-example
      <Button onClick={() => navigate('/auth-register')}>Go to Register</Button>
      <Button onClick={() => navigate('/auth-login')}>Login</Button>
    </div>
  );
};

export default Page;
