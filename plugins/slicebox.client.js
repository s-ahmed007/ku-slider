export default defineNuxtPlugin(() => {
    if (process.client) {
      const script = document.createElement('script')
      script.src = '/plugins/slicebox/jquery.slicebox.js'
      script.async = true
      document.head.appendChild(script)
    }
  })
  