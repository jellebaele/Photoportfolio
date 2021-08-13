const modal = document.querySelector('.modal');
const previews = document.querySelectorAll(".gallery img");
const fullImage = document.querySelector(".full-image");

previews.forEach(preview => {
  preview.addEventListener('click', () => {
    modal.classList.add("open");
    fullImage.classList.add("open");
    const originalSource = preview.getAttribute("data-original");
    fullImage.src = originalSource;
  })
});

modal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    modal.classList.remove('open');
    fullImage.classList.remove('open');
  }
});