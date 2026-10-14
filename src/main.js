import './style.css'

// Theme Toggle Functionality
const themeToggle = document.querySelector('#theme-toggle')
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.theme = isDark ? 'dark' : 'light'
  })
}

// Contact Form Handler (FormSubmit to mhdendangit@gmail.com)
const contactForm = document.querySelector('#contact-form')
const formStatus = document.querySelector('#form-status')
const submitBtn = contactForm?.querySelector('button[type="submit"]')

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    
    const name = document.querySelector('#sender-name')?.value.trim()
    const email = document.querySelector('#sender-email')?.value.trim()
    const message = document.querySelector('#sender-msg')?.value.trim()

    if (!name || !email || !message) {
      alert('Harap isi semua kolom formulir.')
      return
    }

    // Set loading state
    const originalBtnText = submitBtn.innerHTML
    submitBtn.disabled = true
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Mengirim Pesan...
    `

    if (formStatus) {
      formStatus.classList.add('hidden')
      formStatus.textContent = ''
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/mhdendangit@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `Pesan Baru Portofolio dari ${name}`
        })
      })

      const result = await response.json()

      if (formStatus) {
        formStatus.classList.remove('hidden')
        if (result.success === 'true' || result.success === true) {
          formStatus.className = 'text-xs rounded-xl p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
          formStatus.textContent = `✓ Terima kasih ${name}! Pesan Anda telah berhasil terkirim ke email Muhamad Endang.`
          contactForm.reset()
        } else {
          // If activation is needed or notice
          formStatus.className = 'text-xs rounded-xl p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
          formStatus.textContent = `Pesan telah diproses. (${result.message})`
          contactForm.reset()
        }
      } else {
        alert(`Terima kasih ${name}! Pesan Anda telah terkirim.`)
        contactForm.reset()
      }
    } catch (err) {
      if (formStatus) {
        formStatus.classList.remove('hidden')
        formStatus.className = 'text-xs rounded-xl p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
        formStatus.textContent = 'Gagal mengirim pesan via server. Silakan hubungi langsung ke email mhdendangit@gmail.com.'
      } else {
        alert('Gagal mengirim pesan. Silakan coba lagi.')
      }
    } finally {
      submitBtn.disabled = false
      submitBtn.innerHTML = originalBtnText
    }
  })
}

// Console notice for development
console.log('Pertemuan 9 - Tailwind CSS Portfolio loaded successfully!')
