function createForumPost() {
    const input = document.getElementById("forumPostInput");
    const forumPosts = document.getElementById("forumPosts");

    if (!input || !forumPosts) {
        return;
    }

    const postText = input.value.trim();

    if (postText === "") {
        alert("Please write something before posting.");
        return;
    }

    const newPost = document.createElement("article");
    newPost.className = "forum-post";

    newPost.innerHTML = `
        <div class="forum-post-image">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=520&q=80"
                 alt="New community post">
        </div>

        <div class="forum-post-content">
            <span class="post-category">General Support</span>
            <h2>New Community Post</h2>
            <p>${postText}</p>
            <span>0 comments · Just now</span>
        </div>

        <button class="forum-view-btn" type="button">
            <span>View</span>
            <i data-lucide="arrow-right" aria-hidden="true"></i>
        </button>
    `;

    forumPosts.prepend(newPost);
    input.value = "";

    if (window.lucide) {
        lucide.createIcons();
    }
}