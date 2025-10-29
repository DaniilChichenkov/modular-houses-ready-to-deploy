import { useEffect } from "react";

import scrollToElementById from "~/utils/scrollToElementById";

const ScrollToElement = () => {
  useEffect(() => {
    const url = new URL(window.location.href);
    const search = url.searchParams;
    const scrollToElement = search.get("scrollToElement");

    //If scrollToElement is provided - Scroll element into view and delete url flag
    if (scrollToElement) {
      scrollToElementById(scrollToElement);

      search.delete("scrollToElement");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  return null;
};

export default ScrollToElement;
