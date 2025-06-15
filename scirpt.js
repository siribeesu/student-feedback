const form = document.getElementById('feedbackForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch('http://localhost:3000/submit-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      alert('✅ Feedback submitted!');
      form.reset();
    } else {
      alert('❌ Failed to submit feedback.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Could not connect to server.');
  }
});
