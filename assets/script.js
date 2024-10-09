const hamburger = document.querySelector(".hamburger");
const mobile_nav_links = document.querySelector(".mobile-nav-links");
const nav_link = document.querySelectorAll(".nav-link");
const link_input = document.getElementById("link-input");
const shorten_btn = document.getElementById("shorten-btn");
const error_msg = document.querySelector(".error-msg");
const link_list = document.querySelector(".link-list");

// Maximum number of link boxes allowed
const MAX_LINKS = 3;

//Tiny URL api token
const TINYURL_API_TOKEN =
  "6twW2WCakko6XXdwkQY9cIBKHLj0ndi8FWCd43rHvysohnYBYIgXSRwByIGI";

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("rotate");
  mobile_nav_links.classList.toggle("display");
});

nav_link.forEach((link) => {
  link.addEventListener("click", () => {
    if (mobile_nav_links.classList.contains("display")) {
      mobile_nav_links.classList.remove("display");
      hamburger.classList.remove("rotate");
    }
  });
});

// Function to validate if the input is a valid URL
function isValidURL(string) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-zA-Z0-9$_.+!*',;&=~%-]+)@)?[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6})" + // domain name
      "(\\/[a-zA-Z0-9$_.+!*',;&=~%-]*)*\\/?$", // path
    "i"
  );
  return pattern.test(string);
}

// Function to shorten link using Bitly API
async function shortenLink(link) {
  const response = await fetch("https://api.tinyurl.com/create", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TINYURL_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: link,
      domain: "tinyurl.com", // You can also specify 'tiny.one' if you prefer
    }),
  });

  const data = await response.json();
  if (response.ok) {
    return data.data.tiny_url; // Shortened link from TinyURL API
  } else {
    throw new Error("Error shortening the link");
  }
}

shorten_btn.onclick = async () => {
  const link_value = link_input.value;

  if (link_value === "") {
    error_msg.innerText = "Please add a link";
    error_msg.style.display = "block";
    return;
  }

  if (!isValidURL(link_value)) {
    error_msg.innerText = "Please enter a valid link";
    error_msg.style.display = "block";
    return;
  }

  // Clear error message if the input is valid
  error_msg.style.display = "none";

  try {
    // Shorten link using Bitly API
    const shortened_link = await shortenLink(link_value);

    // Create new div for original and shortened link
    const newLinkDiv = document.createElement("div");
    newLinkDiv.classList.add(
      "shorten-link",
      "rounded-lg",
      "flex",
      "flex-col",
      "gap-6",
      "items-center",
      "justify-center",
      "p-6",
      "bg-white"
    );

    newLinkDiv.innerHTML = `
      <div class="flex flex-col gap-1 w-full overflow-hidden">
        <p class="link-text">${link_value}</p>
        <hr />
        <p class="shortened-link">${shortened_link}</p>
        <button class="p-3 rounded-md bg-[#2bb1b2] text-white font-bold w-full copy-btn">Copy</button>
        <button class="p-3 rounded-md bg-[#4b2c4d] text-white font-bold w-full copied-btn" style="display: none;">Copied!</button>
      </div>
    `;

    // Prepend the new div to the top of the link list
    link_list.prepend(newLinkDiv);

    // Ensure only the most recent 3 links are shown
    if (link_list.children.length > MAX_LINKS) {
      link_list.removeChild(link_list.lastElementChild); // Remove the oldest (bottom-most) link
    }

    // Add copy functionality
    const copy_btn = newLinkDiv.querySelector(".copy-btn");
    const copied_btn = newLinkDiv.querySelector(".copied-btn");

    copy_btn.addEventListener("click", () => {
      navigator.clipboard.writeText(shortened_link).then(() => {
        copy_btn.style.display = "none";
        copied_btn.style.display = "block";
      });
    });
  } catch (error) {
    error_msg.innerText = "Failed to shorten the link. Please try again.";
    error_msg.style.display = "block";
  }
};

// Hide the error message when the user starts typing
link_input.addEventListener("input", () => {
  error_msg.style.display = "none";
});
