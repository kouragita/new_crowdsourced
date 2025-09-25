import { useUser } from "../contexts/UserContext.jsx";

export const useRole = () => {
  const { user } = useUser();

  // This function intelligently gets the role name whether it's a string or an object
  const getRoleName = () => {
    if (!user || !user.role) {
      return null;
    }
    if (typeof user.role === 'string') {
      return user.role.toLowerCase();
    }
    if (typeof user.role === 'object' && user.role.name) {
      return user.role.name.toLowerCase();
    }
    return null;
  };

  const roleName = getRoleName();

  return {
    role: roleName,
    isAdmin: roleName === 'admin',
    isContributor: roleName === 'contributor',
    isLearner: roleName === 'learner',
  };
};