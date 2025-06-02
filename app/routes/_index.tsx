import { redirect } from "@remix-run/react";

export const loader = () => {
  return redirect("/home");
};

const Index = () => {
  return null;
};

export default Index;
