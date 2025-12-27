import { LogOut } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const AppLayout = () => {
  const { user, signOut } = useAuthStore();

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 cursor-pointer">
        <div className="max-w-[44rem] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo visto.io" className="h-28 w-44" />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block text-right">
              <p className="text-xs text-slate-500">Logado como</p>
              <p className="text-sm font-medium text-slate-700 max-w-[250px] truncate">
                {user?.email}
              </p>
            </div>

            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold shadow-sm">
              {userInitial}
            </div>

            <button
              onClick={signOut}
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Sair da conta"
            >
              <LogOut className="h-5 w-5" />
            </button>
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
