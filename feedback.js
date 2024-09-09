function openFeedbackModal() {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSc2wK_1qz8x6DvJuOqj9LNx3HUe2NoL4i6R-69019F0Uj9EyA/viewform", "_blank");
}

document.addEventListener("DOMContentLoaded", function() {
    const button = document.createElement("button");
    button.id = "feedbackButton";
    button.onclick = openFeedbackModal;

    // Add each letter of "Raise Ticket" in a span
    button.innerHTML = `
        <span>R</span>
        <span>A</span>
        <span>I</span>
        <span>S</span>
        <span>E</span>
        <span>T</span>
        <span>I</span>
        <span>C</span>
        <span>K</span>
        <span>E</span>
        <span></span>
    `;

    const buttonStyle = document.createElement("style");
    buttonStyle.innerHTML = `
     #feedbackButton {
    position: absolute;
    top: 70%; /* Move the button to 70% from the top */
    right: 0; /* Align the button to the right */
    transform: translateX(0); /* Remove the translateX effect for normal positioning */
    background-color: #7bc043; /* A softer green similar to the image */
    border-radius: 16px 0 0 16px; /* Rounded corners only on the left side */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Adding a shadow effect */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 33px;
    height: 200px;
    z-index: 1000;
    padding: 10px;
    color: white;
    font-size: 12px;
    overflow: hidden; /* Ensure text stays within button */
    flex-direction: column; /* Arrange spans vertically */
    text-align: center;
    font-weight: bold; /* Bold text to match the image */
    border-left: 2px solid #4a4a4a; /* Darker outer border */
    border-right: 2px solid #ffffff; /* Lighter inner border */
    border-top: 0;
    border-bottom: 0;
}

#feedbackButton:hover::after {
    display: block;
}


        @media only screen and (min-width: 601px) and (max-width: 900px) {
        #feedbackButton {
        top: 40%;
        }
    }

    @media only screen and (min-width: 601px) and (max-width: 900px) {
        #feedbackButton {
        top: 40%;
        } 
    }

    @media only screen and (min-width: 901px) and (max-width: 1200px) {
        #feedbackButton {
        top: 40%;
        }
    }


@media only screen and (min-width: 1201px) {
#feedbackButton {
        top: 40%;
        }    
}

@media only screen and (min-width: 1440px) {
#feedbackButton {
        top: 40%;
        }   
}
    `;
    document.head.appendChild(buttonStyle);

    document.body.appendChild(button);
});
