import AppRouter from "./routes/AppRouter.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

function App() {
  return (
    <AuthProvider>
        <AppRouter />
    </AuthProvider>
  );
}

export default App;
