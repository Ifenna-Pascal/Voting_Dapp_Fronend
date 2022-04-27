import '../styles/globals.css'
import { ToastContainer , Zoom} from 'react-toastify';
// import 'styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';
import {AppProvider} from '../context/appcontext';

function MyApp ( { Component, pageProps } )
{
  
  return ( <>
    <ToastContainer transition={ Zoom } position="top-center" autoClose={ 3000 } />
    <AppProvider>
    <Component { ...pageProps } />
    </AppProvider>
  </>
  );
}

export default MyApp
