import React from 'react';
import { useRole } from '../hooks/useRole';
import LearnerDashboardView from './LearnerDashboardView';
import ContributorDashboardView from './ContributorDashboardView';

export const UserDashboard = () => {
  const { isContributor } = useRole();

  if (isContributor) {
    return <ContributorDashboardView />;
  }

  return <LearnerDashboardView />;
};