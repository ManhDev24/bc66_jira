import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './redux/store.ts'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
<<<<<<< HEAD
import { createBrowserHistory } from "history";
import {
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
=======
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
>>>>>>> 5d664b2d6ce82c9737bf51783d931b9f3e4e18be
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default is true
    },
    mutations: {
      // do something
    },
  },
})
export const history = createBrowserHistory();
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
    <Provider store={store}>
      <BrowserRouter history={history}>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={true} />
          <ToastContainer />
        </QueryClientProvider>
      </BrowserRouter>
    </Provider>
  
)
