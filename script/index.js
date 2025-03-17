// from validation
const submitFrom = (e)=>{
    // e.preventDefault();
    const inputName =document.getElementById("name-input").value;
    const inputPass =document.getElementById("input-password").value;
    if(inputName.length > 0)
    {
        if(inputPass == "123456"){
            document.getElementById("header").classList.remove("hidden");
            document.getElementById("banner").classList.add("hidden");
            document.getElementById("banner").classList.add("hidden");
            document.getElementById("learn-section").classList.remove("hidden");
            document.getElementById("Faq-section").classList.remove("hidden");
            // Sweet Alert
            Swal.fire({
                title: "Login Success!",
                // text: "You clicked the button!",
                icon: "success"
              });
        }
        else if(inputPass.length == 0)
        {
            alert("Please Enter Your Password")
        }
        else{
            alert("Your Password Incorrect")
        }
    }
    else{
        alert("Please Enter Your Name")
    }
    
}

const logoutSection =()=>{
    document.getElementById("header").classList.add("hidden");
    document.getElementById("banner").classList.remove("hidden");
    document.getElementById("banner").classList.remove("hidden");
    document.getElementById("learn-section").classList.add("hidden");
    document.getElementById("Faq-section").classList.add("hidden");
}

// dynamically generated buttons fetch
const lessonButton = () =>{
    fetch("https://openapi.programming-hero.com/api/levels/all")
    .then(res => res.json())
    .then(data => displayButton(data.data))
}
const removeActiveClass = () =>{
    const activeClass = document.getElementsByClassName("active");
    for(let activeBtn of activeClass)
    {
        activeBtn.classList.remove("active");
    }
}

// Clicking a Specific Lesson Button fetch
const lessonButtonClick = (id) =>{
    document.getElementById("lesson-select-section").classList.add("hidden");
    // loading spinner
    document.getElementById("loading-spinner").classList.remove("hidden");
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        removeActiveClass();
        const clickedBtn = document.getElementById(`btn-${id}`);
        clickedBtn.classList.add("active")
        lessonDisplay(data.data)
    })
    .catch(err =>{
        console.log(err);
    })
    .finally(()=>{
        document.getElementById("loading-spinner").classList.add("hidden");
    })
}
// Vocabulary Details fetch
const vocabularyDetails =(id)=>{
    const url=`https://openapi.programming-hero.com/api/word/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => DisplayVocabularyDetails(data.data))
}
// Danamic Button Display
const displayButton = (buttons) =>{

    const lessonBtn = document.getElementById("lesson-btn");
    buttons.forEach (btn =>{

        const lesson = document.createElement("div");
        lesson.innerHTML=`
        <button id="btn-${btn.level_no}" onclick="lessonButtonClick(${btn.level_no})" class="btn btn-outline btn-primary"><img src="assets/fa-book-open.png" alt="">Lesson ${btn.level_no}</button>
        `
        lessonBtn.appendChild(lesson);
    })

}

// Specific Lesson Button Display
const lessonDisplay = (lessons) =>{

    const vocabularySection = document.getElementById("vocabulary-section");
    const noWord = document.getElementById("no-word-found");
    vocabularySection.innerHTML=""; 
    noWord.innerHTML="";
    if(lessons.length === 0)
    {
        noWord.innerHTML=`
        <div class="flex flex-col justify-center items-center space-y-4 bg-[#F8F8F8] p-10 ">
                <img src="assets/alert-error.png" alt="error-img">
                <p class="text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h4 class="text-3xl">নেক্সট Lesson এ যান</h4>
            </div>
        `
    }
    lessons.forEach(lesson =>{
        const lessonCard = document.createElement("div");
        let emptyValue = lesson.meaning;
        if(lesson.meaning == null)
        {
            emptyValue="অর্থ নেই";
        }
        lessonCard.innerHTML=`
        <div class=" space-y-8 p-6 rounded-lg bg-[#FFFFFF]">
                    <div class="text-center space-y-3">
                        <h4 class="text-2xl font-semibold">${lesson.word}</h4>
                        <p class="text-md">Meaning /Pronounciation</p>
                        <p class="text-xl font-semibold text-[#18181B]">"${emptyValue}/${lesson.pronunciation}"</p>
                    </div>
                    <div class="flex justify-between">
                        <button onclick="vocabularyDetails(${lesson.id})"  class="btn"><i class="fa-solid fa-circle-info"></i></button>
                        <button onclick="pronounceWord('${lesson.word.replace(/'/g,"\\'")}')" class="btn"><i class="fa-solid fa-volume-high"></i></button>
                    </div>
                </div>
        `
        vocabularySection.appendChild(lessonCard)
    })
}

// vocabulary Details Display
const DisplayVocabularyDetails = (details) =>{
    const vocabularyDetails = document.getElementById("vocabulary-details");
    let emptyValue=details.meaning;
    if(details.meaning == null)
    {
        emptyValue ="অর্থ পাওয়া যায়নি";
    }
    vocabularyDetails.innerHTML=`
    <dialog id="my_modal_5" class="modal modal-bottom sm:modal-middle ">
                <div class="modal-box space-y-3">
                  <div class="p-3 rounded-md shadow-md shadow-gray-300 space-y-3">
                    <h3 class="text-2xl font-bold flex">${details.word} (<img src="assets/fi-ss-microphone.png" alt="mircro-img">:${details.pronunciation})</h3>
                  <div>
                    <p class="font-semibold text-xl">Meaning</p>
                    <p class="font-medium text-md">${emptyValue}</p>
                  </div>
                  <div>
                    <p class="font-semibold text-xl">Example</p>
                    <p class="text-md">${details.sentence}</p>
                  </div>
                  <div>
                    <p class="font-medium text-xl">সমার্থক শব্দ গুলো</p>
                    <p class="text-md">
                        ${details.synonyms?.length ? details.synonyms.map(syn =>`<button class="btn">${syn}</button> `).join('') : ""}
                    </p>
                  </div>
                  </div>
                  <div>
                    <div class="modal-action flex justify-start">
                    <form method="dialog" >
                      <button class="btn rounded-lg btn-outline btn-primary">Complete Learning</button>
                    </form>
                    </div>
                  </div>
                </div>
        </dialog>
    `
    const modal = document.getElementById("my_modal_5");
    if (modal) {
        modal.showModal();
    }
}

// Voice sound pronunciation
const pronounceWord=(word)=> {
    console.log(word)
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-EN'; // English
    window.speechSynthesis.speak(utterance);
  } 
lessonButton();
