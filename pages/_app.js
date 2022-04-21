import '../styles/globals.css'
import { ToastContainer } from 'react-toastify';
// import 'styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

function MyApp({ Component, pageProps }) {
  return <div>
    <Component {...pageProps} />
  <ToastContainer
  position='top-right'
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme='light'
/>
  </div>
}

export default MyApp
