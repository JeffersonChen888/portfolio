document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#contact-form");
    
    // Ensure the form exists
    form?.addEventListener("submit", function(event) {
        // Prevent the default form submission
        event.preventDefault();
        
        // Get form data
        const data = new FormData(form);
        let url = form.action + "?"; // Start with the base action (mailto:...?)
        
        // Iterate over form fields and build URL parameters
        for (let [name, value] of data) {
            // Encode each value properly using encodeURIComponent
            url += `${encodeURIComponent(name)}=${encodeURIComponent(value)}&`;
        }

        // Remove the trailing '&' if present
        url = url.slice(0, -1);
        
        // Open the mail client with the correctly encoded URL
        location.href = url;
    });
});
