import React from "react";

export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-sm text-zinc-200">
      <h1 className="text-2xl font-semibold mb-6">Privacy Policy</h1>
      <p className="mb-4">Last updated: January 15, 2024</p>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
        <p className="mb-3">AI Study Buddy collects minimal personal information to provide you with the best learning experience:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Usage Data:</strong> We collect anonymous usage analytics to improve our service, including study patterns, feature usage, and performance metrics.</li>
          <li><strong>Local Storage:</strong> Your study progress, saved decks, and preferences are stored locally in your browser using localStorage.</li>
          <li><strong>API Keys:</strong> If you provide API keys for AI services, they are stored locally and never transmitted to our servers.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>To provide and maintain the AI Study Buddy service</li>
          <li>To improve our learning algorithms and user experience</li>
          <li>To analyze usage patterns and optimize performance</li>
          <li>To provide customer support and respond to inquiries</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Data Security</h2>
        <p className="mb-3">We implement appropriate security measures to protect your information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>All data transmission is encrypted using HTTPS</li>
          <li>Local storage data remains on your device</li>
          <li>API keys are stored locally and never shared</li>
          <li>We do not sell or rent your personal information</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
        <p className="mb-3">You have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Access your personal data stored locally</li>
          <li>Delete your data by clearing browser storage</li>
          <li>Opt out of analytics collection</li>
          <li>Contact us with privacy concerns</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@ai-study-buddy.com</p>
      </section>
    </main>
  );
}
