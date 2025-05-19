export function loadRecaptcha(siteKey) {
    return new Promise((resolve) => {
      if (window.grecaptcha) {
        resolve(window.grecaptcha);
        return;
      }
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.onload = () => resolve(window.grecaptcha);
      document.body.appendChild(script);
    });
  }