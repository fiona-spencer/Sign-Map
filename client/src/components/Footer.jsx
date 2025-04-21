import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsEnvelopeAtFill, BsTwitterX } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';
import pinImage from '../assets/pin.png';

export default function FooterCom() {
  return (
    <Footer container className="border-t-8 border-emerald-700 bg-[#aee3a6] text-gray-800 dark:bg-gray-900 dark:text-white shadow-md">
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Title */}
          <div className="flex flex-col items-start gap-2">
            <Link
              to="/"
              className="flex items-center text-xl font-bold text-emerald-700 dark:text-white"
            >
              <span className="bg-emerald-400 dark:bg-emerald-600 px-3 py-2 rounded-md text-white flex items-center gap-2">
                <img className="h-6" src={pinImage} alt="City of Toronto" />
              </span>
              <span className="ml-2">Drop a Pin</span>
            </Link>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
            <div>
              <Footer.Title title="Contact Us" className="text-emerald-700 dark:text-white" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.toronto.ca/home/contact-us/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
                >
                  City Page
                </Footer.Link>
                <Footer.Link
                  href="https://www.toronto.ca/home/311-toronto-at-your-service/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
                >
                  311 Page
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="Learn More" className="text-emerald-700 dark:text-white" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.toronto.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
                >
                  City of Toronto
                </Footer.Link>
                <Footer.Link
                  href="/reports"
                  className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
                >
                  Issue a Report
                </Footer.Link>
                <Footer.Link
                  href="/departments"
                  className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
                >
                  Service Departments
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>

          {/* Legal Section */}
          <div>
            <Footer.Title title="Legal" className="text-emerald-700 dark:text-white" />
            <Footer.LinkGroup col>
              <Footer.Link
                href="https://www.toronto.ca/home/privacy/"
                className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
              >
                Privacy Policy
              </Footer.Link>
            </Footer.LinkGroup>
          </div>
        </div>

        <Footer.Divider className="my-10 border-gray-500 dark:border-gray-600" />

        {/* Copyright + Social Icons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
  <Footer.Copyright
    href="/"
    by="City of Toronto Reports"
    year={new Date().getFullYear()}
    className='text-emerald-700 dark:text-white'
  />
  <div className="flex gap-4 text-lg">
    <a
      href="https://www.facebook.com/cityofto/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
    >
      <BsFacebook />
    </a>
    <a
      href="https://www.instagram.com/cityofto/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
    >
      <BsInstagram />
    </a>
    <a
      href="https://x.com/cityoftoronto?lang=en"
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
    >
      <BsTwitterX />
    </a>
    <a
      href="https://mail.google.com/mail/u/0/?fs=1&to=311@toronto.ca&su=&body=&tf=cm"
      target="_blank"
      rel="noopener noreferrer"
      className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
    >
      <BsEnvelopeAtFill />
    </a>
    <Link
      to="/about"
      className="text-emerald-700 hover:text-emerald-900 dark:text-white dark:hover:text-emerald-400"
    >
      <FaHome />
    </Link>
  </div>
</div>
 
      </div>
    </Footer>
  );
}
