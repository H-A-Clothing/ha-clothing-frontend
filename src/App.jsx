// Application shell and route composition.
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { customerRoutes } from "./routes/customer.routes";

// Admin routes (src/routes/admin.routes.jsx) get added here once they export a route list.
const router = createBrowserRouter([...customerRoutes]);

export default function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </CartProvider>
  );
}
