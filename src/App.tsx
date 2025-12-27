import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppLayout from "./components/layout/AppLayout";
import CreateInspection from "./pages/CreateInspection";
import Home from "./pages/Home";
import InspectionDetails from "./pages/InspectionDetails";
import ItemInspectionDetails from "./pages/ItemInspectionDetails";
import Login from "./pages/Login";
import RoomDetails from "./pages/RoomDetails";
import { useAuthStore } from "./store/authStore";

function App() {
  const { user, checkUser, loading } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium animate-pulse">
          Iniciando Visto.io...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Login />
        <ToastContainer position="top-right" theme="colored" />
      </>
    );
  }

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/nova-vistoria" element={<CreateInspection />} />
          <Route path="/vistoria/:id" element={<InspectionDetails />} />
          <Route
            path="/vistoria/:id/comodo/:roomId"
            element={<RoomDetails />}
          />
          <Route
            path="/vistoria/:id/comodo/:roomId/item/:itemId"
            element={<ItemInspectionDetails />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
