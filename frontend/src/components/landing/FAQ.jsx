import React from 'react'


const FAQ = () => {
  return (
    < div className="bg-white py-16 sm:py-24" >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">FAQ</h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Everything you need to know about Pixel
          </p>
        </div>

        <div className="mt-12">
          <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:space-y-0">
            <div>
              <dt className="text-lg font-medium leading-6 text-gray-900">How secure is Pixel?</dt>
              <dd className="mt-2 text-base text-gray-500">
                Pixel employs enterprise-grade security with end-to-end encryption, role-based access controls, and regular security audits to ensure your visual assets remain protected at all times.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium leading-6 text-gray-900">Can I integrate Pixel with our existing tools?</dt>
              <dd className="mt-2 text-base text-gray-500">
                Yes! Pixel offers API access and integrations with popular design tools, content management systems, and team collaboration platforms.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium leading-6 text-gray-900">How does the review workflow function?</dt>
              <dd className="mt-2 text-base text-gray-500">
                Administrators can set up custom review workflows with multiple approval stages. Reviewers can comment, approve, or request changes directly within the platform.
              </dd>
            </div>
            <div>
              <dt className="text-lg font-medium leading-6 text-gray-900">Can we upgrade our plan as our team grows?</dt>
              <dd className="mt-2 text-base text-gray-500">
                Absolutely! You can upgrade your plan at any time. When you upgrade, your data, settings, and configurations will transfer seamlessly to your new plan.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div >
  )
}

export default FAQ
