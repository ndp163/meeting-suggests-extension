let observer = new MutationObserver(function(mutations) {
    console.log("MUTATION OBSERVER");

    console.log({ mutations });
});

let observerConfig = {
  attributes: true,
  attributeOldValue: true,
  attributeFilter: ['class'],
  subtree: true,
};

const participants_list = document.querySelector('div[role="listitem"]');

observer.observe( participants_list, observerConfig );