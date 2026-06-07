/* ==========================================
   PRELOADER
========================================== */

window.addEventListener("load", () => {

    const preloader = document.getElementById("preloader");

    if(preloader){

        preloader.style.opacity = "0";

        preloader.style.transition = "0.8s";

        setTimeout(() => {

            preloader.style.display = "none";

        }, 800);
    }

});

/* ==========================================
   STICKY HEADER SHADOW
========================================== */

window.addEventListener("scroll", () => {

    const header = document.getElementById("header");

    if(!header) return;

    if(window.scrollY > 50){

        header.style.boxShadow =
        "0 10px 30px rgba(0,0,0,0.3)";

        header.style.background =
        "rgba(22,24,29,0.95)";

    }

    else{

        header.style.boxShadow = "none";

        header.style.background =
        "rgba(22,24,29,0.8)";
    }

});

/* ==========================================
   ACTIVE MENU LINK
========================================== */

const sections =
document.querySelectorAll("section");

const navLinks =
document.querySelectorAll("nav ul li a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop =
        section.offsetTop - 120;

        const sectionHeight =
        section.clientHeight;

        if(window.scrollY >= sectionTop){

            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if(
            link.getAttribute("href") ===
            "#" + current
        ){

            link.classList.add("active");
        }

    });

});

/* ==========================================
   SMOOTH REVEAL ANIMATION
========================================== */

const revealElements = document.querySelectorAll(

    ".section-header, .about-content, .expertise-grid article, .timeline article, .project-grid article, #certifications li, .contact-info"

);

const observer = new IntersectionObserver(

(entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.style.opacity = "1";

            entry.target.style.transform =
            "translateY(0)";
        }

    });

},

{
    threshold:0.15
}

);

revealElements.forEach(el => {

    el.style.opacity = "0";

    el.style.transform =
    "translateY(40px)";

    el.style.transition =
    "all 0.8s ease";

    observer.observe(el);

});

/* ==========================================
   HERO TYPING EFFECT
========================================== */

const subtitle = document.querySelector("#hero h2");

if(subtitle){

    const text =
    subtitle.textContent;

    subtitle.textContent = "";

    let i = 0;

    function typeText(){

        if(i < text.length){

            subtitle.textContent += text.charAt(i);

            i++;

            setTimeout(typeText, 60);
        }
    }

    setTimeout(typeText, 800);

}

/* ==========================================
   HERO IMAGE PARALLAX
========================================== */

const heroImage =
document.querySelector(".hero-image img");

window.addEventListener("mousemove",(e)=>{

    if(!heroImage) return;

    const x =
    (window.innerWidth / 2 - e.pageX)
    / 60;

    const y =
    (window.innerHeight / 2 - e.pageY)
    / 60;

    heroImage.style.transform =
    `translate(${x}px, ${y}px)`;
});

/* ==========================================
   BUTTON RIPPLE EFFECT
========================================== */

document.querySelectorAll(".hero-buttons a")
.forEach(button => {

    button.addEventListener("click",function(e){

        const ripple =
        document.createElement("span");

        const rect =
        this.getBoundingClientRect();

        const size =
        Math.max(rect.width,rect.height);

        ripple.style.width =
        ripple.style.height =
        size + "px";

        ripple.style.left =
        e.clientX - rect.left - size/2
        + "px";

        ripple.style.top =
        e.clientY - rect.top - size/2
        + "px";

        ripple.classList.add("ripple");

        this.appendChild(ripple);

        setTimeout(()=>{

            ripple.remove();

        },600);

    });

});

/* ==========================================
   COUNTER ANIMATION
========================================== */

const counters =
document.querySelectorAll(".counter");

counters.forEach(counter => {

    const updateCounter = () => {

        const target =
        +counter.getAttribute("data-target");

        const current =
        +counter.innerText;

        const increment =
        target / 100;

        if(current < target){

            counter.innerText =
            Math.ceil(current + increment);

            setTimeout(updateCounter,20);

        }

        else{

            counter.innerText = target;
        }

    };

    updateCounter();

});

/* ==========================================
   SCROLL TO TOP BUTTON
========================================== */

const topBtn =
document.createElement("button");

topBtn.innerHTML = "↑";

document.body.appendChild(topBtn);

topBtn.style.position = "fixed";
topBtn.style.bottom = "25px";
topBtn.style.right = "25px";
topBtn.style.width = "50px";
topBtn.style.height = "50px";
topBtn.style.borderRadius = "50%";
topBtn.style.border = "none";
topBtn.style.background = "#0d6efd";
topBtn.style.color = "#fff";
topBtn.style.fontSize = "22px";
topBtn.style.cursor = "pointer";
topBtn.style.display = "none";
topBtn.style.zIndex = "999";

window.addEventListener("scroll",()=>{

    if(window.scrollY > 500){

        topBtn.style.display = "block";
    }

    else{

        topBtn.style.display = "none";
    }

});

topBtn.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"
    });

});

/* ==========================================
   CURRENT YEAR
========================================== */

const footer =
document.querySelector("footer p");

if(footer){

    footer.innerHTML =
    `© ${new Date().getFullYear()} Ecatu Ronald. All Rights Reserved.`;

}