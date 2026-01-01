export const metadata = {
  title: "Terms and Conditions – Preptive",
  description:
    "Read Preptive’s Terms and Conditions to understand the rules, usage guidelines, and limitations while accessing educational updates, syllabus, admit cards, results, jobs, and scholarships.",
};

export default function TermsAndConditionsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="space-y-8">

        {/* Page Title */}
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Terms and Conditions – Preptive
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* Intro */}
        <section className="space-y-4">
          <p className="text-base leading-relaxed text-gray-700">
            Welcome to <strong>Preptive</strong> (
            <a
              href="https://www.preptive.in"
              className="text-blue-600 underline"
            >
              https://www.preptive.in
            </a>
            ). By accessing and using this website, you agree to comply with and
            be bound by the following Terms and Conditions. If you do not agree
            with any part of these terms, please do not use our website.
          </p>
        </section>

        {/* Website Usage */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Website Usage
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Preptive provides informational content related to{" "}
            <strong>
              educational updates, syllabus, admit cards, exam dates, results,
              government and private jobs, and scholarships
            </strong>
            . All content is published for general information purposes only.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            You agree to use this website only for lawful purposes and in a way
            that does not violate any applicable laws or regulations.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Intellectual Property Rights
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Unless otherwise stated, Preptive owns the intellectual property
            rights for all content published on this website, including text,
            graphics, logos, and layout.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            You may view and read content for personal use only. Republishing,
            copying, or redistributing content without written permission is
            strictly prohibited.
          </p>
        </section>

        {/* Accuracy */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Content Accuracy
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            While we strive to provide accurate and up-to-date information,
            Preptive makes no warranties or guarantees regarding the accuracy,
            completeness, or reliability of any content.
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            Users are advised to verify information from official sources before
            making decisions based on content published on Preptive.
          </p>
        </section>

        {/* External Links */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            External Links
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Our website may contain links to external websites for additional
            information. Preptive does not control or take responsibility for
            the content, privacy policies, or practices of any third-party
            websites.
          </p>
        </section>

        {/* Limitation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Limitation of Liability
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Preptive shall not be held liable for any direct, indirect,
            incidental, or consequential damages arising out of the use or
            inability to use this website.
          </p>
        </section>

        {/* User Conduct */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            User Conduct
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Users must not misuse this website by introducing viruses,
            attempting unauthorized access, or engaging in activities that may
            harm the website or its users.
          </p>
        </section>

        {/* Changes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Changes to These Terms
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            Preptive reserves the right to update or modify these Terms and
            Conditions at any time without prior notice. Continued use of the
            website constitutes acceptance of the revised terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Governing Law
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
            These Terms and Conditions shall be governed and interpreted in
            accordance with the laws of India.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Contact Us
          </h2>
          <p className="text-base text-gray-700 leading-relaxed">
  If you have any questions regarding these Terms and Conditions, you may{" "}
  <a
    href="/contact"
    className="text-blue-600 underline hover:text-blue-800"
  >
    contact
  </a>{" "}
  us through our website.
</p>

        </section>

      </article>
    </main>
  );
}
