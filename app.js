function attachEvents() {
    const baseURL = "https://fisher-game.firebaseio.com/catches";
    const loadBtn = document.querySelector(".load");
    const addBtn = document.querySelector("#addForm .add");

    let mainDiv = document.getElementById("main");
    let catchesDiv = document.getElementById("catches");
    //Hide first element that we have in HTML code
    catchesDiv.style.display = "none";
    let divId = document.querySelector("#catches .catch");
    //destructure the input elements in the load area
    let [anglerOut, weightOut, speciesOut, locationOut, baitOut, captureTimeOut] = document.querySelectorAll(".catch input");

    function fisherObj(angler, weight, species, location, bait, captureTime) {
        let fishers = {
            angler: angler.value,
            weight: weight.value,
            species: species.value,
            location: location.value,
            bait: bait.value,
            captureTime: captureTime.value
        }

        return fishers;
    }

    addBtn.addEventListener('click', () => {
        let [angler, weight, species, location, bait, captureTime] = document.querySelectorAll("#addForm input");

        fetch(`${baseURL}.json`, {
            method: "POST",
            //Create object of fisherman and send him to server DB
            body: JSON.stringify(fisherObj(angler, weight, species, location, bait, captureTime))
        });

        angler.value = "";
        weight.value = "";
        species.value = "";
        location.value = "";
        bait.value = "";
        captureTime.value = "";
    });

    loadBtn.addEventListener("click", () => {
        let id = divId.id;

        if (id !== "") {
            //Use load btn to reload the fisherman list
            //each time that when we need 
            Array.from(mainDiv.childNodes).filter((el, i) => {
                if (i <= 3) {
                    return el;
                } else if (i === 4) {
                    //Save first div that we will colone and fill our load area
                    return el.style.display = "none";
                } else {
                    let id = el.id;
                    //Delet elemens to empty load list on HTML page 
                    document.getElementById(`${id}`).remove();
                }
            });
        }

        fetch(`${baseURL}.json`)
            .then(response => response.json())
            .then(data => {
                Object.entries(data)
                    .forEach(([fisherManId, dataFisherMan]) => {
                        catchesDiv.style.display = "";
                        //Change input fields with saved data base 
                        divId.dataset.id = fisherManId;//This is unneeded in the code but wanted on condition from exercise
                        //Create id in created element-easy to operate(delete, update) elements
                        divId.id = fisherManId;
                        anglerOut.value = dataFisherMan.angler;
                        weightOut.value = dataFisherMan.weight;
                        speciesOut.value = dataFisherMan.species;
                        locationOut.value = dataFisherMan.location;
                        baitOut.value = dataFisherMan.bait;
                        captureTimeOut.value = dataFisherMan.captureTime;
                        //Clone the element div that we need
                        let coloneDiv = catchesDiv.cloneNode(true);
                        //Append to HTML tree
                        mainDiv.appendChild(coloneDiv);
                    });
                //Chek and delete first div Elemet that we clone
                if (id === "" || Array.from(mainDiv.childNodes)[1].id !== id) {
                    //We delete first element because after filed hi save last obj from DB and will display them one more time
                    //or after use delete btn and if we try to refresh with load btn id will not exist and will skip the if-else 
                    document.getElementById("catches").remove();
                } else {
                    //Use to refresh elements and delete first elemt that equal with last (find only first equal like method find() or indexOf())
                    document.getElementById(`${id}`).parentElement.remove();
                }

                let updateBtn = Array.from(document.getElementsByClassName("update"));
                let deleteBtn = Array.from(document.getElementsByClassName("delete"));

                updateBtn.map((x) => x.addEventListener("click", (e) => { fisherUpdate(e) }));
                deleteBtn.map((x) => x.addEventListener("click", (e) => { fisherDelete(e) }));
            })
            .catch((e) => alert('Data for fishermen inexistent!!!'));
            //If no data on the server DB

    });

    function fisherUpdate(e) {
        let id = e.target.parentElement.id;
        let [angler, weight, species, location, bait, captureTime] = document.querySelectorAll(`#${id} input`);

        fetch(`${baseURL}/${id}.json`, {
            method: "PUT",
            body: JSON.stringify(fisherObj(angler, weight, species, location, bait, captureTime))
        });
    }

    function fisherDelete(e) {
        let id = e.target.parentElement.id;

        fetch(`${baseURL}/${id}.json`, {
            method: "DELETE"
        })

        document.getElementById(`${id}`).parentElement.remove();
    }
}

attachEvents();

