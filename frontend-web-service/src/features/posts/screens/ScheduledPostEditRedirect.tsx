import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const ScheduledPostEditRedirect: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) {
    return <Navigate to="/posts/scheduled" replace />;
  }

  return <Navigate to={`/posts/scheduled/${id}`} replace />;
};

export default ScheduledPostEditRedirect;
