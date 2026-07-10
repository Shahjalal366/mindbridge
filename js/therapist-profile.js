const therapists = {
    sarah: {
        name: "Dr. Sarah Johnson",
        role: "Clinical Psychologist",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=640&q=80",
        rating: "4.9 (186 reviews)",
        specialties: "Anxiety, Depression, Stress",
        languages: "English",
        price: "$50 - $100",
        about: "Dr. Sarah Johnson is a clinical psychologist who supports young people and adults experiencing anxiety, depression, stress, and emotional challenges. Her approach is gentle, practical, and evidence-based.",
        qualifications: [
            "PhD in Clinical Psychology",
            "Licensed Clinical Psychologist",
            "10+ years of counselling experience"
        ],
        help: [
            "Managing anxiety symptoms",
            "Coping with depressive thoughts",
            "Stress management strategies",
            "Building healthier routines"
        ]
    },

    david: {
        name: "Mr. David Lee",
        role: "Counselor",
        image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=640&q=80",
        rating: "4.8 (142 reviews)",
        specialties: "Relationships, Stress Management",
        languages: "English, Malay",
        price: "$0 - $50",
        about: "Mr. David Lee is a counsellor who helps students and young adults work through relationship difficulties, stress, communication issues, and personal growth challenges.",
        qualifications: [
            "Master in Counselling",
            "Certified Mental Health Counsellor",
            "Youth wellbeing workshop facilitator"
        ],
        help: [
            "Relationship communication",
            "Stress and burnout",
            "Self-confidence",
            "Conflict management"
        ]
    },

    aisha: {
        name: "Ms. Aisha Rahman",
        role: "Licensed Therapist",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=640&q=80",
        rating: "4.9 (173 reviews)",
        specialties: "Anxiety, Depression, Stress",
        languages: "English",
        price: "$100 - $150",
        about: "Ms. Aisha Rahman is a licensed therapist with experience supporting clients who are navigating anxiety, low mood, academic pressure, stress, and emotional wellbeing.",
        qualifications: [
            "Licensed Professional Therapist",
            "Trauma-informed care training",
            "8+ years of therapy experience"
        ],
        help: [
            "Academic pressure",
            "Anxiety and overthinking",
            "Low mood",
            "Emotional regulation"
        ]
    }
};

// Wait for the HTML to fully load before trying to access elements
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "sarah";
    const therapist = therapists[id] || therapists.sarah;

    // Grab the image element first to ensure it exists
    const profileImg = document.getElementById("profileImage");

    if (profileImg) {
        profileImg.src = therapist.image;
        profileImg.alt = therapist.name;
        
        document.getElementById("profileName").textContent = therapist.name;
        document.getElementById("profileRole").textContent = therapist.role;
        document.getElementById("profileRating").textContent = therapist.rating;
        document.getElementById("profileSpecialties").textContent = therapist.specialties;
        document.getElementById("profileLanguages").textContent = therapist.languages;
        document.getElementById("profilePrice").textContent = therapist.price;
        document.getElementById("profileAbout").textContent = therapist.about;

        document.getElementById("profileQualifications").innerHTML = therapist.qualifications
            .map(item => `<li>${item}</li>`)
            .join("");

        document.getElementById("profileHelp").innerHTML = therapist.help
            .map(item => `<li>${item}</li>`)
            .join("");
    } else {
        console.error("Profile image element is missing from the HTML.");
    }

    if (window.lucide) {
        lucide.createIcons();
    }
});

function bookAppointment() {
    alert("Booking feature coming soon!");
}