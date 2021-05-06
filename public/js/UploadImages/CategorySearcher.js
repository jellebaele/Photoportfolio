class CategorySearcher {
   constructor(searchCategories, searchUrl, queryLimit = 5) {
      this.elements = {
         main: searchCategories,
         input: searchCategories.querySelector(".search-input"),
         resultsContainer: document.createElement("div"),
      };
      this.searchUrl = searchUrl;

      this.elements.resultsContainer.classList.add("search-result-container");
      this.elements.main.appendChild(this.elements.resultsContainer);

      this.queryLimit = queryLimit;

      this.addListeners();
   }

   addListeners() {
      let delay;
      this.elements.input.addEventListener("input", () => {
         clearTimeout(delay);

         const query = this.elements.input.value;
         this.setLoading(true);
         delay = setTimeout(() => {
            if (query.length < 1) {
               this.populateResults([]);
               this.setLoading(false);
               return;
            }

            this.performSearch(query, this.queryLimit);
         }, 500);
      });

      this.elements.input.addEventListener("focus", () => {
         this.elements.resultsContainer.classList.add("search-result-container--visible");
         this.getTopCategories();
      });

      this.elements.input.addEventListener("blur", () => {
         this.elements.resultsContainer.classList.remove("search-result-container--visible");
      });
   }

   async performSearch(query, limit = this.queryLimit) {

      await fetch(`/api/category-search?limit=${limit}&search=${query}`, {
         method: "GET",
      })
         .then((response) => {
            if (response.status !== 200) {
               throw new Error("Something went wrong with the search for categories");
            }
            return response.json();
         })
         .then((response) => {
            this.populateResults(response);

         })
         .catch((error) => {
            console.error(error);
            return [];
         })
         .finally(() => {
            this.setLoading(false);
         });
   }

   async getTopCategories() {
      this.performSearch("", this.queryLimit);
   }

   setLoading(isLoading) {
      this.elements.main.classList.toggle("search-category--loading", isLoading);
   }

   populateResults(results) {
      console.log("Results:");
      console.log(results);
      while (this.elements.resultsContainer.firstChild) {
         this.elements.resultsContainer.removeChild(this.elements.resultsContainer.firstChild);
      }

      console.log("populating...");
      for (const result of results) {
         let resultElement = this.createResultElement(result);
         this.elements.resultsContainer.appendChild(resultElement);
      }
   }

   createResultElement(result) {
      const anchorElement = document.createElement("div");
      anchorElement.classList.add("search-result");
      // anchorElement.addEventListener("click", () => alert('click'));
      anchorElement.insertAdjacentHTML("afterbegin", this.createAnchorElement(result));

      // if ("href" in result) {
      //    anchorElement.setAttribute('href', result.href);
      // }

      return anchorElement;
   }

   createAnchorElement(result) {
      return `<div class="search-title">${result.title}</div>
      <p class="search-amount">Amount of images: ${result.amountOfPictures}</p>
      `;
   }
}

export default CategorySearcher;
