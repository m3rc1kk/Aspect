import AppRouter from "./routes/AppRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import NotificationToasts from "./components/NotificationToasts/NotificationToasts.jsx";

function App() {
  return (
    <AuthProvider>
        <AppRouter />
        <NotificationToasts />
    </AuthProvider>
  );
}

export default App;
