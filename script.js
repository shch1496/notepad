(function(){
    /* model*/
    const notepad = document.querySelector(".notepad")
    const addNote = document.querySelector(".add-note");
    const closeNote = document.querySelector(".close-btn");
    const saveNote = document.querySelector(".save-btn")
    const noteTitle = document.querySelector(".note-title");
    const noteBody = document.querySelector(".note-body");
    const container = document.querySelector(".container");
    const templates = document.querySelector("#templates");
    const textBold = document.querySelector(".text-bold"); 
    const textItalic = document.querySelector(".text-italic");
    const textUnderline = document.querySelector(".text-underline");
    const textCopy = document.querySelector(".text-copy");
    const topTitle = document.querySelector(".top-title");
  
    
    let cardColors = ["card-color1", "card-color2", "card-color3", "card-color4", "card-color5"]
    let notes = [];
    // let selectedText = "";
    //Selcetion range
    // let range;

    let selectedNoteId, selectedNote;



    const MAX_DECRIPTION_LENGTH = {
           max_title_length: 11,
           max_desc_length: 50
    }

    Object.freeze(MAX_DECRIPTION_LENGTH);

   
    saveNote.addEventListener("click", handleSaveClick);
    textBold.addEventListener("mousedown", handleTextBold);

    textItalic.addEventListener("mousedown", handleTextItalic);
    textUnderline.addEventListener("mousedown", handleTextUnderline);
    textCopy.addEventListener("click", handleTextCopy);
    




    // function getSelectedText() {  
    //   let selection = document.getSelection()
    //   range = selection.getRangeAt(0);
    // }

    // noteBody.addEventListener("selectstart", () => {

    //   document.addEventListener("selectionchange", getSelectedText);
    // });


    // noteBody.addEventListener("mouseleave", () => {
    //     document.removeEventListener("selectionchange", getSelectedText);
    // })



    noteBody.designMode = "on";
 
        


    function handleTextBold(){
    
            // Execute command if user presses the SHIFT button:
             
             document.execCommand("bold", false, null);
             return false;
        
          
    }

    function handleTextItalic(){
        document.execCommand("italic", false, null);
        return false;
    }


    function handleTextUnderline(){
        document.execCommand("underline", false, null);
        return false;
    }
    

    function handleTextCopy(){
  
        var copyText = noteBody.innerText;


        navigator.permissions.query({ name: "clipboard-write" }).then((result) => {
            if (result.state == "granted" || result.state == "prompt") {
                
                navigator.clipboard.writeText(copyText).then(() => {
        
                    alert("Text copied to clipboard");
                });
            }
          });
   
    }
   

  


    function handleSaveClick(){
        if(notes.length == 0){
            container.innerText = ""
        }
         

            
            let max_title_length = MAX_DECRIPTION_LENGTH.max_title_length;
            let max_desc_length = MAX_DECRIPTION_LENGTH.max_desc_length
            let date = new Date();

            let title = noteTitle.value.trim();
            let body = noteBody.innerHTML.trim();
            let bodyText = noteBody.textContent.trim();
            if(!title && !bodyText){
               alert("Write something");
               return
            }
    
    
            if(selectedNoteId && selectedNote){
    
                //Array change
                let note =  notes.find(card => selectedNoteId == card.id);
                note.title = title;
                note.body = body;
                note.date = date;
    
    
               //DOM change
               let cardTitle = selectedNote.querySelector(".card-title");
                cardTitle.innerText = `${title.substring(0, max_title_length)}${title.length > max_title_length ? "..." : ""}`
            
               let cardBody = selectedNote.querySelector(".card-desc");
               let noteDate = selectedNote.querySelector(".note-date");
               noteDate.textContent = `${date.toLocaleString("en-In", {year: 'numeric', month: 'short', day:'numeric',  hour: "numeric", minute:"numeric"})}`
               
               
               cardBody.innerText = `${bodyText.substring(0, max_desc_length)}${bodyText.length > max_desc_length ? "..." : ""}`
          
               
               selectedNoteId=""
               selectedNote=""
    
    
            }else{


               
                let id = generateUniqueId();

                let cardColorIdx = Math.floor(Math.random() * (4 - 0 + 1)) + 0;
               
            
                let newNote = {
                   id: id,
                   title: title,
                   body: body,
                   date: date,
                   colorIdx: cardColorIdx
                }
        
                // push new note to the array
                notes.push(newNote);
              
                let cardTemplate = templates.content.querySelector(".card");
                let card = document.importNode(cardTemplate, true);

                let cardDeleteBtn = card.querySelector(".card-delete");
                cardDeleteBtn.addEventListener("click", handleDeleteClick)

                let cardTitle = card.querySelector(".card-title");
                cardTitle.textContent = `${title.substring(0, max_title_length)}${title.length > max_title_length ? "..." : ""}`
           
                let cardBody = card.querySelector(".card-desc");

                let noteDate = card.querySelector(".note-date");
                noteDate.textContent = `${date.toLocaleString("en-In", {year: 'numeric', month: 'short', day:'numeric',  hour: "numeric", minute:"numeric"})}`
        
               
                cardBody.textContent = `${bodyText.substring(0, max_desc_length)}${bodyText.length > max_desc_length ? "..." : ""}`
               
                card.setAttribute("data-card-id", id);
                
                // Random nos between 0 to 4
          
                let generateRandomCardColors = cardColors[cardColorIdx];
                card.classList.add(generateRandomCardColors)

                container.append(card);
        
                card.addEventListener("click", handleCardClick)
                
    
                
        }

        addToLocalStorage();
        closeNote.dispatchEvent(new Event("click")); 
        // noteBody.innerText = ""
        // noteTitle.value = ""
    
        

   }


    function generateUniqueId(){
        let uniqueId = Math.floor(Math.random()*1000000);
        return uniqueId;
     }





  function handleCardClick() {
 
    let cardId = this.dataset.cardId;
    let note=  notes.find(card => cardId == card.id);
     
    let title = note.title;
    let body = note.body;

    noteTitle.value = title
    noteBody.innerHTML = body;
    selectedNoteId = cardId;
    selectedNote = this;
    topTitle.innerText = title;
    notepad.showModal();
   
   
  }


  function handleDeleteClick(event){

  
    const confirmDelete = confirm("Are you sure you want to delete this note?");

    if (confirmDelete) {
        let card = event.target.parentNode;
        let cardId = card.dataset.cardId;
        let newNotes = notes.filter(note => note.id != cardId);
     
        notes = newNotes;

        deleteFromLocalStorage()
        container.removeChild(card);
    }

    event.stopPropagation()
 }
    



   

    
    addNote.addEventListener("click", function(){
        noteBody.innerText = ""
        noteTitle.value = ""
        topTitle.innerHTML = "Untitled"
        notepad.showModal();
    
    
    })
    
    
    
    closeNote.addEventListener("click", function(){
        selectedNote = ""
        selectedNoteId =""
        notepad.close();
    
    })



    //Placeholder for contentEditable div

    const ele = document.getElementById('note-body');

    // Get the placeholder attribute
    const placeholder = ele.getAttribute('data-placeholder');

    // Set the placeholder as initial content if it's empty
    ele.innerHTML === '' && (ele.innerHTML = placeholder);

    ele.addEventListener('focus', function (e) {
        const value = e.target.innerHTML;
        value === placeholder && (e.target.innerHTML = '');
    });

    ele.addEventListener('blur', function (e) {
        const value = e.target.innerHTML;
        value === '' && (e.target.innerHTML = placeholder);
    });

   


   //add notes to local storage

   function addToLocalStorage(){
    let jsonData= JSON.stringify(notes);
    localStorage.setItem("notes", jsonData)
   }

   function loadFromLocalStorage(){
    let jsonData = localStorage.getItem("notes");
    if(!jsonData){
        return;

    }

    notes = JSON.parse(jsonData);
    let max_title_length = MAX_DECRIPTION_LENGTH.max_title_length
    let max_desc_length = MAX_DECRIPTION_LENGTH.max_desc_length
    for(let i=0; i<notes.length; i++){
          
        let cardTemplate = templates.content.querySelector(".card");
        let card = document.importNode(cardTemplate, true);
        let cardDeleteBtn = card.querySelector(".card-delete");
        let cardTitle = card.querySelector(".card-title");
        cardTitle.textContent = `${notes[i].title.substring(0, max_title_length)}${notes[i].title.length > max_title_length ? "..." : ""}`
        let cardBody = card.querySelector(".card-desc");
        let noteDate = card.querySelector(".note-date");
        let date = new Date(notes[i].date)
        noteDate.textContent = `${date.toLocaleString("en-In", {year: 'numeric', month: 'short', day:'numeric',  hour: "numeric", minute:"numeric"})}`
       
        let body = notes[i].body;
        body = body.replace(new RegExp('<[^>]*>', 'g'), '')

        cardBody.textContent = `${body.substring(0, max_desc_length)}${body.length > max_desc_length ? "..." : ""}`
       
        card.setAttribute("data-card-id", notes[i].id);

        let generateRandomCardColors = cardColors[notes[i].colorIdx];
        card.classList.add(generateRandomCardColors)

        container.append(card);
        cardDeleteBtn.addEventListener("click", handleDeleteClick)

        card.addEventListener("click", handleCardClick)
    }
   }


   function deleteFromLocalStorage(){
    let jsonData = localStorage.getItem("notes");
    if(!jsonData){
        return;

    }

    jsonData = notes
    jsonData= JSON.stringify(jsonData);
    localStorage.setItem("notes", jsonData)

   }

   loadFromLocalStorage();

})();


