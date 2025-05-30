import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function AddItem() {
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    quantity: 1,
    price: 0,
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Item agregado:', data);
        setMessage('Item agregado exitosamente!');
        setNewItem({ name: '', description: '', quantity: 1, price: 0 }); // Limpiar el formulario
        setTimeout(() => setMessage(''), 3000);
        // Opcional: Redirigir al inventario después de agregar
        // router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Error al agregar item:', errorData);
        setMessage(`Error al agregar item: ${errorData.message || 'Ocurrió un error'}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setMessage('Error de red al intentar agregar el item.');
    }
  };

  return (
    <div>
      <Head>
        <title>Agregar Nuevo Item</title>
        <meta name="description" content="Formulario para agregar un nuevo item al inventario" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-gray-100 min-h-screen py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">Agregar Nuevo Item</h1>

          <Link href="/" className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4">
            Volver al Inventario
          </Link>

          {message && (
            <div className="bg-green-200 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Éxito!</strong>
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-md p-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Nombre:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newItem.name}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Descripción:
              </label>
              <textarea
                id="description"
                name="description"
                value={newItem.description}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
                Cantidad:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={newItem.quantity}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="1"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">
                Precio:
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={newItem.price}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                step="0.01"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Agregar Item
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}