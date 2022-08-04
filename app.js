let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = 'c9ff275d-ee98-4f2e-8a80-20796bd37d0c';
let notFound = document.querySelector('.not_found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');

searchBtn.addEventListener('click',async function(e){
    e.preventDefault();
   
    // clear data
    audioBox.innerHTML = '';
    notFound.innerText = '';
    defBox.innerText = '';

    //Get input data

    let word = input.value ;

    // Call API get data 

   if (word === '') {
        alert('Word is required')
        return;
   }

   await getData(word);
   
});
 async function getData(word) {
    loading.style.display='unset'
    // ajax call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
    const data = await response.json();
    
    //  if empty result
    if (!data.length){

        notFound.innerText = ' No result found ';
        return;
    }

    // if result is suggetion
    if (typeof data[0] === 'string'){
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean?'
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggetion = document.createElement('span');
            suggetion.classList.add('suggested');
            suggetion.innerText = element;
            notFound.appendChild(suggetion);
            suggetion.style.cursor='pointer'
            suggetion.addEventListener('click',()=>{
                // alert(element);
                input.value=element;

            })
        })
    }

    // result found
    loading.style.display = 'none'; 
    let defination = data[0].shortdef[0];   
    defBox.innerText = defination;

    // sound 
    const soundName = data[0].hwi.prs[0].sound.audio
        if(soundName){
            // console.log(soundName.charAt[0])
            renderSound(soundName);
        }
    console.log(data);
}

function renderSound(soundName){
    // https://media.merriam-webster.com/audio/prons/
    let subfolder = Array.from(soundName)[0];
    console.log(soundName)
    let soundSrc = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subfolder}/${soundName}.mp3`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;  
    aud.type="audio/mpeg"
    audioBox.appendChild(aud);
}