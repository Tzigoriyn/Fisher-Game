function attachEvents() {
    const baseURL = "https://fisher-game.firebaseio.com/catches";
    const loadBtn = document.querySelector(".load");
    const addBtn = document.querySelector("#addForm .add");

    let mainDiv = document.getElementById("main");
    let catchesDiv = document.getElementById("catches");
    catchesDiv.style.display = "none";
    let divId = document.querySelector("#catches .catch");

    let [anglerOut, weightOut, speciesOut, locationOut, baitOut, captureTimeOut] = document.querySelectorAll(".catch input");

    addBtn.addEventListener('click', () => {
        let [angler, weight, species, location, bait, captureTime] = document.querySelectorAll("#addForm input");

        fetch(`${baseURL}.json`, {
            method: "POST",
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
        let id = divId.id

        if (id !== "") {
            Array.from(mainDiv.childNodes).filter((el, i) => {
                if (i <= 3) {
                    return el;
                } else if (i === 4) {
                    return el.style.display = "none";
                } else {
                    let id = el.id;
                    document.getElementById(`${id}`).remove();
                }
            });
        }

        fetch(`${baseURL}.json`)
            .then(response => response.json())
            .then(data => {
                console.log((data));
                Object.entries(data)
                    .forEach(([fisherManId, dataFisherMan]) => {
                        catchesDiv.style.display = "";
                        divId.dataset.id = fisherManId;
                        divId.id = fisherManId;
                        anglerOut.value = dataFisherMan.angler;
                        weightOut.value = dataFisherMan.weight;
                        speciesOut.value = dataFisherMan.species;
                        locationOut.value = dataFisherMan.location;
                        baitOut.value = dataFisherMan.bait;
                        captureTimeOut.value = dataFisherMan.captureTime;

                        let coloneDiv = catchesDiv.cloneNode(true);

                        mainDiv.appendChild(coloneDiv)
                    });
                if (id === "" || Array.from(mainDiv.childNodes)[1].id !== id) {
                    document.getElementById("catches").remove();
                } else {
                    document.getElementById(`${id}`).parentElement.remove();
                }

                let updateBtn = Array.from(document.getElementsByClassName("update"));
                let deleteBtn = Array.from(document.getElementsByClassName("delete"));

                updateBtn.map((x) => x.addEventListener("click", (e) => { fisherUpdate(e) }));
                deleteBtn.map((x) => x.addEventListener("click", (e) => { fisherDelete(e) }));
            })
            .catch((e) => alert('Data for fishermen inexistent!!!'))

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

    function fisherObj(angler, weight, species, location, bait, captureTime) {
        let fishers = {
            angler: angler.value,
            weight: weight.value,
            species: species.value,
            location: location.value,
            bait: bait.value,
            captureTime: captureTime.value
        }

        return fishers
    }
}

attachEvents();

