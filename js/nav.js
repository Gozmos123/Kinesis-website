// Shared nav behavior across all pages
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burgerBtn');
  if (burger) {
    burger.addEventListener('click', () => {
      document.querySelectorAll('.navlinks a').forEach(a => {
        a.style.display = a.style.display === 'block' ? '' : 'block';
      });
    });
  }
});
