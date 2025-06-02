const QuickStatsItem = () => {
  return (
    <>
      <article className="flex flex-col items-center gap-4 bg-white rounded-lg py-5">
        <p className="font-bold text-2xl md:text-3xl text-black">15+</p>
        <p className="text-xl font-normal text-gray-900">Лет опыта</p>
      </article>
    </>
  );
};

const QuickStats = () => {
  return (
    <section className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-x-12 lg:gap-x-20 gap-y-5 md:gap-y-10 bg-gray-50 p-8 md:p-12 lg:px-16 lg:py-24">
      <QuickStatsItem />
      <QuickStatsItem />
      <QuickStatsItem />
      <QuickStatsItem />
    </section>
  );
};

export default QuickStats;
