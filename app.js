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

function addObjects(name, description) {
    const obj = {
        name: name,
        description: description
    }

    array.unshift(obj);
    localStorage.setItem('Cards', JSON.stringify(array));
}

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

function DeleteCard(name, cardElement) {

    array = array.filter(item => item.name !== name);
    localStorage.setItem('Cards', JSON.stringify(array));

    
    cardElement.remove();

    
    ActionNotification(2, "Elemento eliminado");
}

function EditCard(name, description, cardElement) {
    
    document.getElementById('name-acti').value = name;
    document.getElementById('description').value = description;

    
    const submitButton = document.querySelector('#form-items button[type="submit"]');
    submitButton.textContent = "Actualizar";

   
    submitButton.addEventListener('click', function onUpdate(event) {
        event.preventDefault();

        
        const updatedName = document.getElementById('name-acti').value;
        const updatedDescription = document.getElementById('description').value;

        
        const index = array.findIndex(item => item.name === name);
        if (index !== -1) {
            array[index] = { name: updatedName, description: updatedDescription };
            localStorage.setItem('Cards', JSON.stringify(array));
        }

        
        cardElement.querySelector('.card-title').textContent = updatedName;
        cardElement.querySelector('.card-text').textContent = updatedDescription;

        
        document.getElementById('form-items').reset();
        submitButton.textContent = "Agregar";
        submitButton.removeEventListener('click', onUpdate);

        
        ActionNotification(1, "Elemento actualizado");
    }, { once: true });
}

document.getElementById('btn-delete-all').addEventListener('click', () => {
    if (confirm("¿Estás seguro de que deseas eliminar todos los elementos?")) {
       
        array = [];
        localStorage.removeItem('Cards');

        
        sectionCard.innerHTML = "";

        
        ActionNotification(2, "Todos los elementos eliminados");
    }
});

function EditCard(name, description, cardElement) {
    const modal = document.getElementById('edit-modal');
    const editName = document.getElementById('edit-name');
    const editDescription = document.getElementById('edit-description');
    const saveButton = document.getElementById('save-edit');
    const closeModal = document.getElementById('close-modal');

    
    editName.value = name;
    editDescription.value = description;

    
    modal.style.display = 'flex';

   
    saveButton.onclick = () => {
        const updatedName = editName.value;
        const updatedDescription = editDescription.value;

        
        const index = array.findIndex(item => item.name === name);
        if (index !== -1) {
            array[index] = { name: updatedName, description: updatedDescription };
            localStorage.setItem('Cards', JSON.stringify(array));
        }

        
        cardElement.querySelector('.card-title').textContent = updatedName;
        cardElement.querySelector('.card-text').textContent = updatedDescription;

        
        modal.style.display = 'none';

        
        ActionNotification(1, "Elemento actualizado");
    };

    
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };

    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}


document.addEventListener('DOMContentLoaded', () => {
    const data = JSON.parse(localStorage.getItem('Cards'));
    if (data != null) {
        array = data
        const inverse = array.slice();
        inverse.reverse().forEach((e) => {
            document.startViewTransition(() => {
                CreateCard(e.name, e.description, sectionCard)
            })
        });
    }
})

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
/* btn-close */
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
