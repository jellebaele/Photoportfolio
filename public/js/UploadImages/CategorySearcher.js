class CategorySearcher {
   constructor(searchCategoriesSection, searchUrl, queryLimit = 5, alertHandler) {
      this.elements = {
         main: searchCategoriesSection,
         input: searchCategoriesSection.querySelector(".search-input"),
         resultsContainer: searchCategoriesSection.querySelector(".search-result-container"),
      };
      this.searchUrl = searchUrl;
      this.queryLimit = queryLimit;
      this.alertHandler = alertHandler;
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
         this.performSearch("")
      });

      document.body.addEventListener('click', (e) => {
         if (!this.elements.main.contains(e.target)) {
            this.elements.resultsContainer.classList.remove("search-result-container--visible");
         }
      });
   }

   async performSearch(query, limit = this.queryLimit) {
      await fetch(`${this.searchUrl}?limit=${limit}&search=${query}`, {
         method: "GET",
      })
         .then((response) => {
            if (response.status !== 200) {
               throw new Error(response.statusText);
            }
            return response.json();
         })
         .then((response) => {
            this.populateResults(response);
         })
         .catch((error) => {
            console.error(error);
            this.populateResults([]);
            this.alertHandler.showWarning(error.message);
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
      while (this.elements.resultsContainer.firstChild) {
         this.elements.resultsContainer.removeChild(this.elements.resultsContainer.firstChild);
      }
      
      for (const result of results) {
         let resultElement = this.createResultElement(result);
         this.elements.resultsContainer.appendChild(resultElement);
      }
   }

   createResultElement(result) {
      const mainTag = document.createElement("div");
      mainTag.classList.add("search-result");
      mainTag.addEventListener('click', () => {
         this.elements.input.value = result.title;
         this.elements.resultsContainer.classList.remove("search-result-container--visible");
      })

      const title = document.createElement("div");
      title.classList.add("search-title");
      title.innerText = result.title;

      const amount = document.createElement("p");
      amount.classList.add("search-amount");
      amount.innerText = "Amount of images: " + result.amountOfPictures;

      mainTag.appendChild(title);
      mainTag.appendChild(amount);
      return mainTag


   }

   createAnchorElement(result) {
      return `<div class="search-title">${result.title}</div>
      <p class="search-amount">Amount of images: ${result.amountOfPictures}</p>
      `;
   }
}

export default CategorySearcher;
