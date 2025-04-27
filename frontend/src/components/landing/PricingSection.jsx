import { CheckCircle } from 'lucide-react'
import React from 'react'


const PricingSection = () => {
  return (
    <div id="pricing" className="bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">Pricing</h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Simple pricing for teams of all sizes
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose the plan that fits your needs. All plans come with a 14-day free trial.
          </p>
        </div>

        <div className="mt-16 lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Starter Plan */}
          <div className="rounded-lg shadow-lg overflow-hidden lg:flex lg:flex-col">
            <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
              <div>
                <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                  Starter
                </h3>
              </div>
              <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                $29
                <span className="ml-1 text-2xl font-medium text-gray-500">/mo</span>
              </div>
              <p className="mt-5 text-lg text-gray-500">Perfect for small teams just getting started.</p>
            </div>
            <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Up to 5 users</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">5GB storage</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Basic review workflow</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Email support</p>
                </li>
              </ul>
              <div className="rounded-md shadow">
                <a
                  href="/"
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="mt-10 lg:mt-0 rounded-lg shadow-lg overflow-hidden lg:flex lg:flex-col">
            <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
              <div>
                <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                  Professional
                </h3>
              </div>
              <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                $79
                <span className="ml-1 text-2xl font-medium text-gray-500">/mo</span>
              </div>
              <p className="mt-5 text-lg text-gray-500">For growing teams that need more features.</p>
            </div>
            <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Up to 20 users</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">25GB storage</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Advanced review workflow</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Text-based search</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Priority support</p>
                </li>
              </ul>
              <div className="rounded-md shadow">
                <a
                  href="/"
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="mt-10 lg:mt-0 rounded-lg shadow-lg overflow-hidden lg:flex lg:flex-col">
            <div className="px-6 py-8 bg-white sm:p-10 sm:pb-6">
              <div>
                <h3 className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-indigo-100 text-indigo-600">
                  Enterprise
                </h3>
              </div>
              <div className="mt-4 flex items-baseline text-6xl font-extrabold">
                $199
                <span className="ml-1 text-2xl font-medium text-gray-500">/mo</span>
              </div>
              <p className="mt-5 text-lg text-gray-500">Advanced features for larger organizations.</p>
            </div>
            <div className="flex-1 flex flex-col justify-between px-6 pt-6 pb-8 bg-gray-50 space-y-6 sm:p-10">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Unlimited users</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">100GB storage</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Custom review workflows</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">AI-powered image search</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">Dedicated account manager</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="ml-3 text-base text-gray-700">24/7 premium support</p>
                </li>
              </ul>
              <div className="rounded-md shadow">
                <a
                  href="#"
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Contact sales
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingSection
