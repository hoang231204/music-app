import { Outlet } from 'react-router-dom';
import ClientHeader from '../components/ClientHeader';
import Player from '../components/Player';

const ClientLayout = () => {
  return (
    <div className="client-layout-container">
      <ClientHeader />
      <main className="client-main-content">
        <Outlet />
      </main>
      <Player />
    </div>
  );
};

export default ClientLayout;
