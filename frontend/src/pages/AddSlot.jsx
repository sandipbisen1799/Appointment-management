import { CircleX } from 'lucide-react'
import React from 'react'

function AddSlot() {
  return (

    <div className='flex flex-col items-center p-4 gap-3'>
        <h1 className=' text-2xl  font-semibold'>Add Slot </h1>

        <div className='w-full min-h-23 px-4  bg-white '>
            <div className='w-full flex p-2 justify-between px-2'>
                <h1>monday</h1>
                <button className='px-4 py-1 bg-green-500 text-white rounded-lg'>Add Slot</button>
            </div>
            
             <div className="flex flex-wrap  gap-2 items-center text-sm">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg relative">
                          9:00 10:00 AM
                          <div className="absolute top-0 right-0 text-gray-800  cursor-pointer hover:text-black  rounded-full">
                            <CircleX size={16} />
                          </div>
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg relative">
                          10:00 11:00 AM
                          <div className="absolute top-0 right-0 text-gray-800  cursor-pointer hover:text-black  rounded-full">
                            <CircleX size={16} />
                          </div>
                        </button>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg relative">
                          11:00 12:00 AM
                          <div className="absolute top-0 right-0 text-gray-800  cursor-pointer hover:text-black  rounded-full">
                            <CircleX size={16} />
                          </div>
                        </button>
                      </div>

        </div>
    </div>
  )
}

export default AddSlot