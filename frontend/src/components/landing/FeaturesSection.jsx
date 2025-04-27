import { CheckCircle, Download, PanelRight, Search, Shield, Upload } from 'lucide-react';
import React from 'react'


const FeaturesSection = () => {
  const features = [
    {
      title: "Role-Based Access",
      description: "Different permissions for administrators and regular users with secure authentication",
      icon: <Shield className="h-6 w-6 text-indigo-600" />
    },
    {
      title: "Image Management",
      description: "Upload, categorize, and organize images into custom album collections",
      icon: <Upload className="h-6 w-6 text-indigo-600" />
    },
    {
      title: "Review Workflow",
      description: "Admin review process ensures only approved content reaches your audience",
      icon: <CheckCircle className="h-6 w-6 text-indigo-600" />
    },
    {
      title: "Controlled Access",
      description: "View-only gallery browsing with selective download permissions",
      icon: <Download className="h-6 w-6 text-indigo-600" />
    },
    {
      title: "Smart Search",
      description: "Find images quickly with face detection and text-based search capabilities",
      icon: <Search className="h-6 w-6 text-indigo-600" />
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive dashboard for monitoring uploads and managing users",
      icon: <PanelRight className="h-6 w-6 text-indigo-600" />
    }
  ];


  return (
    <div id="features" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">Features</h2>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for image management
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our comprehensive platform gives you complete control over your visual content.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="pt-6">
                <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center rounded-md bg-indigo-200 p-3 shadow-lg">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">{feature.title}</h3>
                    <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection
