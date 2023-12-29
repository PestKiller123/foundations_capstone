const cardsContainer = document.querySelector('#cards-container');
const nextBtn = document.getElementById("nextBtn");
const previousBtn = document.getElementById('previousBtn');
const teamContainer = document.querySelector('#team');
let pokemonId = 1;
let pokemonArray = [];

const getPokemon = async () => {
    const promises = [];

    for (let i = 0; i < 20; i++) {
        const promise = axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
            .then(response => {
                const data = response.data;
                const pokemonObject = {
                    name: data.name,
                    id: data.id,
                    types: data.types.map(type => type.type.name),
                    image: data.sprites.front_default,
                };
                pokemonArray.push(pokemonObject);
            })
            .catch(error => {
                console.error('Error fetching Pokemon data:', error);
                alert('Error fetching Pokemon data. Please check the console for details.');
            });

        promises.push(promise);
        pokemonId++;
    }

    await Promise.all(promises);
};

const pokemonCard = (pokemon) => {
    return `<div class='card'>
    <p>Name: ${pokemon.name}</p>
    <p>Types: ${pokemon.types.join(', ')}</p>
    <p>Id: ${pokemon.id}</p>
    <img src='${pokemon.image}' alt='${pokemon.name}' class='image'/>
    <button class='btn' onclick="addToTeam('${pokemon.name}', '${pokemon.id}', '${pokemon.types.join(', ')}', '${pokemon.image}')">Add</button>
    </div>`;
};
const renderPokemon = () => {
    cardsContainer.innerHTML = "";
    pokemonArray.forEach((pokemon) => {
        let pokemonHtml = pokemonCard(pokemon);
        cardsContainer.innerHTML += pokemonHtml;
    });
};
const showNextPokemon = async () => {
    pokemonArray = [];
    await getPokemon(); // Fetch the next 20 Pokemon
    renderPokemon(); // Render the updated Pokemon cards
    console.log(pokemonArray)
};

const showPreviousPokemon = async () => {
    if (pokemonId > 20) {
        pokemonArray = [];
        pokemonId -= 40; // Decrement to the previous set of 20 Pokemon
        await getPokemon(); // Fetch the previous 20 Pokemon
        renderPokemon(); // Render the updated Pokemon cards
        console.log(pokemonArray)
    }
};

const addToTeam = async (name, id, types, image) => {
    const body = {
        name: name,
        id: id,
        types: types,
        image: image
    };

    try {
        const response = await axios.post('http://localhost:4004/team/', body);
        console.log('Pokemon added successfully:', response.data);
        getTeam();
    } catch (error) {
        console.error('Error adding Pokemon:', error);
    }
};
const getTeam = () => {
    teamContainer.innerHTML = "";
    axios.get('http://localhost:4004/team/')
        .then(res => {
            res.data.forEach(elem => {
                let pokemonCard = `<div class="card">
                    <p>Name: ${elem.name}</p>
                    <p>Types: ${elem.types}</p>
                    <p>Id: ${elem.id}</p>
                    <img src='${elem.image}' alt='${elem.name}' class='image'/>
                    <button onclick="deleteCard(${elem['id']})">Delete</button>
                    </div>
                `

                teamContainer.innerHTML += pokemonCard;            
            })
        })
};
function deleteCard(id) {
    axios.delete(`http://localhost:4004/team/${id}`)
        .then(() => getTeam())
        .catch(err => console.log(err))
}


nextBtn.addEventListener('click', showNextPokemon);
previousBtn.addEventListener('click', showPreviousPokemon);
getPokemon().then(renderPokemon);
getTeam()


