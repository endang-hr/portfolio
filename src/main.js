import './style.css'

// Theme Toggle Functionality
const themeToggle = document.querySelector('#theme-toggle')
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.theme = isDark ? 'dark' : 'light'
  })
}

// Contact Form Handler
const contactForm = document.querySelector('#contact-form')
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = document.querySelector('#sender-name')?.value || 'Tamu'
    alert(`Terima kasih ${name}! Pesan Anda telah terkirim ke Muhamad Endang.`)
    contactForm.reset()
  })
}

// Console notice for development
console.log('Pertemuan 9 - Tailwind CSS Portfolio loaded successfully!')
