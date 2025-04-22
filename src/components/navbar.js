'use client';
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFlask, faUsers, faProjectDiagram, faRightToBracket } from "@fortawesome/free-solid-svg-icons";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
    const { data: session } = useSession();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    // Helper function to get the first name or initials
    const getDisplayName = (name) => {
        if (!name) return "User"; // Fallback if the name is not available
        const nameParts = name.split(" ");
        if (nameParts.length === 1) {
            return nameParts[0]; // Single name (e.g., "John")
        }
        const initials = nameParts.slice(0, -1).map((part) => part[0]).join(""); // Get initials of first and middle names
        const lastName = nameParts[nameParts.length - 1]; // Get the last name
        return `${initials}${lastName}`; // Combine initials with the last name
    };

    return (
        <nav className="bg-[#143D60] text-white py-4 px-8 flex flex-row justify-between items-center">
            {/* Logo Section */}
            <div className="basis-1/2 flex flex-row items-center">
                <Image src="/logo.png" alt="FSPL Logo" width={30} height={30} />
                <p className="text-xl font-bold ml-2">FSPL-StrainDB</p>
            </div>

            {/* Links and Dropdown Section */}
            <div className="basis-1/2 flex flex-row items-center justify-end space-x-10 relative">
                {/* Always visible Home link */}
                <Link href="/" className="hover:underline font-semibold flex items-center space-x-2">
                    <FontAwesomeIcon icon={faHome} size="md" />
                    <span>Home</span>
                </Link>

                {/* Conditionally render links for logged-in users */}
                {session && (
                    <>
                        <Link href="/strains" className="hover:underline font-semibold flex items-center space-x-2">
                            <FontAwesomeIcon icon={faFlask} size="md" />
                            <span>Strains</span>
                        </Link>
                        <Link href="/personnel" className="hover:underline font-semibold flex items-center space-x-2">
                            <FontAwesomeIcon icon={faUsers} size="md" />
                            <span>Personnel</span>
                        </Link>
                        <Link href="/projects" className="hover:underline font-semibold flex items-center space-x-2">
                            <FontAwesomeIcon icon={faProjectDiagram} size="md" />
                            <span>Projects</span>
                        </Link>
                    </>
                )}

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
                            <span className="font-semibold">{getDisplayName(session.user.name)}</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
                            <FontAwesomeIcon icon={faRightToBracket} size="md" />
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