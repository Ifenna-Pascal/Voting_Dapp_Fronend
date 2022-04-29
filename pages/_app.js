import '../styles/globals.css';
// import "tailwindcss/tailwind.css";
import { Mainnet, DAppProvider, Ropsten, Kovan, Rinkeby } from '@usedapp/core'; // Used to Connect to the DApp
import { ToastContainer , Zoom} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { AppProvider } from '../context/appcontext';

import { getDefaultProvider } from 'ethers';

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [ Mainnet.chainId ]: getDefaultProvider( 'mainnet' ),
    [ Ropsten.chainId ]: getDefaultProvider( 'ropsten' ),
    [ Kovan.chainId ]: getDefaultProvider( 'kovan' ),
    [ Rinkeby.chainId ]: getDefaultProvider( 'rinkeby' ),
  },
}


function MyApp ( { Component, pageProps } )
{
  
  return (
    <>
    <ToastContainer transition={ Zoom } position="top-center" autoClose={ 3000 } />
      <DAppProvider config={config}>
        <AppProvider>
          <Component { ...pageProps } />
        </AppProvider>
      </DAppProvider>
  </>
  );
}

export default MyApp
