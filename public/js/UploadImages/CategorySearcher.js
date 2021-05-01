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
         this.setLoading(true);
         delay = setTimeout(() => {
            if (query.length < 1) {
               this.populateResults([]);
               this.setLoading(false);
               return;
            }

            this.performSearch(query);
         }, 500);
      });

      this.elements.input.addEventListener("focus", () => {
         this.elements.resultsContainer.classList.add("result-container--visible");
      });

      this.elements.input.addEventListener("blur", () => {
         this.elements.resultsContainer.classList.remove("result-container--visible");
      });
   }

   async performSearch(query) {
      await fetch("/api/category-search?search=" + query, {
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

   setLoading(isLoading) {
      this.elements.main.classList.toggle("category-search--loading", isLoading);
   }

   populateResults(results) {
      console.log("Results:");
      console.log(results);
      while (this.elements.resultsContainer.firstChild) {
         this.elements.resultsContainer.removeChild(this.elements.resultsContainer.firstChild);
      }

      for (const result of results) {
         this.elements.resultsContainer.appendChild(this.createResultElement(result));
      }
   }

   createResultElement(result) {
      const anchorElement = document.createElement("a");
      anchorElement.classList.add("search-result");
      anchorElement.insertAdjacentHTML("afterbegin", this.createAnchorElement(result));

      // if ("href" in result) {
      //    anchorElement.setAttribute('href', result.href);
      // }

      return anchorElement;
   }

   createAnchorElement(result) {
      return `
      <div class="title">${result.title}</div>
      <p class="amount">Amount of images: ${result.amountOfPictures}</p>
      `;
   }
}

export default CategorySearcher;
