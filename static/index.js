document.addEventListener("DOMContentLoaded", () => {
    
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);


    socket.on('connect', () => { console.log("SUCCESS!") });

    // Hide some elements by default
    document.querySelector(".create-room").style.display = "none";
    document.querySelector("#room-created").style.display = "none";
    document.querySelector("#not-welcome").style.display = "none";

    if (!localStorage.getItem("user")) {
        document.querySelector(".modal").style.display = "block";
        let username;

        document.querySelector("#new-user").onsubmit = () => {
            username = document.querySelector("#username").value;

            // Create AJAX request, check username with server
            const request = new XMLHttpRequest();
            request.open("POST", "/login");

            // When request completes
            request.onload = () => {

                // Extract JSON
                const data = JSON.parse(request.responseText);

                // Check if username is accepted
                if (data.success) {
                    localStorage.setItem("user", username);
                    document.querySelector(".modal").style.display = "none";
                    document.querySelector("#welcome").innerHTML = `O hai, <u>${username}</u>!`;
                    return false;
                } else {
                    document.querySelector("#not-welcome").style.display = "block";
                    setTimeout(() => {
                        document.querySelector("#not-welcome").style.display = "none";
                    }, 2000);
                }
            }

            // Add data to send with request
            const data = new FormData();
            data.append("username", username);

            // Send request
            request.send(data);
            return false;      
        }
    } else {
        // 
        document.querySelector("#welcome").innerHTML = `O hai, <u>${localStorage.getItem("user")}</u>!`;

    }

    // Disable chat button by default
    document.querySelector("#submit-chat").disabled = true;

    // Enable submit button when input box has content
    document.querySelector('#chat-message').onkeyup = () => {
        if (document.querySelector('#chat-message').value.length > 0)
            document.querySelector('#submit-chat').disabled = false;
        else
            document.querySelector('#submit-chat').disabled = true;
    };

    document.querySelector("#new-message").onsubmit = () => {

        // Template for chat box messages
        const template = Handlebars.compile(document.querySelector("#message").innerHTML);

        // Get message timestamp
        const date = new Date();
        const timestamp = date.getHours() + ":" + date.getMinutes();
        // Store message
        const message = document.querySelector("#chat-message").value;
        // Store username
        const username = localStorage.getItem("user");

        // Add message to DOM
        const content = template({"timestamp":timestamp, "message":message, "username":username});
        document.querySelector("#chat-box").innerHTML += content;

        // Clear input field and disable button again
        document.querySelector('#chat-message').value = '';
        document.querySelector('#submit-chat').disabled = true;

        // Stop form from submitting
        return false;
    };
    
    // show room creation div when button is clicked
    document.querySelector("#add-room").onclick = () => {
        if (document.querySelector(".create-room").style.display == "none") {            
            document.querySelector("#add-room").value = "-";            
            document.querySelector(".create-room").style.display = "block";
        } else {
            document.querySelector("#add-room").value = "+";
            document.querySelector(".create-room").style.display = "none";
        }
    }

   // When user submits form to create new room
   document.querySelector("#create-room").onsubmit = () => {
        const room = document.querySelector("#new-room").value;
        const option = document.createElement("option");
        option.text = `# ${room}`;
        document.querySelector("select>optgroup").append(option);
        document.querySelector("#new-room").value = "";
        document.querySelector(".create-room").style.display = "none";
        document.querySelector("#room-created").style.display = "block";
        setTimeout(() => { 
            document.querySelector("#room-created").style.display = "none";
            document.querySelector("#add-room").value = "+";}, 1500);
        return false;
   }
});