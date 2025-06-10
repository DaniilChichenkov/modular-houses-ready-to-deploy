import {
  Header,
  Projects,
  QuickStats,
  Technology,
  Gallery,
  Contacts,
} from "~/components/client";

const IndexRoute = () => {
  return (
    <>
      <Header />
      <Projects />
      <QuickStats />
      <Technology />
      <Gallery />
      <Contacts />
    </>
  );
};

export default IndexRoute;
