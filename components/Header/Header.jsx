// import { Popover, Transition } from '@headlessui/react';
import { AiOutlineMenu } from 'react-icons/ai';
import { CgClose } from 'react-icons/cg';
import {useAppContext} from '../../context/appcontext';
import Link from 'next/link';
const navigation = [
    { name: 'Home', href: '#', id: "home" },
    { name: 'Services', href: '#', id: "services" },
    { name: 'ContactUs', href: '#', id: "contactus"  },
]
export default function Example ()
{
    const { activateProvider } = useAppContext();
    return (
        <div className="Container">
            <div className='flex items-center justify-between'>
                <Link href='/'>
                    <h1 className="text-[#07b307] text-3xl font-bold hover:text-green-400 cursor-pointer">Zuri-Election</h1>
                </Link>
                <ul className="text-green-800 hover:text-[#363836] md:flex list-none hidden flex-row justify-between items-center flex-initial cursor-pointer">
                    <Link href='#home'>
                        <li className="mx-4 cursor-pointer md:flex-1 text-xl hover:border-b-2">Home</li>
                    </Link>
                    <Link href='#services'><li className="mx-4 cursor-pointer md:flex-1 text-xl hover:border-b-2">Services</li></Link>
                    <Link href='#contacts'><li className="mx-4 cursor-pointer md:flex-1 text-xl hover:border-b-2">Contacts</li></Link>
                </ul>
                <div>
                    <div onClick={ activateProvider}>
                        <button className="bg-[#07b307] hover:bg-[#4ade80] text-white text-xl font-bold py-3 px-2 rounded-full ">Get Started</button>
                    </div>
                </div>
            </div>
            <div className="md:flex md:flex-row items-center justify-between mt-10">
                <div className="w-50">
                    <div>
                        <h3 className="md:text-6xl font-bold  text-[#07b307] text-5xl mb-5">Fast Secured and Accessible Voting System</h3>
                        <p className="md:text-2xl text-[#363836] text-xl mb-5">Let's make voting and election easy for you. This is designed to ensure a secured voting session</p>
                    </div>
                    
                        <button className="bg-[#07b307] hover:bg-[#4ade80] text-white text-xl font-bold py-3 px-2 rounded-full" onClick={ activateProvider } >Connect Wallet</button>
                    

                    </div>
                <div className="w-full">
                    <img src="/votingpics1.png" alt="logo" className="" />
                </div>
            </div>
        </div>
    );

       
}