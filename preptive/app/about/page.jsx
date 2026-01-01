export const metadata = {
  title: "About Us – Preptive",
  description:
    "Learn more about Preptive, a trusted platform providing educational updates, syllabus details, admit cards, results, jobs, and scholarships.",
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <article className="space-y-8">

        <header>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            About Us – Preptive
          </h1>
        </header>

        <section className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            <strong>Preptive</strong> is an educational information platform
            dedicated to providing timely and accurate updates for students and
            job seekers across India.
          </p>

          <p className="text-gray-700 leading-relaxed">
            We publish content related to syllabus updates, admit cards, exam
            dates, results, government and private job notifications, and
            scholarship opportunities.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Our mission is to simplify access to important academic and career
            information by presenting it in a clear, reliable, and easy-to-read
            format.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b pb-2">Why Trust Preptive?</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Regularly updated educational content</li>
            <li>Focus on accuracy and clarity</li>
            <li>User-first reading experience</li>
            <li>Free and accessible information</li>
          </ul>
        </section>

      </article>
    </main>
  );
}
