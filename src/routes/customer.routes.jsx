// Customer route definitions.
// Each member adds their own routes here in a small PR, grouped under their member number.
import SiteLayout from "../components/layout/SiteLayout";
import CheckoutLayout from "../components/layout/CheckoutLayout";
import NotFound from "../components/NotFound";

// M1 – shop
import HomePage from "../features/shop/pages/HomePage";
import CataloguePage from "../features/shop/pages/CataloguePage";
import SearchPage from "../features/shop/pages/SearchPage";
import ProductDetailPage from "../features/shop/pages/ProductDetailPage";
import WishlistPage from "../features/shop/pages/WishlistPage";

// M1 – payment
import PaymentPage from "../features/payment/pages/PaymentPage";
import PaymentSuccessPage from "../features/payment/pages/PaymentSuccessPage";
import PaymentFailurePage from "../features/payment/pages/PaymentFailurePage";

// M2 – cart
import CartPage from "../features/checkout/pages/CartPage";

export const customerRoutes = [
  {
    element: <SiteLayout />,
    children: [
      // M1 – shop
      { path: "/", element: <HomePage /> },
      { path: "/shop", element: <CataloguePage /> },
      { path: "/shop/:category", element: <CataloguePage /> },
      { path: "/new-arrivals", element: <CataloguePage variant="new" /> },
      { path: "/bestsellers", element: <CataloguePage variant="bestsellers" /> },
      { path: "/sale", element: <CataloguePage variant="sale" /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/product/:slug", element: <ProductDetailPage /> },
      { path: "/wishlist", element: <WishlistPage /> },

      // M2 (cart), M3 (account) and M8 (store info, FAQ, policies) add routes here.

      { path: "*", element: <NotFound /> },


      { path: "/cart", element: <CartPage /> },


    ],
  },
  {
    element: <CheckoutLayout />,
    children: [
      // M2 adds /checkout routes here.

      // M1 – payment
      { path: "/payment", element: <PaymentPage /> },
      { path: "/payment/success", element: <PaymentSuccessPage /> },
      { path: "/payment/failure", element: <PaymentFailurePage /> },
    ],
  },
];
