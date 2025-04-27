import { Image, Zap } from 'lucide-react'
import React from 'react'


const DemoSection = () => {
  return (
    <div id="demo" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">See it in action</h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Powerful gallery management
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Watch how easy it is to manage your image collection with our platform.
          </p>
        </div>

        <div className="mt-12 rounded-lg overflow-hidden shadow-xl bg-gray-100 lg:mx-auto lg:max-w-4xl">
          {/* This is where a video or interactive demo would be placed */}
          <div className="aspect-w-16 aspect-h-9">
            <div className="flex items-center justify-center h-full bg-gray-800 p-8">
              <div className="text-center">
                <Image className="h-16 w-16 text-indigo-400 mx-auto" />
                <p className="mt-4 text-xl font-medium text-white">Interactive Demo</p>
                <p className="mt-2 text-gray-400">Click to experience our application firsthand</p>
                <button className="mt-6 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700">
                  Watch Demo <Zap className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoSection
