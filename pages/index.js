import React, { useState, useEffect } from "react";
import { SplashScreen } from '../component'


export default function Home ()
{
    const [ loading, setLoading ] = useState( true );

    useEffect( () =>
    {
        setTimeout( () => setLoading( false ), 6000 );
    } , []);

    return (

        <div>
            { loading ?
                <SplashScreen /> // Don't remove this line, it is the SplashScreen Component(Loading Animation)
                :
                <div>
                    This is where all the whole content of the Landing page will be
                </div>
            }
        </div>
    );
}
