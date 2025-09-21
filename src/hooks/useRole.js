import { useUser } from '../contexts/UserContext';

export const useRole = () => {
  const { user } = useUser();
  const role = user?.role;

  return {
    role,
    isAdmin: role === 'admin',
    isContributor: role === 'instructor', // Assuming 'instructor' maps to Contributor
    isLearner: role === 'student', // Assuming 'student' maps to Learner
  };
};
