import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { BsFacebook, BsInstagram, BsEnvelopeAtFill, BsTwitterX, BsGithub } from 'react-icons/bs';
import { FaHome, FaMapPin } from 'react-icons/fa';
import pinImage from '../assets/pin.png';

export default function FooterCom() {

  return (
    <Footer container className="border-t-8 border-emerald-700 bg-[#c6d8c3] text-gray-800 dark:bg-gray-900 dark:text-white shadow-md z-100">
  <div className="w-full max-w-7xl mx-auto px-2 h-full flex flex-col">
  <div className="flex flex-col sm:flex-row justify-between flex-grow">
    {/* Logo & Title */}
    <div className="flex flex-col items-start gap-2 pb-7">
      <Link
        to="/"
        className="flex items-center text-xl font-bold text-emerald-700 dark:text-white"
      >
        <span className="bg-emerald-400 dark:bg-emerald-600 px-3 py-2 rounded-2xl text-white flex items-center gap-2">
          <img className="h-6" src={pinImage} alt="map" />
        </span>
        <span className="ml-2">Drop a Pin</span>
      </Link>
    </div>
        

          {/* Footer Links */}
          <div className="grid grid-cols-3 gap-4 text-sm md:text-base">
          <div>
              <Footer.Title title="Learn More" className="text-emerald-700 dark:text-white font-extrabold text-md" />
              <Footer.LinkGroup col className='mx-4'>
                <Footer.Link
                  href="/"
                  target="_self"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
                >
                  Site Features
                </Footer.Link>
                <Footer.Link
                  href="/startHere"
                  className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
                >
                  Account Info
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Contact Us" className="text-emerald-700 dark:text-white font-extrabold text-md" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/contactSupport"
                  target="_self"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
                >
                  Contact Page
                </Footer.Link>
                <Footer.Link
                  href="/help"
                  target="_self"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
                >
                  Help
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Social" className="text-emerald-700 dark:text-white font-extrabold text-md" />
              <Footer.LinkGroup col>
              <a
      href="/sendEmail"
      target="_self"
      rel="noopener noreferrer"
      className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400 flex items-center"
    >
      Email <BsEnvelopeAtFill className='ml-2' />
    </a>
    <a
      href="https://github.com/fiona-spencer"
      target="_self"
      rel="noopener noreferrer"
      className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400 flex items-center"
    >
      Github <BsGithub className='ml-2' />
    </a>
              </Footer.LinkGroup>
            </div>


          </div>
        </div>

        <Footer.Divider className="mb-2 border-gray-500 dark:border-gray-600" />

        {/* Copyright + Social Icons */}
        <div className="flex flex-col sm:items-center sm:justify-between gap-4 text-sm text-gray-600 dark:text-gray-400 flex mt-2">
  <Footer.Copyright
    href="/"
    by="Fiona Spencer"
    year={new Date().getFullYear()}
    className='text-gray-700 dark:text-white font-bold'
  />
</div>
 
      </div>
    </Footer>
  )
}
