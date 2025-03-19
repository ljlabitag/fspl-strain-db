import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faFlask, faUsers, faProjectDiagram } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <nav className="bg-[#143D60] text-white py-4 px-8 flex flex-row justify-between items-center">
      <div className="basis-7/10 flex flex-row items-center">
        <Image src="/logo.png" alt="FSPL Logo" width={30} height={30} />
        <p className="text-xl font-bold ml-2">FSPL-StrainDB</p>
      </div>
      <div className="basis-3/10 flex flex-row justify-evenly py-auto">
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
      </div>
    </nav>
  );
};

export default Navbar;