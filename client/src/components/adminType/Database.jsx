import React from 'react'
import PinData from './pinData';
import UserData from './userData';
import Settings from '../../pages/Settings'

export default function Database() {
  return (
    <div className='pt-10 md:p-0 '>
      <div className='bg-[#f7f2edda] dark:bg-[#2a2f3a] rounded-sm'>
      <UserData/>
      <PinData/>
      <Settings/>
      </div>
    </div>
  )
}
