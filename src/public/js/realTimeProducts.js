const socket = io()
const products = document.getElementById('products');
const formulario = document.getElementById('form')


const buttonDelete = () => {
    const buttons = document.getElementsByClassName('btn-danger')
    const arrayButton = Array.from(buttons)

    arrayButton.forEach(element => {
        element.addEventListener('click', () => {
            Swal.fire({
                title: '¿Desea eliminar este producto?',
                showDenyButton: true,
                showCancelButton: false,
                confirmButtonText: 'Yes',
                denyButtonText: 'No',
                customClass: {
                actions: 'my-actions',
                cancelButton: 'order-1 right-gap',
                confirmButton: 'order-2',
                denyButton: 'order-3',
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    socket.emit('delete', Number(element.id))
                    socket.on('delete', (event) => {
                    Swal.fire(event.message, '', 'success')
                    })
                } 
                })
        })
        
    })
}



socket.on('products', data => {

    let productos = ''
    data.data.forEach(producto => {
        productos += `<div class="card bg-primary mb-5 ms-5 mx-4 text-bg-primary " style="max-width: 20rem;">
                        <div class="card-body ">
                            <h4 class=" text-center">${producto.title}</h4>
                            <p class="card-text">
                                <li>
                                    Id: ${producto.id}
                                </li>
                                <li>
                                    Descripcion: ${producto.description}
                                </li>
                                <li>
                                    Precio: $${producto.price}
                                </li>
                                <li>
                                    Categoria: ${producto.category}
                                </li>
                                <li>
                                    Status: ${producto.status}
                                </li>
                                <li>
                                    Stock: ${producto.stock}
                                </li>
                                <img class="img-fluid" src="${producto.thumbnails}">
                                
                                </img>
                            </p>
                        </div>
                        <div>Codigo: ${producto.code}</div>
                        <div class="d-flex justify-content-center mb-4">
                            <button type="button" class=" btn btn-danger" id="${producto.id}">Eliminar</button>
                        </div>
                    </div>`
    });
    products.innerHTML = productos
    buttonDelete()
    
})


formulario.addEventListener('submit', (event) => {
    event.preventDefault()
    console.log(event.target);
    const data = Object.fromEntries(new FormData(event.target))
    data['status'] = new Boolean(data['status'])
    data['thumbnails'] = ['empty']
    data['price'] = Number(data['price'])
    data['stock'] = Number(data['stock'])

    socket.emit('product', data)

    socket.on('message', (res) => {
        if(res.status === 'error') {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: res.message,
                
            })
        }
        else{
            Swal.fire({
                icon: 'success',
                title: 'Producto Agregado',
                text: res.message,
                
            })
        }
    })
    formulario.reset()
})










