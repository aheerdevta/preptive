export const metadata = {
  title: "Privacy Policy – Preptive",
  description:
    "Preptive Privacy Policy explains how we collect, use, and protect user data while delivering educational updates, syllabus, admit cards, results, jobs, and scholarships.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="space-y-8">

        {/* Page Title */}
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Privacy Policy – Preptive
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* Intro */}
        <section className="space-y-4">
          <p className="text-base leading-relaxed text-gray-700">
            At <strong>Preptive</strong> (
            <a
              href="https://www.preptive.in"
              className="text-blue-600 underline"
            >
              https://www.preptive.in
            </a>
            ), we respect the privacy of our visitors. This Privacy Policy
            explains what information is collected, how it is used, and how your
            data is protected when you use our website.
          </p>

          <p className="text-base leading-relaxed text-gray-700">
            Preptive publishes reliable information related to{" "}
            <strong>
              latest educational updates, syllabus, admit cards, exam dates,
              results, government and private jobs, scholarships
            </strong>{" "}
            and other academic notifications.
          </p>
        </section>

        {/* Information We Collect */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Information We Collect
          </h2>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-800">
              1. Personal Information
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              We do not require users to provide personal information to access
              our content. However, if you voluntarily contact us via email or
              forms, we may collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Name</li>
              <li>Email address</li>
              <li>Message details</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-gray-800">
              2. Non-Personal Information
            </h3>
            <p className="text-base text-gray-700 leading-relaxed">
              When you visit Preptive, certain non-personal data is collected
              automatically, including:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Browser type</li>
              <li>Device information</li>
              <li>IP address</li>
              <li>Pages visited</li>
              <li>Date and time of visit</li>
            </ul>
            <p className="text-base text-gray-700 leading-relaxed">
              This information helps us analyze traffic and improve content
              quality.
            </p>
          </div>
        </section>

        {/* Usage */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Improve website performance and user experience</li>
            <li>Understand which educational topics are most useful</li>
            <li>Respond to queries or feedback</li>
            <li>Maintain website security</li>
          </ul>
          <p className="text-base text-gray-700 leading-relaxed">
            We do <strong>not sell, trade, or rent</strong> users’ personal
            information to third parties.
          </p>
        </section>

        {/* Cookies */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Cookies and Web Beacons
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Preptive uses cookies to store visitor preferences and optimize
            content based on browsing behavior.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            You can disable cookies through your browser settings. Some features
            may not function properly if cookies are disabled.
          </p>
        </section>

        {/* Third Party */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Third-Party Services
          </h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Google Analytics</li>
            <li>Google Search Console</li>
            <li>Advertising or analytics platforms</li>
          </ul>
          <p className="text-base text-gray-700 leading-relaxed">
            These services operate under their own privacy policies. Preptive
            does not control how third-party services collect or use data.
          </p>
        </section>

        {/* Children */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Children’s Information
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Preptive does not knowingly collect personal data from children under
            13 years of age.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            If you believe your child has shared personal information, please
            contact us immediately so we can remove it.
          </p>
        </section>

        {/* Security */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Data Security
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            We take reasonable measures to protect user data. However, no online
            transmission method is completely secure.
          </p>
        </section>

        {/* Consent */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Consent
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            By using Preptive, you agree to this Privacy Policy and its terms.
          </p>
        </section>

        {/* Updates */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Updates to This Privacy Policy
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            We may update this policy periodically. Any changes will be posted
            on this page with an updated date.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Contact Us
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            If you have any questions regarding this Privacy Policy, please
            contact us through our website.
          </p>
        </section>

      </article>
    </main>
  );
}
