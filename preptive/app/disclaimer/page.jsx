export const metadata = {
  title: "Disclaimer – Preptive",
  description:
    "Preptive Disclaimer explains content accuracy, verification from official sources, responsibility limitations, and the informational purpose of educational updates, jobs, results, and scholarships.",
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="space-y-8">

        {/* Page Header */}
        <header className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Disclaimer – Preptive
          </h1>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* Introduction */}
        <section className="space-y-4">
          <p className="text-base text-gray-700 leading-relaxed">
            The information provided on <strong>Preptive</strong> (
            <a
              href="https://www.preptive.in"
              className="text-blue-600 underline"
            >
              https://www.preptive.in
            </a>
            ) is published in good faith and for general informational purposes
            only.
          </p>

          <p className="text-base text-gray-700 leading-relaxed">
            Preptive publishes content related to{" "}
            <strong>
              educational updates, syllabus details, admit cards, exam dates,
              results, government and private jobs, and scholarships
            </strong>
            .
          </p>
        </section>

        {/* Accuracy & Verification */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Accuracy and Verification
          </h2>

          <p className="text-base text-gray-700 leading-relaxed">
            We make every reasonable effort to ensure that the information
            published on Preptive is accurate and verified from official and
            reliable sources such as government portals, examination authorities,
            and authorized organizations.
          </p>

          <p className="text-base text-gray-700 leading-relaxed">
            However, despite careful verification, Preptive does not provide any
            warranties regarding the absolute completeness or accuracy of the
            information. Users are strongly advised to cross-check important
            details from the respective official websites before taking any
            action.
          </p>
        </section>

        {/* No Professional Advice */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            No Professional or Official Advice
          </h2>

          <p className="text-base text-gray-700 leading-relaxed">
            While we verify information using official sources, the content
            published on Preptive should not be treated as a substitute for
            official notifications, legal advice, financial advice, or
            professional guidance.
          </p>
        </section>

        {/* External Links */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            External Links
          </h2>

          <p className="text-base text-gray-700 leading-relaxed">
            Preptive may contain links to external websites for additional
            information or reference. We do not have control over the content,
            availability, or accuracy of these external sites and are not
            responsible for any loss or damage arising from their use.
          </p>
        </section>

        {/* Consent */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
            Consent
          </h2>

          <p className="text-base text-gray-700 leading-relaxed">
  By using our website, you hereby acknowledge and agree to this Disclaimer and
  its{" "}
  <a
    href="/terms-and-conditions"
    className="text-blue-600 underline hover:text-blue-800"
  >
    terms
  </a>
  .
</p>

        </section>

      </article>
    </main>
  );
}
