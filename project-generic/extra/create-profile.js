// Get email from URL parameters
const params = new URLSearchParams(window.location.search);
const email = params.get("email");
const userEmail = params.get("userEmail"); // logged-in user email

// Display the email or use it for API calls
if (email && userEmail) {
  console.log(`Viewing profile for: ${email}`);
  console.log(`Logged in as: ${userEmail}`);

  // Fetching portfolio data
  fetch(
    `http://localhost:5000/api/portfolio?email=${encodeURIComponent(email)}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        // Display profile information
        if (data.profile) {
          // Update the hero section with the name
          document.getElementById("profile-name").textContent =
            data.profile.name;

          // Update the hero section with expertise
          const expertiseText = data.profile.expertise
            ? data.profile.expertise.join(", ")
            : "No expertise listed";
          document.getElementById("expertise-text").textContent = expertiseText;

          // Update the About section with bio
          const bioText = data.profile.bio
            ? data.profile.bio
            : "No bio available";
          document.getElementById("about-bio").textContent = bioText;

          // Update the About section with email
          document.getElementById("about-email").textContent = `${email}`;
        }

        // Display projects
        if (data.projects && data.projects.length > 0) {
          const projectsHTML = data.projects
            .map(
              (project) => `
                <div class="portfolio-item">
                  <img src="https://via.placeholder.com/300" alt="${project.title}" />
                  <h3>${project.title}</h3>
                  <p>${project.description}</p>
                  <a href="${project.link}" target="_blank" class="view-btn">Project Link</a>
                </div>`
            )
            .join(""); // Combine all project items into a single string

          document.getElementById("portfolio-container").innerHTML += `
            <section id="portfolio">
              <div class="container">
                <h2>My Portfolio</h2>
                <div class="portfolio-grid">
                  ${projectsHTML} <!-- Insert all project cards here -->
                </div>
              </div>
            </section>
          `;
        }

        // Display testimonials with ratings
        if (data.testimonials && data.testimonials.length > 0) {
          const totalRatings = data.testimonials.reduce(
            (sum, t) => sum + t.rating,
            0
          );
          const avgRating = (totalRatings / data.testimonials.length).toFixed(
            1
          );

          const testimonialsHTML = data.testimonials
            .map(
              (testimonial) => `
                <div class="testimonial">
                  <p>"${testimonial.content}"</p>
                  <p><strong>- ${testimonial.author}</strong></p>
                  <p>Rating: ${"★".repeat(testimonial.rating)}</p>
                </div>`
            )
            .join("");

          document.getElementById("portfolio-container").innerHTML += `
            <section id="testimonials">
              <div class="container">
                <h2>Testimonials</h2>
                <p>Average Rating: ${avgRating} / 5</p>
                <div class="testimonial-carousel">
                  ${testimonialsHTML}
                </div>
              </div>
            </section>
          `;
        }
      } else {
        console.error("No data found for the provided email");
      }
    })
    .catch((error) => console.error("Error fetching portfolio data:", error));
} else {
  console.error("Required email parameters are missing.");
}

// Handle contact form submission
document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form from reloading the page

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // Send form data to the server
  fetch("http://localhost:5000/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, message }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message); // Show success message
        document.getElementById("contactForm").reset(); // Clear the form
      } else {
        alert("Error submitting feedback.");
      }
    })
    .catch((error) => {
      console.error("Error submitting feedback:", error);
      alert("An error occurred. Please try again.");
    });
});

// Dynamically set profile email
document.getElementById("profileEmail").value = email;

// Handle testimonial form submission
document.getElementById("testimonialForm").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission

  const email = document.getElementById("profileEmail").value;
  const author = document.getElementById("author").value;
  const rating = document.getElementById("rating").value;
  const content = document.getElementById("content").value;

  fetch("http://localhost:5000/api/testimonials", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, userEmail, content, author, rating }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert(data.message); // Success
        document.getElementById("testimonialForm").reset();
      } else {
        alert("Error submitting testimonial.");
      }
    })
    .catch((error) => console.error("Error:", error));
});
