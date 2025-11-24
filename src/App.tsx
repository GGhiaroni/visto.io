import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppLayout from "./components/layout/AppLayout";
import Home from "./pages/Home";
import InspectionDetails from "./pages/InspectionDetails";

function App() {
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
          <Route path="/vistoria/:id" element={<InspectionDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
