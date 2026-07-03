import { Link } from 'react-router-dom';
import { DocumentTextIcon, AcademicCapIcon, ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: DocumentTextIcon,
    title: 'Motivation Letters',
    description: 'Generate professional cover letters tailored to specific roles and companies with AI precision.',
  },
  {
    icon: AcademicCapIcon,
    title: 'Recommendation Letters',
    description: 'Create HR-compliant recommendation letters that highlight candidate strengths effectively.',
  },
  {
    icon: ShieldCheckIcon,
    title: 'HR-Standard Output',
    description: 'All documents follow professional HR writing standards with A4 PDF export.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
              <DocumentTextIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">CareerDocs AI</span>
          </div>
          <Link to="/dashboard" className="btn-primary text-sm">
            Get Started
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Professional HR Documents,
            <span className="block text-primary-500">Generated Instantly</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Stop spending hours writing cover letters and recommendation letters. CareerDocs AI creates
            HR-compliant, professionally formatted documents from structured inputs — no prompt writing required.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/dashboard" className="btn-primary text-base">
              Start Creating Free
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
            <Link to="/motivation-letter" className="btn-secondary text-base">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Everything you need for professional HR documents
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
            Our AI-powered platform handles the writing so you can focus on what matters.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => (
              <div key={feature.title} className="card group hover:shadow-md transition-shadow">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white">Ready to create your first document?</h2>
          <p className="mt-4 text-primary-100">
            No prompts. No templates. Just structured inputs and professional outputs.
          </p>
          <Link to="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-base font-semibold text-primary-600 shadow-sm hover:bg-primary-50 transition-colors">
            Get Started Now
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white px-4 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} CareerDocs AI. All rights reserved.
      </footer>
    </div>
  );
}
