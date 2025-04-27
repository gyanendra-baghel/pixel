import { useState } from "react";
import {
  Shield,
  Upload,
  Download,
  Image as ImageIcon,
  Users,
  CheckCircle,
  Search,
  ArrowRight,
  Menu,
  X,
  Lock,
  Eye,
  PanelRight,
  MessageSquare,
  Zap,
  User,
  Mail
} from "lucide-react";
import Footer from "../components/Footer";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="bg-white">
      <header className="relative bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between border-b border-gray-700 py-6 md:justify-start md:space-x-10">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <a href="#" className="flex items-center">
                <div className="h-8 w-auto text-indigo-600 bg-white rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.05-.052.23-.032.28.018l3.494 3.495c.23.23.21 .34-.03.34H19.5c.207 0 .39-.166.39-.375a.375.375 0 00-.39-.375H8.27l-3.495-3.495c-.28-.28-.36-.09-.018.28L2.25 12zm0 0l8.954 8.955c.05.052.23.032.28-.018l3.494-3.495c.23-.23.21-.34-.03-.34H19.5c.207 0 .39.166.39.375a.375.375 0 00-.39.375H8.27l-3.495 3.495c-.28.28-.36.09-.018-.28L2.25 12z" />
                  </svg>
                </div>
                <span className="ml-2 text-xl font-bold text-white">Vision</span>
              </a>
            </div>

            <div className="items-center justify-end md:flex md:flex-1 lg:w-0">
              <a href="/signin" className="whitespace-nowrap text-base font-medium text-gray-300 hover:text-white">
                Sign in
              </a>
              <a
                href="/signup"
                className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <div className="relative bg-gray-800 h-screen">
        <div className=" max-w-7xl overflow-hidden mx-auto">
          <div className="mx-auto max-w-7xl">
            <div className="relative z-10 lg:w-full">
              <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8 lg:pr-0">
                <div className="mx-autolg:mx-0 lg:max-w-xl">
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Secure, organized, and intelligent image management
                  </h1>
                  <p className="mt-6 text-lg text-gray-300">
                    A complete solution for businesses and teams who need to securely manage, organize,
                    and share visual content. With powerful review workflows and smart features.
                  </p>
                  <div className="mt-8 flex items-center gap-x-6">
                    <a
                      href="/"
                      className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Get started
                    </a>
                    <a href="#demo" className="text-sm font-semibold leading-6 text-gray-300 flex items-center">
                      View demo
                      {/* Replace with your actual arrow right icon component */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
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

      {/* Demo section */}
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
                  <ImageIcon className="h-16 w-16 text-indigo-400 mx-auto" />
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

      {/* Pricing section */}
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

      {/* CTA section */}
      <div className="bg-indigo-700">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-200">Try Vision free for 14 days.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-50"
              >
                Get started
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-500 px-5 py-3 text-base font-medium text-white hover:bg-indigo-600"
              >
                Schedule demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">FAQ</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Frequently asked questions
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Everything you need to know about Vision
            </p>
          </div>

          <div className="mt-12">
            <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:space-y-0">
              <div>
                <dt className="text-lg font-medium leading-6 text-gray-900">How secure is Vision?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Vision employs enterprise-grade security with end-to-end encryption, role-based access controls, and regular security audits to ensure your visual assets remain protected at all times.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-medium leading-6 text-gray-900">Can I integrate Vision with our existing tools?</dt>
                <dd className="mt-2 text-base text-gray-500">
                  Yes! Vision offers API access and integrations with popular design tools, content management systems, and team collaboration platforms.
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
