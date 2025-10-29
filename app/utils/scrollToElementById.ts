const scrollToElementById = (id: string) => {
  //Get an element by id
  const elementToSroll = document.getElementById(id);

  //If element was not found
  if (!elementToSroll) return;

  //Scroll element into view
  elementToSroll.scrollIntoView({ behavior: "instant" });
};

export default scrollToElementById;
