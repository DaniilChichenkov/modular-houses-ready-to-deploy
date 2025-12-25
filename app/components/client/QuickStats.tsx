// const QuickStatsItem = () => {
//   return (
//     <>
//       <article classNameName="flex flex-col items-center gap-4 bg-white rounded-lg py-5">
//         <p classNameName="font-bold text-2xl md:text-3xl text-black">15+</p>
//         <p classNameName="text-xl font-normal text-gray-900">Лет опыта</p>
//       </article>
//     </>
//   );
// };

const QuickStats = () => {
  return (
    // <section classNameName="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-x-12 lg:gap-x-20 gap-y-5 md:gap-y-10 bg-gray-50 p-8 md:p-12 lg:px-16 lg:py-24">
    //   <QuickStatsItem />
    //   <QuickStatsItem />
    //   <QuickStatsItem />
    //   <QuickStatsItem />
    // </section>
    <div className="w-full bg-gray-50 py-10">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl/tight font-bold text-gray-900 sm:text-4xl">
            Features for growth
          </h2>

          <p className="mt-4 text-lg text-pretty text-gray-700">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis
            tenetur, nemo quam voluptas sunt impedit dolorem asperiores aliquid
            doloribus fugit.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-6">
            <div className="inline-flex rounded-lg bg-gray-100 p-3 text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                ></path>
              </svg>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              High performance
            </h3>

            <p className="mt-2 text-pretty text-gray-700">
              Lightning-quick load times optimized for every device
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <div className="inline-flex rounded-lg bg-gray-100 p-3 text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                ></path>
              </svg>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Enterprise security
            </h3>

            <p className="mt-2 text-pretty text-gray-700">
              Enterprise-grade security built into every layer
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <div className="inline-flex rounded-lg bg-gray-100 p-3 text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"
                ></path>
              </svg>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Highly configurable
            </h3>

            <p className="mt-2 text-pretty text-gray-700">
              Adapt every aspect to match your brand and needs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
