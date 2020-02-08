import React, { useContext, Suspense } from 'react';
import { UserData } from '../../App';
import { LoadingPage } from '../../utils/loading/LoadingPage';
import './Home.css';

const Welcome = React.lazy(() => import('./Welcome/Welcome'));
const ReturnVisitor = React.lazy(() => import('./ReturnVisitor/ReturnVisitor'));

const Home = () => {
  const { userId } = useContext(UserData);

  return (
    <div className="home">
      {
      userId
        ? (
          <Suspense fallback={<LoadingPage contained message="Loading Your Info" />}>
            <ReturnVisitor />
          </Suspense>
        )
        : (
          <Suspense fallback={<LoadingPage contained message="Loading Welcome Page" />}>
            <Welcome />
          </Suspense>
        )
      }
    </div>
  );
};


export default Home;
