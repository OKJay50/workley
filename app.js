$(document).ready(function () {
  // Retrieve the current date
  var currentDate = moment().startOf("day");

  // Display the current date
  var currentDateDisplay = $("#currentDay");
  currentDateDisplay.text(currentDate.format("dddd, MMMM Do"));

  // Load saved events for the current date
  loadSavedEvents();

  // Event handler for navigating to previous day
  $(".previous").on("click", function () {
    currentDate.subtract(1, "day");
    currentDateDisplay.text(currentDate.format("dddd, MMMM Do"));
    updateTimeBlockColors();
    loadSavedEvents(); // Reload saved events for the new date
  });

  // Event handler for navigating to next day
  $(".next").on("click", function () {
    currentDate.add(1, "day");
    currentDateDisplay.text(currentDate.format("dddd, MMMM Do"));
    updateTimeBlockColors();
    loadSavedEvents(); // Reload saved events for the new date
  });

  // Event handler for save button click
  $(".save-btn").on("click", function () {
    var timeBlock = $(this).siblings(".time").text();
    var eventText = $(this).siblings(".event").val();

    // Save the event to local storage for the current date and time block
    saveEvent(currentDate.format("YYYY-MM-DD"), timeBlock, eventText);
  });

  // Function to load saved events for the current date
  function loadSavedEvents() {
    // Clear the event textareas
    $(".event").val("");

    // Get the events from local storage for the current date
    var savedEvents = JSON.parse(localStorage.getItem(currentDate.format("YYYY-MM-DD"))) || {};

    // Loop through each time block
    $(".row").each(function () {
      var timeBlock = $(this).find(".time").text();

      // Check if there's a saved event for the current time block
      if (savedEvents.hasOwnProperty(timeBlock)) {
        // Retrieve and display the saved event
        var eventText = savedEvents[timeBlock];
        $(this).find(".event").val(eventText);
      }
    });
  }

  // Function to save an event to local storage
  function saveEvent(date, time, eventText) {
    // Get the events for the current date from local storage
    var savedEvents = JSON.parse(localStorage.getItem(date)) || {};

    // Update the events object with the new event
    savedEvents[time] = eventText;

    // Save the updated events object back to local storage
    localStorage.setItem(date, JSON.stringify(savedEvents));
  }

  // Function to update the color of time blocks based on the current time
  function updateTimeBlockColors() {
    var currentTime = moment().format("h A");

    $(".row").each(function () {
      var timeBlock = $(this).find(".time").text();

      if (timeBlock === currentTime) {
        $(this).addClass("present").removeClass("past future");
      } else if (moment(timeBlock, "h A").isBefore(moment(currentTime, "h A"))) {
        $(this).addClass("past").removeClass("present future");
      } else {
        $(this).addClass("future").removeClass("past present");
      }
    });
  }

  // Update the color of time blocks initially
  updateTimeBlockColors();
});
