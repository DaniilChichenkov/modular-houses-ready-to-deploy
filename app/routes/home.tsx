import {
  Header,
  Projects,
  QuickStats,
  Technology,
  Gallery,
  Contacts,
  Footer,
} from "~/components/client";

const HomeRoute = () => {
  return (
    <>
      <Header />
      <Projects />
      <QuickStats />
      <Technology />
      <Gallery />
      <Contacts />
      <Footer />
    </>
  );
};

export default HomeRoute;
