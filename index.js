import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const addBtn = document.getElementById('publish-btn');
const textarea = document.getElementById('textarea');
const endorsementContainer = document.getElementById('endorsement-container');
const from = document.getElementById('from');
const to = document.getElementById('to');
const form = document.querySelector('.form');

const appSettings = {
    databaseURL: "https://champions-3456b-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementDB = ref(database, "champions")

addBtn.addEventListener('click', () => {
    if (textarea.value !== '' && from.value !== '' && to.value !== '') {
        let obj = {
            value: textarea.value,
            from: from.value,
            to: to.value,
            likes: 0,
        }
        push(endorsementDB, obj);
        clearTextarea();
    } else alert('please fill all the inputs!')
});

const clearTextarea = () => {
    textarea.value = '';
}

const clearEndorsementContainer = () => {
    endorsementContainer.innerHTML = '';
}

const clearInputs = () => {
    from.value = '';
    to.value = '';
}

const addEndorsement = (item) => {
    let endorsement = document.createElement('div');
    endorsement.classList.add('endorsement');
    endorsement.innerHTML = `
    <p class="name">From ${item[1].from}</p>
    <p class="content">${item[1].value}</p>
    <p class="name">To ${item[1].to} 
        <span>
            <i class="ti ti-heart-filled ${isLiked(item[0]) ? 'liked' : ''}" id="${item[0]}"}></i>
            <span id="likes">${item[1].likes}</span>
        </span>
    </p>
    `
    endorsementContainer.prepend(endorsement);
    document.getElementById(`${item[0]}`).addEventListener('click', () => addLike(item));
}

let myLikes = JSON.parse(localStorage.getItem('catLikes')) || [];

const addLike = (item) => {
    if (!myLikes.some(el => el === item[0])) {
        let exactLocation = ref(database, `champions/${item[0]}`);
        update(exactLocation, { likes: item[1].likes + 1 });
        myLikes.push(item[0]);
        localStorage.setItem('catLikes', JSON.stringify(myLikes));
        document.getElementById(item[0]).style.color = 'red';
    }
}

const isLiked = id => {
    if (myLikes.some(el => el === id)) return true;
}

onValue(endorsementDB, (snapshot) => {
    if (snapshot.exists()) {
        let endorsementArray = Object.entries(snapshot.val());
        clearEndorsementContainer();
        clearInputs();
        for (let item of endorsementArray) {
            addEndorsement(item);
        }
    } else clearEndorsementContainer();
})


// window.addEventListener('scroll', () => {
//     console.log(window.scrollY)
//     let scrollY = window.scrollY;
//     if (scrollY > 250) {
//         form.classList.add('sticky');
//     } else {
//         form.classList.remove('sticky');
//     }

// })

// 1
//dodać listener on scroll - jak zjedzie ponizej h2 'endorsements' to wtedy form ma position fixed - USTAWIANIE szerokości fixed element? w grid?
// 250px

// 2
// modal alert - jeśli nie są wypełnione wszystkie pola