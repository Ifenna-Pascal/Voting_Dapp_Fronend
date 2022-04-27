//Do Not Touch this File, Everything needed here is already defined in the services\web3services.js

import { ethers } from "ethers";

export function hasEthereum ()
{
    return window.ethereum ? true : false;    // Checks if Window has Ethereum Injected
}

export const connectToMetaMask = async ( setError ) =>
{   // Connect to MetaMask
    try
    {
        if ( !hasEthereum() ) return false;

        const address = await window.ethereum.request( {
            method: "eth_requestAccounts",
        } );
        return address[ 0 ];  //Return Address 
    } catch ( error )
    {
        console.log( error );
        if ( setError ) setError( error.message ?? error.toString() );
        return false;
    }
};


export function getActiveWallet ()
{
    if ( !hasEthereum() ) return false;
    const provider = new ethers.providers.Web3Provider( window.ethereum );
    const signer = provider.getSigner();
    const address = signer.provider.provider.selectedAddress;
    return address;
}

export async function getCurrentNetwork ()
{
    if ( !hasEthereum() ) return false;
    const provider = new ethers.providers.Web3Provider( window.ethereum );
    const signer = provider.getSigner();
    const network = ( await signer.provider._networkPromise ).name;
    return network;
}

export function listenToAccountChanges ( handler )
{
    if ( !hasEthereum() ) return false;

    window.ethereum.on( "accountsChanged", async ( accounts ) =>
    {
        handler( accounts[ 0 ] );
    } );
}

export function listenToNetworkChanges ( handler )
{
    if ( !hasEthereum() ) return false;

    window.ethereum.on( "chainChanged", async () =>
    {
        const network = await getCurrentNetwork();
        if ( network && network !== "rinkeby" )
        {
            return toast.error( "Please Switch to the Rinkeby Test Network" );
        } else
        {
            toast.success( "You successfully switched to the Rinkeby Test Network" );
            // handler(network);
        }
    } );
}

export async function unmountEthListeners ()
{
    window.ethereum.removeListener( "chainChanged", () => { } );
    window.ethereum.removeListener( "accountsChanged", () => { } );
    window.ethereum.removeListener( "message", () => { } );
}