import Sidebar from './sidebar/Sidebar';


function MainLayout({ children }: { children: React.ReactNode }) {

    return (
    <div className="g-sidenav-show   bg-gray-100">
      <div className="min-height-300 bg-dark position-absolute w-100"></div>
      <Sidebar />
      <main className="main-content position-relative border-radius-lg ps">
        {children}
      </main>
    </div>
  );
}export default MainLayout;
