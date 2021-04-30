class CategorySearcher {
   constructor(searchCategories, searchUrl) {
      this.elements = {
         main: searchCategories,
         input: searchCategories.querySelector(".search-input"),
         resultsContainer: document.createElement("div"),
      };
      this.searchUrl = searchUrl;

      this.elements.resultsContainer.classList.add("result-container");
      this.elements.main.appendChild(this.elements.resultsContainer);

      this.addListeners();
   }

   addListeners() {
      let delay; 
      this.elements.input.addEventListener("input", () => {
         clearTimeout(delay);
         
         const query = this.elements.input.value;

         delay = setTimeout(() => {
            if(query.length < 1) {
               this.populateResults([]);
               return;
            }

            this.performSearch(query).then(results => {
               this.populateResults(results);
            })
         }, 500)
      });
   }

   performSearch(query) {
      //...
   }

   populateResults(results) {
      console.log("Results:");
      console.log(results);
   }
}

export default CategorySearcher;
