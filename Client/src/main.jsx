import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store/Store.jsx";

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <Toaster position="top-center" richColors closeButton />
  </Provider>
);
