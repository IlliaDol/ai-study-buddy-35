import React from "react";

export default function Terms() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-sm text-zinc-200">
      <h1 className="text-2xl font-semibold mb-6">Terms of Service</h1>
      <p className="mb-4">Last updated: January 15, 2024</p>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
        <p className="mb-3">By accessing and using AI Study Buddy, you accept and agree to be bound by the terms and provision of this agreement.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Description of Service</h2>
        <p className="mb-3">AI Study Buddy is an educational platform that provides:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>AI-powered flashcard and quiz generation</li>
          <li>Structured course creation and learning paths</li>
          <li>Language learning tools and vocabulary practice</li>
          <li>Spaced repetition system for optimal retention</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
        <p className="mb-3">You agree to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the service for educational purposes only</li>
          <li>Not attempt to reverse engineer or hack the platform</li>
          <li>Respect intellectual property rights</li>
          <li>Not use the service for any illegal activities</li>
          <li>Provide accurate information when required</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">API Usage and Limits</h2>
        <p className="mb-3">When using AI features:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You are responsible for your own API keys and usage costs</li>
          <li>We implement rate limiting to prevent abuse</li>
          <li>Excessive usage may result in temporary restrictions</li>
          <li>We are not responsible for third-party API service disruptions</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Disclaimers</h2>
        <p className="mb-3">The service is provided "as is" without warranties of any kind. We do not guarantee:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Uninterrupted or error-free service</li>
          <li>Accuracy of AI-generated content</li>
          <li>Compatibility with all devices or browsers</li>
          <li>Availability of third-party AI services</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Limitation of Liability</h2>
        <p>In no event shall AI Study Buddy be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of updated terms.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Contact</h2>
        <p>For questions about these terms, contact us at terms@ai-study-buddy.com</p>
      </section>
    </main>
  );
}
