const { algoliasearch, instantsearch } = window;

const search = instantsearch({
  indexName: 'blogpost',
  searchClient: algoliasearch('F905EVUSH8', 'dc43b8cf2b759f82be787d8943f1dae1'),
  future: { preserveSharedStateOnUnmount: true },
  insights: true,
});

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
//   instantsearch.widgets.clearRefinements({
//     container: '#clear-refinements',
//   }),
//   instantsearch.widgets.refinementList({
//     container: '#category-list',
//     attribute: 'category',
//   }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: (hit, { html, components, sendEvent }) => html`
         <li class="media">
            <div class="media-body">
                <h3 class="mt-0 mb-1"><a onClick="${() => sendEvent('click', hit, 'Title Clicked')}" href="${hit.permalink}">${components.Highlight({hit, attribute: "title"})}</a></h3>
                <p>${components.Highlight({hit, attribute: "desc"})}</p>
                <a class="continue-read" onClick="${() => sendEvent('click', hit, 'Continue-Reading Clicked')}" href="${hit.permalink}">Continue reading</a>
                <hr/>
            </div>
        </li>
      `,
    },
  }),
  instantsearch.widgets.configure({
    hitsPerPage: 3,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
  }),
]);

search.start();

