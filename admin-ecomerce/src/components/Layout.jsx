import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <main className="main-content page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
