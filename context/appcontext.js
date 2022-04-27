import { toast } from "react-toastify";
import
{
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import
{
    connectToMetaMask,
    listenToAccountChanges,
    hasEthereum,
    unmountEthListeners,
    listenToNetworkChanges,
} from "../services/web3services";
import { useRouter } from 'next/router';
const AppContext = createContext();

export function AppProvider ( { children } )
{
    const [ isInitiallyFetched, setIsInitiallyFetched ] = useState( false );
    const [ isConnected, setIsConnected ] = useState( false );
    const [ hasMetaMask, setHasMetaMask ] = useState( true );
    const [ address, setAddress ] = useState( false );
    const router = useRouter();

    const handleWalletConnect = useCallback( () =>
    {
        return ( async () =>
        {
            const address = await connectToMetaMask();
            if ( !address )
            {
                return toast.error( "Connection Unsuccessful" );
            } else
            {
                toast.success( "Connected to MetaMask" );
                setIsConnected( true );
                setAddress( address );
                localStorage.setItem( "wallet-connection", true );
                return true;
            }
        } )();
    }, [] );

    const resetValues = useCallback( () =>
    {
        return ( async () =>
        {
            setIsConnected( true );

            localStorage.setItem( "wallet-connection", true );

            return true;
        } )();
    }, [] );

    const handleWalletDisconnect = () =>
    {
        setIsConnected( false );
        localStorage.remove( "wallet-connection" );
        return toast.error( "Disconnected from MetaMask" );
    };

    const handleAccountChanged = ( address ) =>
    {
        if ( !address ) return handleWalletDisconnect();
        resetValues();
    };

    const handleNetworkChanged = () =>
    {
        resetValues();
    };

    useEffect( () =>
    {
        if ( !isInitiallyFetched ) return;

        if ( !hasEthereum() ) return;
        listenToAccountChanges( handleAccountChanged );
        listenToNetworkChanges( handleNetworkChanged );
        return unmountEthListeners();
    }, [] );

    useEffect( () =>
    {
        if ( isInitiallyFetched ) return;
        if ( !hasEthereum() )
        {
            toast.error( "Please Install Meta Mask" );
            return setHasMetaMask( false );
        }
        const isInjected = localStorage.getItem( "wallet-connection" );
        if ( !isInjected ) return setIsInitiallyFetched( true );

        handleWalletConnect();
        // isConnected ? router.replace( "/dashboard" ) : router.push( "/" );
        setIsInitiallyFetched( true );
        return;
    }, [ handleWalletConnect, isInitiallyFetched ] );

    return (
        <AppContext.Provider
            value={ {
                isConnected,
                setIsConnected,
                handleWalletConnect,
                handleWalletDisconnect,
                hasMetaMask,
                address,
            } }
        >
            { children }
        </AppContext.Provider>
    );
}

export function useAppContext ()  // Here if you are importing this file in another file, you can use this function to get the context e.g. const { isConnected, handleWalletConnect, handleWalletDisconnect } = useAppContext(); 
                                  // import {useAppContext} from '../context/appcontext';.
{
    const context = useContext( AppContext );

    if ( !context ) throw new Error( "useApp must be used inside a `AppProvider`" );

    return context;
}