let input = document.getElementById('input');
let button = document.getElementById('search');
let notFound = document.getElementById('not_found')
let definition = document.querySelector('.definition')
let audioBox = document.querySelector('.audio')
let loading = document.querySelector('.loading')
let suggest = document.querySelector('#suggest')

const key = config.API_KEY;

button.addEventListener('click', (e) => {
    e.preventDefault();

    audioBox.innerHTML = '';
    notFound.innerText = '';
    definition.innerText = '';


    let word = input.value;

    if (word === '') {
        alert('please enter something');
    } else {
        getMeaning(word);
        clear(word);
    }
})

async function getMeaning(word) {
    loading.style.display = 'block';
    const response = await fetch(`https://dictionaryapi.com/api/v3/references/learners/json/${word}?key=${key}`);
    const data = await response.json();

    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerText = 'No result Found';
        return;
    } else if (typeof data[0] === 'string') {
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean';
        suggest.appendChild(heading);
        data.forEach(item => {
            suggestion = document.createElement('button');
            suggestion.classList.add('suggestion');
            suggestion.innerText = item;
            suggest.appendChild(suggestion);
            suggestion.addEventListener('click', (e) => {
                clear(item);
                getMeaning(item);
            })
            return;
        })


    } else {
        loading.style.display = 'none';
        let def = data[0].shortdef[0];
        definition.innerText = def;
        const soundName = data[0].hwi.prs[0].sound.audio;
        function renderSound(soundName) {
            let subfolder = soundName.charAt(0);
            let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=${key}`;
            let aud = document.createElement('audio');
            aud.classList.add('audioBar');
            aud.src = soundSrc;
            aud.controls = true;
            audioBox.appendChild(aud);
        }

        if (soundName) {
            renderSound(soundName);
        }
    }
}

function clear(item) {
    input.value = item;
    suggest.innerText = '';
}
