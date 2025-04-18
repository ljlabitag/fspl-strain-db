'use client';
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFlask, faUsers, faProjectDiagram, faRightToBracket, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    return (
        <nav className="bg-[#143D60] text-white py-4 px-8 flex flex-row justify-between items-center">
            <div className="basis-7/10 flex flex-row items-center">
                <Image src="/logo.png" alt="FSPL Logo" width={30} height={30} />
                <p className="text-xl font-bold ml-2">FSPL-StrainDB</p>
            </div>
            <div className="basis-3/10 flex flex-row justify-evenly py-auto relative">
                <Link href="/" className="hover:underline font-semibold">
                    <FontAwesomeIcon icon={faHome} size="lg" />
                </Link>
                <Link href="/strains" className="hover:underline font-semibold">
                    <FontAwesomeIcon icon={faFlask} size="lg" />
                </Link>
                <Link href="/personnel" className="hover:underline font-semibold">
                    <FontAwesomeIcon icon={faUsers} size="lg" />
                </Link>
                <Link href="/projects" className="hover:underline font-semibold">
                    <FontAwesomeIcon icon={faProjectDiagram} size="lg" />
                </Link>

                {/* Dropdown for Login/Logout */}
                <div className="relative">
                    {session ? (
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
                            <Image
                                src={session.user.image || "/default-avatar.png"}
                                alt="User Avatar"
                                width={30}
                                height={30}
                                className="rounded-full"
                            />
                            <span className="font-semibold">{session.user.name}</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faRightToBracket} size="lg" />
                            <span className="font-semibold">Login</span>
                        </div>
                    )}

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg z-50">
                            {session ? (
                                <div
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        signOut();
                                    }}
                                >
                                    Logout
                                </div>
                            ) : (
                                <div
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        signIn("google");
                                    }}
                                >
                                    Login with Google
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;