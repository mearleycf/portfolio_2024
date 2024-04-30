interface AboutProps {
  // Add any props you need for the component here
}

const About: React.FC<AboutProps> = () => {
  return (
    <section id="about">
      <div className="container mx-auto flex flex-col items-center space-x-4 px-10 py-20 md:flex-row">
        <div className="mb-16 flex flex-row items-center justify-between text-center md:mb-0 md:w-1/2 md:pr-16 md:text-left lg:flex-grow lg:pr-24">
          <div className="mb-6 flex w-full flex-col items-center justify-center lg:mb-0 lg:w-1/2">
            <h1 className="title-font mb-4 text-3xl font-medium text-white sm:text-4xl">
              Hi, I'm Mike Earley.
            </h1>
            <p className="mb-4 text-2xl font-normal text-gray-300 sm:text-3xl">
              I build things for the web.
            </p>
            <p className="mb-8 leading-relaxed">
              I'm a software engineer based in Columbus, Ohio. I specialize in
              building high-quality websites and applications.
            </p>
            <div className="flex justify-center">
              <a
                href-="#contact"
                className="inline-flex rounded border-0 bg-cyan-500 px-6 py-2 text-lg text-white hover:bg-cyan-600 focus:outline-none"
              >
                Contact Me
              </a>
              <a
                href="#projects"
                className="ml-4 inline-flex rounded border-0 bg-gray-800 px-6 py-2 text-lg text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none"
              >
                See My Past Work
              </a>
            </div>
          </div>
          <div className="ml-12 w-full md:w-1/2 lg:max-w-lg">
            <img
              className="rounded object-cover object-center"
              alt="Photo of Mike Earley"
              src="/profile.jpg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
