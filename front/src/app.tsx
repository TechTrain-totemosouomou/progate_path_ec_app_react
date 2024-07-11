import {Suspense} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {RouterProvider} from "react-router-dom";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Loading} from "@/components/loading";
import {router} from "@/routes";
import {CartProvider} from "@/context/CartContext";

const queryClient = new QueryClient();

export function App(): JSX.Element {
  return (
    <ErrorBoundary fallback={<div>error occurred</div>}>
      <Suspense fallback={<Loading />}>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </QueryClientProvider>
      </Suspense>
    </ErrorBoundary>
  );
}
