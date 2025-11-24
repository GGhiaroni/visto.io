import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background font-sans text-slate-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-2xl">
          <div>
            <img src="/logo.png" alt="Logo visto.io" className="h-28 w-44" />
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
            <span className="text-xs font-bold text-slate-500">G</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl pb-24">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
