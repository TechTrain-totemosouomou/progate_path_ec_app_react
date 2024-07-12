import {createBrowserRouter} from "react-router-dom";
import {ErrorBoundary} from "@/components/error_boundary";
import {Layout} from "@/components/layout";
import {RequireAuth} from "@/components/require_auth";
import {LoginPage} from "@/pages/login";
import {SearchPage} from "@/pages/search";
import {CartPage} from "@/pages/cart";
import {OrderCompletePage} from "@/pages/orderComplete";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            index: true,
            element: <SearchPage />,
          },
          {
            path: "cart",
            element: <CartPage />,
          },
          {
            path: "orders/:id/complete",
            element: <OrderCompletePage />,
          },
        ],
      },
    ],
  },
  {path: "*", element: <h1>Not Found</h1>},
]);
