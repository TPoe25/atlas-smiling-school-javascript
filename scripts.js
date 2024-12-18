$(document).ready(function () {
  console.log("Document is ready!");

  /** Smooth scrolling for navigation links **/
  $(".nav-link").on("click", function (event) {
    event.preventDefault();
    const target = $(this).attr("href");
    if ($(target).length) {
      $("html, body").animate(
        {
          scrollTop: $(target).offset().top,
        },
        800 // Animation duration in ms
      );
    } else {
      console.error("Target element not found:", target);
    }
  });

  /** Navbar toggle animation **/
  $(".navbar-toggler").on("click", function () {
    $(this).toggleClass("active");
  });

  /** Fetch Quotes from API **/
  const fetchQuotes = () => {
    const $quoteLoader = $("#quote-loader");
    const $carousel = $("#carouselExampleControls");
    const $carouselInner = $("#carousel-quotes");

    // Show loader and hide carousel
    $quoteLoader.show();
    $carousel.hide();

    $.ajax({
      url: "https://smileschool-api.hbtn.info/quotes",
      method: "GET",
      success: function (data) {
        $carouselInner.empty(); // Clear any existing quotes

        // Loop through quotes and populate carousel
        data.forEach((quote, index) => {
          const activeClass = index === 0 ? "active" : "";
          const quoteHTML = `
            <div class="carousel-item ${activeClass}">
              <div class="row mx-auto align-items-center">
                <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                  <img
                    src="${quote.pic_url}"
                    class="d-block align-self-center rounded-circle"
                    alt="Profile Picture"
                  />
                </div>
                <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                  <div class="quote-text">
                    <p class="text-white">« ${quote.text} »</p>
                    <h4 class="text-white font-weight-bold">${quote.name}</h4>
                    <span class="text-white">${quote.title}</span>
                  </div>
                </div>
              </div>
            </div>
          `;
          $carouselInner.append(quoteHTML);
        });

        // Hide loader and show carousel
        $quoteLoader.hide();
        $carousel.show();
      },
      error: function () {
        console.error("Failed to load quotes.");
        $quoteLoader.hide();
        alert(
          "An error occurred while loading quotes. Please try again later."
        );
      },
    });
  };

  /** Fetch and populate dropdowns and courses **/
  const apiURL = "https://smileschool-api.hbtn.info/courses";

  const $searchInput = $("#search-input");
  const $topicDropdown = $("#topic-dropdown");
  const $sortDropdown = $("#sort-dropdown");
  const $coursesLoader = $("#courses-loader");
  const $coursesList = $("#courses-list");

  const loadDropdowns = () => {
    $.ajax({
      url: apiURL,
      method: "GET",
      success: function (data) {
        // Populate Topic dropdown
        $topicDropdown.empty();
        data.topics.forEach((topic) => {
          $topicDropdown.append(`<option value="${topic}">${topic}</option>`);
        });

        // Populate Sort dropdown
        $sortDropdown.empty();
        data.sorts.forEach((sort) => {
          $sortDropdown.append(`<option value="${sort}">${sort}</option>`);
        });

        // Initialize search input value
        $searchInput.val(data.q);

        // Load courses after populating dropdowns
        loadCourses();
      },
      error: function () {
        console.error("Failed to load dropdowns.");
      },
    });
  };

  const loadCourses = () => {
    const queryParams = {
      q: $searchInput.val(),
      topic: $topicDropdown.val(),
      sort: $sortDropdown.val(),
    };

    $coursesLoader.removeClass("d-none"); // Show loader
    $coursesList.empty(); // Clear previous courses

    $.ajax({
      url: apiURL,
      method: "GET",
      data: queryParams,
      success: function (data) {
        $coursesLoader.addClass("d-none"); // Hide loader

        // Populate courses
        data.courses.forEach((course) => {
          const courseCard = `
            <div class="col-md-4 course-card">
              <div class="card">
                <img src="${course.thumb_url}" class="card-img-top" alt="${
            course.title
          }">
                <div class="card-body">
                  <h5 class="card-title">${course.title}</h5>
                  <p class="card-text">${course["sub-title"]}</p>
                  <div class="d-flex align-items-center">
                    <img src="${course.author_pic_url}" alt="${
            course.author
          }" class="rounded-circle mr-2" width="30">
                    <span>${course.author}</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-2">
                    <span class="text-warning">
                      ${"★".repeat(course.star)}${"☆".repeat(5 - course.star)}
                    </span>
                    <span>${course.duration}</span>
                  </div>
                </div>
              </div>
            </div>`;
          $coursesList.append(courseCard);
        });
      },
      error: function () {
        console.error("Failed to load courses.");
      },
    });
  };

  /** Event Listeners **/
  $searchInput.on("input", loadCourses);
  $topicDropdown.on("change", loadCourses);
  $sortDropdown.on("change", loadCourses);

  /** Initial calls **/
  fetchQuotes();
  loadDropdowns();
});
