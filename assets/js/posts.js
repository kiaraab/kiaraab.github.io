class PostManager {
    constructor() {
        this.posts = this.loadPosts();
    }

    loadPosts() {
        const posts = localStorage.getItem('journal-posts');
        return posts ? JSON.parse(posts) : [
            {
                id: '1',
                type: 'journal-entry',
                title: 'A Very Long Journal Entry',
                date: '2025-09-28',
                content: "This is a very long journal entry designed to test the column flow. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
            },
            {
                id: '2',
                type: 'journal-entry',
                title: 'Another Page',
                date: '2025-09-27',
                content: "This is the second page.",
            },
        ];
    }

    savePosts() {
        localStorage.setItem('journal-posts', JSON.stringify(this.posts));
    }

    addPost(post) {
        this.posts.unshift(post);
        this.savePosts();
    }

    getAllPosts() {
        return this.posts;
    }
}

class UIManager {
    constructor() {
        this.postManager = new PostManager();
        this.container = document.getElementById('magazine-container');
        this.typeFilter = document.getElementById('type-filter');
        this.monthFilter = document.getElementById('month-filter');
        this.prevButton = document.getElementById('prev-page');
        this.nextButton = document.getElementById('next-page');
        this.addPostBtn = document.getElementById('add-post-btn');
        this.addPostModal = document.getElementById('add-post-modal');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.addPostForm = document.getElementById('add-post-form');
        this.typingTitle = document.getElementById('typing-title');
        this.currentPage = 0;
        this.postsPerPage = 1; // Change to 1 post per page
        this.setupEventListeners();
        this.renderMagazine();
        this.initTypingEffect();
    }

    initTypingEffect() {
        const title = "kiara's personal archive";
        let i = 0;
        this.typingTitle.innerHTML = "";
        const typing = () => {
            if (i < title.length) {
                this.typingTitle.innerHTML += title.charAt(i);
                i++;
                setTimeout(typing, 100);
            }
        }
        typing();
    }

    setupEventListeners() {
        this.typeFilter.addEventListener('change', () => {
            this.currentPage = 0;
            this.renderMagazine();
        });
        this.monthFilter.addEventListener('change', () => {
            this.currentPage = 0;
            this.renderMagazine();
        });
        this.prevButton.addEventListener('click', () => this.changePage(-1));
        this.nextButton.addEventListener('click', () => this.changePage(1));
        this.addPostBtn.addEventListener('click', () => this.addPostModal.style.display = 'flex');
        this.cancelBtn.addEventListener('click', () => this.addPostModal.style.display = 'none');
        this.addPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(this.addPostForm);
            const newPost = {
                id: Date.now().toString(),
                type: formData.get('type'),
                title: formData.get('title'),
                date: new Date().toISOString().slice(0, 10),
                content: formData.get('content'),
            };
            this.postManager.addPost(newPost);
            this.addPostModal.style.display = 'none';
            this.addPostForm.reset();
            this.currentPage = 0;
            this.renderMagazine();
        });
    }

    getFilteredPosts() {
        const type = this.typeFilter.value;
        const month = this.monthFilter.value;
        let posts = this.postManager.getAllPosts();

        if (type !== 'all') {
            posts = posts.filter(post => post.type === type);
        }

        if (month !== 'all') {
            posts = posts.filter(post => post.date.startsWith(month));
        }

        return posts;
    }

    renderMagazine() {
        this.container.innerHTML = '';
        const posts = this.getFilteredPosts();
        const totalPages = Math.ceil(posts.length / this.postsPerPage);

        if (posts.length === 0) {
            this.container.innerHTML = '<div class="magazine-page active"><p>No entries match the filter.</p></div>';
            this.updatePaginationButtons(totalPages);
            return;
        }

        for (let i = 0; i < totalPages; i++) {
            const pagePosts = posts.slice(i * this.postsPerPage, (i + 1) * this.postsPerPage);
            const pageElement = this.createPageElement(pagePosts, i);
            this.container.appendChild(pageElement);
        }
        this.updatePaginationButtons(totalPages);
    }

    createPageElement(posts, pageIndex) {
        const page = document.createElement('div');
        page.className = `magazine-page ${pageIndex === this.currentPage ? 'active' : ''}`;
        page.dataset.pageIndex = pageIndex;
        
        const grid = document.createElement('div');
        grid.className = 'post-grid';

        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            grid.appendChild(postElement);
        });

        page.appendChild(grid);
        return page;
    }

    createPostElement(post) {
        const element = document.createElement('div');
        element.className = `entry ${post.type}`;

        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric'
        });

        element.innerHTML = `
            <div class="entry-header">
                <h3 class="entry-title">${post.title}</h3>
            </div>
            <div class="entry-content">
                <p>${post.content}</p>
            </div>
            <div class="entry-footer">
                <div class="entry-meta">${formattedDate}</div>
            </div>
        `;
        return element;
    }

    updatePaginationButtons(totalPages) {
        this.prevButton.style.display = this.currentPage > 0 ? 'block' : 'none';
        this.nextButton.style.display = this.currentPage < totalPages - 1 ? 'block' : 'none';
    }

    changePage(direction) {
        const pages = document.querySelectorAll('.magazine-page');
        const totalPages = pages.length;

        pages[this.currentPage].classList.remove('active');
        this.currentPage += direction;
        pages[this.currentPage].classList.add('active');

        this.updatePaginationButtons(totalPages);
    }
}

document.addEventListener('DOMContentLoaded', () => new UIManager());