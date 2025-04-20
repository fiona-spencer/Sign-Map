import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsEnvelopeAtFill, BsTwitterX } from 'react-icons/bs';
import { FaHome } from 'react-icons/fa';

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-blue-900 bg-[#e0e8ea]'>
      <div className='w-full max-w-7xl mx-auto'>
        <div className='grid w-full justify-between sm:flex md:grid-cols-1'>
          <div className='mt-5'>
            <Link
              to='/'
              className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold'
            >
              <span className='px-4 py-5 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-600 rounded-md text-white'>
                <img className='inline-grid h-7 mb-3' src="https://www.toronto.ca/wp-content/themes/cot/img/logo.svg" alt="City of Toronto" />
              </span>
            </Link>
          </div>
          <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6'>
            <div>
              <Footer.Title title='Contact us'/>
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://www.toronto.ca/home/contact-us/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  City Page
                </Footer.Link>
                <Footer.Link
                  href='https://www.toronto.ca/home/311-toronto-at-your-service/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  311 Page
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Learn More' />
              <Footer.LinkGroup col>
                <Footer.Link
                  href='https://www.toronto.ca/'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                 City of Toronto 
                </Footer.Link>
                <Footer.Link
                  href='/reports'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Issue a Report
                </Footer.Link>
                <Footer.Link
                  href='/departments'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Service Departments
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title='Legal' />
              <Footer.LinkGroup col>
                <Footer.Link href='https://www.toronto.ca/home/privacy/'>Privacy Policy</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className='w-full sm:flex sm:items-center sm:justify-between'>
          <Footer.Copyright
            href='/'
            by="City of Toronto Reports"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 sm:mt-0 mt-4 sm:justify-center">
            <Footer.Icon href='https://www.facebook.com/cityofto/' icon={BsFacebook}/>
            <Footer.Icon href='https://www.instagram.com/cityofto/' icon={BsInstagram}/>
            <Footer.Icon href='https://x.com/cityoftoronto?lang=en' icon={BsTwitterX}/>
            <Footer.Icon href='https://mail.google.com/mail/u/0/?fs=1&to=
                                311@toronto.ca&su=&body=&tf=cm' 
                                target='_blank'
                                rel='noopener noreferrer'
                                icon={BsEnvelopeAtFill}/>
            <Footer.Icon href='/about' icon={FaHome}/>
          </div>
        </div>
      </div>
    </Footer>
  );
}