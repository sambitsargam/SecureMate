/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../context/SidebarContext";
import { AuthContext } from "../utils/AuthProvider";
import { Button } from "@nextui-org/react";
import { SearchIcon, MoonIcon, SunIcon, MenuIcon } from "../icons";
import { Input, WindmillContext } from "@windmill/react-ui";
import { MetaMaskButton } from "@metamask/sdk-react-ui";
import { useWeb3Modal } from '@web3modal/ethers5/react'


function Header() {
  const { mode, toggleMode } = useContext(WindmillContext);
  const { toggleSidebar } = useContext(SidebarContext);
  const { address, connect, disconnect, web3Provider } =
    useContext(AuthContext);

  const [avatar, setAvatar] = useState('');
  const [ens, setENS] = useState('');

  //fetch the address from local storage
  const addr = localStorage.getItem("address");
  const apiUrl = `https://ensdata.net/${addr}`;
  const { open } = useWeb3Modal()


  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setAvatar(data.avatar);
        setENS(data.ens);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  console.log("avatar", avatar);
  console.log("ens", ens);

  return (
    <header className="z-30 w-full py-4 bg-white shadow-bottom dark:bg-gray-800">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-blue-600 dark:text-blue-300">
        {/* <!-- Mobile hamburger --> */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-blue"
          onClick={toggleSidebar}
          aria-label="Menu"
        >
          <MenuIcon className="w-6 h-6" aria-hidden="true" />
        </button>
        <br></br>
        <br></br>
        <br></br>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* <!-- Theme toggler --> */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-blue"
              onClick={toggleMode}
              aria-label="Toggle color mode"
            >
              {mode === "dark" ? (
                <SunIcon className="w-5 h-5" aria-hidden="true" />
              ) : (
                <MoonIcon className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </li>
          

          {avatar === undefined || !address ? (
              <img
                class=" hidden md:block  w-10 h-10 rounded-full shadow-lg"
                src={"https://noun-api.com/beta/pfp"}
                alt="Bonnie image"
              />
            ) : (
              <img
                class=" hidden md:block  w-10 h-10 rounded-full shadow-lg"
                src={avatar}
                alt="Bonnie image"
              />
            )}
          {ens === undefined || !address ? (<div className="text-gray-600 text-xl dark:text-gray-300">{address} </div>) :
              (<div className="text-gray-600 text-xl dark:text-gray-300">
                {ens}
              </div>)}

          <li className="flex flex-row items-center">
            {web3Provider ? (
             
              <Button
                onClick={() => {
                  disconnect();
                }}
                color="gradient"
                auto
                className="mr-2"
              >
                Disconnect
              </Button>
              
            ) : (
              <Button
                onClick={() => {
                  connect();
                }}
                color="gradient"
                auto
                className="mr-2"
              >
                Connect
              </Button>
            )}

            
          </li>
          <li className="flex flex-row items-center">
          <MetaMaskButton theme={"light"} color="white"></MetaMaskButton>
          </li>
          <li>
          <Button  color="gradient"
                auto
                className="mr-2" onClick={() => open()}>Open Connect Modal</Button>
          </li>
        </ul>
      </div>
    </header>
  );
}


export default Header;

