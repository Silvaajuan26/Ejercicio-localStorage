const API_URL = "http://localhost:3000/cards";
const sectionCard = document.getElementById('group-card');
const notification = document.getElementById('notifi');
const searchSection = document.getElementById('sec-search');
const containerSearch = document.getElementById('group-card-search');
const search = document.getElementById('search');

let array = [];
document.getElementById('form-items').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name-acti').value;
    const description = document.getElementById('description').value;
    addObjects(name, description);
    document.startViewTransition(() => {
        ActionNotification(1);
        CreateCard(name, description, sectionCard);
    })
})

async function addObjects(name, description) {
    const obj = { name, description };
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(obj)
        });
        const newCard = await response.json();
        array.unshift(newCard);
        CreateCard(newCard.name, newCard.description, sectionCard);
        ActionNotification(1);
    } catch (error) {
        console.error("Error al crear la tarjeta:", error);
    }
}


async function fetchCards() {
    try {
        const response = await fetch(API_URL);
        array = await response.json();
        array.reverse().forEach(card => {
            CreateCard(card.name, card.description, sectionCard);
        });
    } catch (error) {
        console.error("Error al obtener las tarjetas:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchCards);


function CreateCard(name, description, idSection) {
    const divCard = document.createElement("div");
    divCard.className = "card fade";
    divCard.innerHTML = `
            <header class="card-header">
                        <h1 class="card-title align-center">${name}</h1>
                    </header>
                    <div class="card-body">
                        <div class="card-text">
                            ${description}
                        </div>
                    </div>
    `;
    idSection.prepend(divCard);
    divCard.addEventListener('animationend', () => {
        divCard.classList.remove('fade');
    }, { once: true })
}


function CreateCard(name, description, idSection) {
    const divCard = document.createElement("div");
    divCard.className = "card fade";
    divCard.innerHTML = `
        <header class="card-header">
            <h1 class="card-title align-center">${name}</h1>
        </header>
        <div class="card-body">
            <div class="card-text">${description}</div>
            <button class="btn btn-danger btn-delete">Eliminar</button>
            <button class="btn btn-primary btn-edit">Editar</button>
        </div>
    `;
    idSection.prepend(divCard);

   
    divCard.querySelector('.btn-delete').addEventListener('click', () => {
        DeleteCard(name, divCard);
    });

    
    divCard.querySelector('.btn-edit').addEventListener('click', () => {
        EditCard(name, description, divCard);
    });

    divCard.addEventListener('animationend', () => {
        divCard.classList.remove('fade');
    }, { once: true });
}

async function DeleteCard(name, cardElement) {
    const cardToDelete = array.find(item => item.name === name);
    if (cardToDelete) {
        try {
            await fetch(`${API_URL}/${cardToDelete.id}`, { method: 'DELETE' });
            array = array.filter(item => item.id !== cardToDelete.id);
            cardElement.remove();
            ActionNotification(2, "Elemento eliminado");
        } catch (error) {
            console.error("Error al eliminar la tarjeta:", error);
        }
    }
}


async function EditCard(name, description, cardElement) {
    const cardToEdit = array.find(item => item.name === name);
    if (cardToEdit) {
        const updatedName = prompt("Nuevo nombre:", name);
        const updatedDescription = prompt("Nueva descripción:", description);
        const updatedCard = { ...cardToEdit, name: updatedName, description: updatedDescription };

        try {
            await fetch(`${API_URL}/${cardToEdit.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCard)
            });
            cardElement.querySelector('.card-title').textContent = updatedName;
            cardElement.querySelector('.card-text').textContent = updatedDescription;
            ActionNotification(1, "Elemento actualizado");
        } catch (error) {
            console.error("Error al actualizar la tarjeta:", error);
        }
    }
}


async function deleteAllCards() {
    if (confirm("¿Estás seguro de que deseas eliminar todos los elementos?")) {
        try {
            for (const card of array) {
                await fetch(`${API_URL}/${card.id}`, { method: 'DELETE' });
            }
            array = [];
            sectionCard.innerHTML = "";
            ActionNotification(2, "Todos los elementos eliminados");
        } catch (error) {
            console.error("Error al eliminar todas las tarjetas:", error);
        }
    }
}

document.getElementById('btn-delete-all').addEventListener('click', deleteAllCards);



function ActionNotification(key) {
    switch (key) {
        case 1:
            notification.firstElementChild.innerText = "Se agrego con exito";
            notification.classList.add('notification-add', 'scale-in');
            setTimeout(() => {
                notification.classList.remove('scale-in');
                notification.classList.add('scale-out');
                setTimeout(() => {
                    notification.classList.remove('notification-add', 'scale-out');
                }, 1000);
            }, 2000);
            break;
        case 2:

            break;
        default:
            break;
    }
}

document.getElementById('btn-search').addEventListener('click', () => {
    document.startViewTransition(() => {
        searchSection.style.display = "flex";
    })
});

document.getElementById('btn-close').addEventListener('click', () => {
    document.startViewTransition(() => {
        searchSection.style.display = "none";
    })
});

search.addEventListener('input', () => {
    const text = search.value;
    if (text != '') {
        const resultado = array.filter((data) => data.name.includes(text));
        containerSearch.innerHTML = "";
        resultado.forEach((e) => {
            CreateCard(e.name, e.description, containerSearch);
        });
    }

})
