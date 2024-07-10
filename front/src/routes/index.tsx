import {createBrowserRouter} from "react-router-dom";
import {ErrorBoundary} from "@/components/error_boundary";
import {Layout} from "@/components/layout";
import {RequireAuth} from "@/components/require_auth";
import {LoginPage} from "@/pages/login";
import {SearchPage} from "@/pages/search";

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
        ],
      },
    ],
  },
  {path: "*", element: <h1>Not Found</h1>},
]);
