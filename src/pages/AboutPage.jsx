import Navigation from "../components/Navigation";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Us</h1>
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-gray-600 leading-relaxed mb-4">
              Welcome to our platform! We're dedicated to providing the best
              experience for our users through innovative solutions and
              exceptional service.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our team works tirelessly to ensure that every interaction with
              our platform is smooth, efficient, and valuable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
