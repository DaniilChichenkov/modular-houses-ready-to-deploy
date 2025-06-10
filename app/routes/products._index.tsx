import { redirect, type LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return redirect("/");
};

export default function ProductsRedirect() {
  return null;
}
