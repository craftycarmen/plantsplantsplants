import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Listings from './components/Listings/ListingsIndex';
import ListingPage from './components/Listings/ListingPage';
import CreateListingForm from './components/Listings/ListingForm/CreateListingForm';
import * as sessionActions from './store/session';
import UpdateListingForm from './components/Listings/ListingForm/UpdateListingForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },
      {
        path: '/listings',
        element: <Listings />
      },
      {
        path: '/listings/:listingId',
        element: <ListingPage />
      },
      {
        path: '/listings/new',
        element: <CreateListingForm />
      },
      {
        path: '/listings/:listingId/edit',
        element: <UpdateListingForm />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

// ** WITHOUT LOGIN/SIGNUP MODALS ** //
// import { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
// import Navigation from './components/Navigation';
// import * as sessionActions from './store/session';

// function Layout() {
//   const dispatch = useDispatch();
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     dispatch(sessionActions.restoreUser()).then(() => {
//       setIsLoaded(true)
//     });
//   }, [dispatch]);

//   return (
//     <>
//       <Navigation isLoaded={isLoaded} />
//       {isLoaded && <Outlet />}
//     </>
//   );
// }

// const router = createBrowserRouter([
//   {
//     element: <Layout />,
//     children: [
//       {
//         path: '/',
//         element: <h1>Welcome!</h1>
//       },
//       {
//         path: "login",
//         element: <LoginFormPage />
//       },
//       {
//         path: "signup",
//         element: <SignupFormPage />
//       }
//     ]
//   }
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;
